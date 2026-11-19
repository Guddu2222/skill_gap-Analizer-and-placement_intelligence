const Job = require("../models/Job");

// Canonical mapping to harmonize external job tags with student profile skills
const CANONICAL_SKILLS = {
  react: "React.js",
  "react.js": "React.js",
  reactjs: "React.js",
  node: "Node.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  express: "Express.js",
  expressjs: "Express.js",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  html: "HTML",
  css: "CSS",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  git: "Git",
  github: "Git",
  docker: "Docker",
  kubernetes: "Kubernetes",
  aws: "AWS",
  gcp: "Google Cloud",
  azure: "Azure",
  sql: "SQL",
  mysql: "SQL",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  redis: "Redis",
  graphql: "GraphQL",
  rest: "REST APIs",
  api: "REST APIs",
  java: "Java",
  "c++": "C++",
  cpp: "C++",
  "c#": "C#",
  csharp: "C#",
  django: "Django",
  flask: "Flask",
  vue: "Vue.js",
  vuejs: "Vue.js",
  angular: "Angular",
  nextjs: "Next.js",
  "next.js": "Next.js",
  linux: "Linux",
  devops: "DevOps",
  ai: "AI/ML",
  ml: "Machine Learning",
  "machine learning": "Machine Learning",
};

/**
 * Normalizes raw tags into structured skills
 */
function normalizeSkills(tags = []) {
  const result = new Set();
  for (const rawTag of tags) {
    if (!rawTag || typeof rawTag !== "string") continue;
    const clean = rawTag.trim().toLowerCase();
    if (CANONICAL_SKILLS[clean]) {
      result.add(CANONICAL_SKILLS[clean]);
    } else if (clean.length >= 2 && clean.length <= 20) {
      // Capitalize first letter of general tag
      const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
      result.add(formatted);
    }
  }
  return Array.from(result);
}

/**
 * Strips HTML tags for clean text previews
 */
function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sync external live jobs from Remotive API into MongoDB
 */
async function syncExternalJobs(limit = 20) {
  try {
    console.log("[JobSync] Fetching latest software development opportunities from Remotive...");
    const url = `https://remotive.com/api/remote-jobs?category=software-dev&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SkillBridge-Job-Ingestion-Bot/1.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`Remotive API responded with status ${response.status}`);
    }

    const data = await response.json();
    const liveJobs = data.jobs || [];

    if (!Array.isArray(liveJobs) || liveJobs.length === 0) {
      console.log("[JobSync] No jobs returned from Remotive API.");
      return { success: true, count: 0 };
    }

    let syncedCount = 0;
    const now = new Date();

    for (const item of liveJobs) {
      if (!item.id || !item.title || !item.company_name) continue;

      const skills = normalizeSkills(item.tags);
      // Ensure at least some default tech skills if none were extracted
      if (skills.length === 0) {
        skills.push("Software Engineering", "Problem Solving");
      }

      // Dynamic rolling deadline: 21 days from published date (or from now)
      const pubDate = item.publication_date ? new Date(item.publication_date) : now;
      const validPubDate = isNaN(pubDate.getTime()) ? now : pubDate;
      const rollingDeadline = new Date(validPubDate.getTime() + 21 * 24 * 60 * 60 * 1000);

      // Clean description snippet
      const cleanDesc = stripHtml(item.description || "").slice(0, 500);

      const jobPayload = {
        company: item.company_name,
        title: item.title,
        description: cleanDesc || `${item.title} opportunity at ${item.company_name}`,
        location: item.candidate_required_location || "Remote",
        salary: item.salary || "Competitive Market Standard",
        jobType: item.job_type === "full_time" ? "Full Time" : "Internship",
        requirements: skills,
        deadline: rollingDeadline,
        createdAt: validPubDate,
        source: "remotive",
        applyUrl: item.url,
        companyLogo: item.company_logo_url || item.company_logo || null,
        externalId: String(item.id),
      };

      // Upsert: update existing or insert new without duplicating
      await Job.findOneAndUpdate(
        { externalId: String(item.id) },
        { $set: jobPayload },
        { upsert: true, new: true }
      );

      syncedCount++;
    }

    console.log(`[JobSync] Successfully synced ${syncedCount} live opportunities into database.`);
    return { success: true, count: syncedCount };
  } catch (error) {
    console.error("[JobSync] External job sync failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Initializes automatic background scheduled sync (every 12 hours)
 */
function initScheduledSync() {
  // Initial sync delayed by 5 seconds after boot
  setTimeout(() => {
    syncExternalJobs(25).catch((err) =>
      console.warn("[JobSync] Initial background sync error:", err.message)
    );
  }, 5000);

  // Recurring sync every 12 hours (43,200,000 ms)
  setInterval(() => {
    console.log("[JobSync] Running scheduled 12-hour job refresh...");
    syncExternalJobs(25).catch((err) =>
      console.warn("[JobSync] Scheduled sync error:", err.message)
    );
  }, 12 * 60 * 60 * 1000);
}

module.exports = {
  syncExternalJobs,
  initScheduledSync,
  normalizeSkills,
};

