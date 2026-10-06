/**
 * jobSync.service.js
 *
 * Responsible for keeping the Jobs collection populated with REAL, fresh data.
 *
 * Priority chain:
 *  1. Adzuna API  (free, 250 req/day, great India coverage)
 *  2. JSearch API (RapidAPI — if RAPIDAPI_KEY is set)
 *  3. AI-generated via Groq/Gemini (always available, zero cost)
 *
 * Usage:
 *  const { getOrRefreshJobs } = require("./jobSync.service");
 *  const jobs = await getOrRefreshJobs(studentSkills);
 *
 * Jobs are cached in MongoDB for 48 hours.
 * Recruiter-posted jobs are NEVER touched by this service.
 */

const Job = require("../models/Job");
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const CACHE_TTL_HOURS = 48;
const MIN_AI_JOBS = 15; // Always maintain at least this many AI jobs

// ── Helpers ────────────────────────────────────────────────────────────────────

function addHours(h) {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

function addDays(d) {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1000);
}

function dedupKey(title, company) {
  return `${title.toLowerCase().trim()}_${company.toLowerCase().trim()}`;
}

// ── 1. Adzuna API ──────────────────────────────────────────────────────────────

async function fetchFromAdzuna(skills = []) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_API_KEY;
  if (!appId || !appKey) return null;

  const query = skills.slice(0, 3).join(" ") || "software developer";
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(query)}&content-type=application/json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Adzuna responded ${res.status}`);
    const data = await res.json();

    return (data.results || []).map((j) => ({
      title: j.title,
      company: j.company?.display_name || "Unknown",
      description: j.description || j.title,
      location: j.location?.display_name || "India",
      salary: j.salary_min
        ? `₹${Math.round(j.salary_min / 100000)}–${Math.round((j.salary_max || j.salary_min * 1.5) / 100000)} LPA`
        : undefined,
      jobType: j.contract_time === "part_time" ? "Part Time" : "Full Time",
      requirements: (j.category?.tag || "").split(",").map((s) => s.trim()).filter(Boolean),
      applyUrl: j.redirect_url,
      externalId: j.id,
      source: "adzuna",
      deadline: addDays(30),
      expiresAt: addHours(CACHE_TTL_HOURS),
    }));
  } catch (err) {
    console.warn("⚠️ [Adzuna] API call failed:", err.message);
    return null;
  }
}

// ── 2. JSearch (RapidAPI) ──────────────────────────────────────────────────────

async function fetchFromJSearch(skills = []) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  const query = `${skills.slice(0, 2).join(" ")} developer India`;
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=2&date_posted=week`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });
    if (!res.ok) throw new Error(`JSearch responded ${res.status}`);
    const data = await res.json();

    return (data.data || []).map((j) => ({
      title: j.job_title,
      company: j.employer_name,
      description: j.job_description?.slice(0, 500) || j.job_title,
      location: j.job_city || j.job_country || "India",
      salary:
        j.job_min_salary
          ? `₹${Math.round(j.job_min_salary / 100000)}–${Math.round((j.job_max_salary || j.job_min_salary * 1.4) / 100000)} LPA`
          : undefined,
      jobType: j.job_employment_type === "INTERN" ? "Internship" : "Full Time",
      requirements: j.job_required_skills || [],
      applyUrl: j.job_apply_link,
      externalId: j.job_id,
      source: "jsearch",
      deadline: j.job_offer_expiration_datetime_utc
        ? new Date(j.job_offer_expiration_datetime_utc)
        : addDays(30),
      expiresAt: addHours(CACHE_TTL_HOURS),
    }));
  } catch (err) {
    console.warn("⚠️ [JSearch] API call failed:", err.message);
    return null;
  }
}

// ── 3. AI-Generated Jobs (Groq → Gemini fallback) ─────────────────────────────

