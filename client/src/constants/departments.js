/**
 * Standard department options for student profiles, onboarding, and filtering.
 */
export const STANDARD_DEPARTMENTS = [
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

export const normalizeDepartment = (raw) => {
  if (!raw || typeof raw !== "string") return "General";
  const trimmed = raw.trim();
  if (!trimmed) return "General";

  const lower = trimmed.toLowerCase();

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

  if (lower === "it" || lower.includes("information tech")) {
    return "Information Technology";
  }

  if (
    lower === "aiml" ||
    lower === "ai & ml" ||
    lower === "ai/ml" ||
    lower.includes("artificial intelligence") ||
    lower.includes("machine learning")
  ) {
    return "Artificial Intelligence & Machine Learning";
  }

  if (
    lower === "ds" ||
    lower === "aids" ||
    lower === "ai & ds" ||
    lower.includes("data science")
  ) {
    return "Data Science & Analytics";
  }

  if (
    lower === "ece" ||
    lower.includes("electronics") ||
    lower.includes("telecom")
  ) {
    return "Electronics & Communication Engineering";
  }

  if (
    lower === "eee" ||
    lower === "ee" ||
    lower.includes("electrical")
  ) {
    return "Electrical & Electronics Engineering";
  }

  if (
    lower === "me" ||
    lower === "mech" ||
    lower.includes("mechanical")
  ) {
    return "Mechanical Engineering";
  }

  if (lower === "ce" || lower.includes("civil")) {
    return "Civil Engineering";
  }

  if (lower === "che" || lower.includes("chemical")) {
    return "Chemical Engineering";
  }

  if (
    lower === "bt" ||
    lower.includes("biotech") ||
    lower.includes("biotechnology")
  ) {
    return "Biotechnology";
  }

  if (lower.includes("aerospace") || lower.includes("aeronautical")) {
    return "Aerospace Engineering";
  }

  if (lower.includes("robotics") || lower.includes("automation")) {
    return "Robotics & Automation";
  }

  if (lower === "general" || lower === "other" || lower === "none") {
    return "General";
  }

  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
