/**
 * departmentHelper.js
 * Single source of truth for Department Taxonomy and intelligent normalization.
 */

const STANDARD_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Aerospace Engineering",
  "Robotics & Automation",
  "General",
];

/**
 * Normalizes any freeform department string into a standardized department name.
 * Handles variations, abbreviations, case differences, and typos.
 *
 * @param {string} raw
 * @returns {string} Standardized department name
 */
function normalizeDepartment(raw) {
  if (!raw || typeof raw !== "string") return "General";
  const trimmed = raw.trim();
  if (!trimmed) return "General";

  const lower = trimmed.toLowerCase();

  // Computer Science variations:
  // "Computer Science", "Computer Science Engineering", "Computer Science and Engineering",
  // "computer Science And Engineering", "CSE", "CS", "Comp Sci", etc.
  if (
    lower === "cs" ||
    lower === "cse" ||
    lower.includes("computer science") ||
    lower.includes("comp sci") ||
    lower.includes("comp. sci") ||
    lower.includes("computer engineering")
  ) {
    return "Computer Science & Engineering";
  }

  // Information Technology: "IT", "Info Tech"
  if (
    lower === "it" ||
    lower.includes("information tech")
  ) {
    return "Information Technology";
  }

  // AI & ML
  if (
    lower === "aiml" ||
    lower === "ai & ml" ||
    lower === "ai/ml" ||
    lower.includes("artificial intelligence") ||
    lower.includes("machine learning")
  ) {
    return "Artificial Intelligence & Machine Learning";
  }

  // Data Science
  if (
    lower === "ds" ||
    lower === "aids" ||
    lower === "ai & ds" ||
    lower.includes("data science")
  ) {
    return "Data Science & Analytics";
  }

  // ECE
  if (
    lower === "ece" ||
    lower.includes("electronics") ||
    lower.includes("telecom")
  ) {
    return "Electronics & Communication Engineering";
  }

  // EEE / Electrical
  if (
    lower === "eee" ||
    lower === "ee" ||
    lower.includes("electrical")
  ) {
    return "Electrical & Electronics Engineering";
  }

  // Mechanical
  if (
    lower === "me" ||
    lower === "mech" ||
    lower.includes("mechanical")
  ) {
    return "Mechanical Engineering";
  }

  // Civil
  if (
    lower === "ce" ||
    lower.includes("civil")
  ) {
    return "Civil Engineering";
  }

  // Chemical
  if (
    lower === "che" ||
    lower.includes("chemical")
  ) {
    return "Chemical Engineering";
  }

  // Biotechnology
  if (
    lower === "bt" ||
    lower.includes("biotech") ||
    lower.includes("biotechnology")
  ) {
    return "Biotechnology";
  }

  // Aerospace
  if (lower.includes("aerospace") || lower.includes("aeronautical")) {
    return "Aerospace Engineering";
  }

  // Robotics
  if (lower.includes("robotics") || lower.includes("automation")) {
    return "Robotics & Automation";
  }

  // General / Unassigned
  if (lower === "general" || lower === "other" || lower === "none") {
    return "General";
  }

  // Fallback: Clean title case
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

module.exports = {
  STANDARD_DEPARTMENTS,
  normalizeDepartment,
};