async function generateJobsWithAI(skills = [], targetRole = "") {
  const prompt = buildAIJobPrompt(skills, targetRole);

  // Try Groq first
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groqModels = [
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
    ];
    const groq = new Groq({ apiKey: groqKey });
    for (const model of groqModels) {
      try {
        const res = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are a job board API. Return ONLY a valid JSON array of job objects. No markdown, no explanation.",
            },
            { role: "user", content: prompt },
          ],
          model,
          temperature: 0.8,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });
        const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");
        const jobsArray = parsed.jobs || parsed.opportunities || parsed.results || [];
        if (jobsArray.length > 0) {
          console.log(`✅ [JobSync] AI generated ${jobsArray.length} jobs via Groq (${model})`);
          return normalizeAIJobs(jobsArray, skills);
        }
      } catch (err) {
        console.warn(`⚠️ [JobSync] Groq model ${model} failed:`, err.message);
      }
    }
  }

  // Fallback to Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const geminiModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
    const gemini = new GoogleGenerativeAI(geminiKey);
    for (const modelName of geminiModels) {
      try {
        const model = gemini.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
        });
        let text = result.response.text().replace(/^```json/, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(text);
        const jobsArray = parsed.jobs || parsed.opportunities || parsed.results || [];
        if (jobsArray.length > 0) {
          console.log(`✅ [JobSync] AI generated ${jobsArray.length} jobs via Gemini (${modelName})`);
          return normalizeAIJobs(jobsArray, skills);
        }
      } catch (err) {
        console.warn(`⚠️ [JobSync] Gemini model ${modelName} failed:`, err.message);
      }
    }
  }

  console.error("❌ [JobSync] All AI providers failed for job generation");
  return [];
}

function buildAIJobPrompt(skills, targetRole) {
  const skillList = skills.length > 0 ? skills.join(", ") : "JavaScript, Python, React";
  const role = targetRole || "software developer";
  return `Generate 20 realistic, diverse Indian tech company job listings for a student with skills: ${skillList}.
Target role preference: ${role}.

Return a JSON object with a "jobs" array. Each job must have:
- title: job title
- company: realistic Indian or global tech company name (mix of TCS, Infosys, startups, MNCs)
- description: 2-3 sentence description
- location: Indian city or "Remote"
- salary: salary range like "8-12 LPA" or "₹25,000/month" for internships
- jobType: one of "Full Time", "Internship", "Remote"
- requirements: array of 4-8 specific skills required for the role
- deadline: ISO date string 2-6 weeks from now (${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()})
- applyUrl: realistic-looking URL like "https://careers.company.com/job/12345"

Mix of:
- 12 Full Time roles (entry-level SDE, ML engineer, DevOps, etc.)
- 8 Internship opportunities
- Various companies: TCS, Wipro, Infosys, Flipkart, Swiggy, CRED, Razorpay, startups
- Requirements should OVERLAP with the student's skills so they get matches`;
}

function normalizeAIJobs(raw, skills) {
  return raw
    .filter((j) => j.title && j.company && j.description)
    .map((j) => ({
      title: String(j.title),
      company: String(j.company),
      description: String(j.description),
      location: String(j.location || "India"),
      salary: j.salary ? String(j.salary) : undefined,
      jobType: ["Full Time", "Internship", "Part Time", "Contract", "Remote"].includes(j.jobType)
        ? j.jobType
        : "Full Time",
      requirements: Array.isArray(j.requirements)
        ? j.requirements.map(String).filter(Boolean)
        : [],
      applyUrl:
        j.applyUrl &&
        !j.applyUrl.includes("company.com") &&
        !j.applyUrl.includes("example.com")
          ? j.applyUrl
          : `https://www.google.com/search?q=${encodeURIComponent(String(j.company) + " " + String(j.title) + " jobs")}`,
      source: "ai_generated",
      generatedForSkills: skills,
      externalId: dedupKey(j.title, j.company),
      deadline: j.deadline ? new Date(j.deadline) : addDays(30),
      expiresAt: addHours(CACHE_TTL_HOURS),
    }));
}

// ── Cache Management ───────────────────────────────────────────────────────────

/**
 * Returns true if we have enough fresh dynamic jobs (not recruiter-posted)
 */
async function hasFreshDynamicJobs() {
  const freshCutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000);
  const count = await Job.countDocuments({
    source: { $in: ["ai_generated", "adzuna", "jsearch"] },
    createdAt: { $gte: freshCutoff },
    isActive: true,
  });
  return count >= MIN_AI_JOBS;
}

async function saveDynamicJobs(jobs) {
  if (!jobs || jobs.length === 0) return;

  let saved = 0;
  for (const job of jobs) {
    try {
      // Upsert by externalId+source to prevent duplicates
      const filter = job.externalId
        ? { externalId: job.externalId, source: job.source }
        : { title: job.title, company: job.company, source: job.source };

      await Job.findOneAndUpdate(filter, { $set: job }, { upsert: true, new: true });
      saved++;
    } catch (err) {
      // Skip duplicate key errors silently
      if (err.code !== 11000) {
        console.warn("[JobSync] Error saving job:", err.message);
      }
    }
  }
  console.log(`✅ [JobSync] Saved/updated ${saved} dynamic jobs`);
}

// ── Main Entry Point ───────────────────────────────────────────────────────────

/**
 * Main service method called by the /opportunities endpoint.
 *
 * @param {string[]} skills  - student's current skills
 * @param {string}   targetRole - student's target job role
 * @returns {Promise<void>}
 */
async function getOrRefreshJobs(skills = [], targetRole = "") {
  // If we have enough fresh jobs, skip refresh
  if (await hasFreshDynamicJobs()) {
    console.log("ℹ️  [JobSync] Cache is fresh — skipping refresh");
    return;
  }

  console.log("🔄 [JobSync] Cache stale/empty — refreshing dynamic jobs...");

  // Try external APIs first (best quality)
  let externalJobs = await fetchFromAdzuna(skills);
  if (!externalJobs || externalJobs.length < 5) {
    externalJobs = await fetchFromJSearch(skills);
  }

  if (externalJobs && externalJobs.length >= 5) {
    await saveDynamicJobs(externalJobs);
    return;
  }

  // Fallback: AI-generated jobs
  const aiJobs = await generateJobsWithAI(skills, targetRole);
  await saveDynamicJobs(aiJobs);
}

module.exports = { getOrRefreshJobs };
