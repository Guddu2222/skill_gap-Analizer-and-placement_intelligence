/**
 * Utility to automatically map skill names to domain categories
 */
const DOMAIN_MAPPING = {
  // Web Development
  react: "Web Development",
  "react.js": "Web Development",
  nextjs: "Web Development",
  "next.js": "Web Development",
  nodejs: "Web Development",
  "node.js": "Web Development",
  express: "Web Development",
  expressjs: "Web Development",
  vue: "Web Development",
  angular: "Web Development",
  javascript: "Web Development",
  typescript: "Web Development",
  html: "Web Development",
  css: "Web Development",
  tailwind: "Web Development",
  mongodb: "Web Development",
  postgresql: "Web Development",
  mysql: "Web Development",
  graphql: "Web Development",

  // Data Science & AI
  python: "Data Science & AI",
  pandas: "Data Science & AI",
  numpy: "Data Science & AI",
  scikit: "Data Science & AI",
  "scikit-learn": "Data Science & AI",
  tensorflow: "Data Science & AI",
  pytorch: "Data Science & AI",
  machinelearning: "Data Science & AI",
  "machine learning": "Data Science & AI",
  deeplearning: "Data Science & AI",
  "deep learning": "Data Science & AI",
  nlp: "Data Science & AI",
  "computer-vision": "Data Science & AI",
  r: "Data Science & AI",

  // Cloud & DevOps
  docker: "Cloud & DevOps",
  kubernetes: "Cloud & DevOps",
  k8s: "Cloud & DevOps",
  aws: "Cloud & DevOps",
  azure: "Cloud & DevOps",
  gcp: "Cloud & DevOps",
  terraform: "Cloud & DevOps",
  ansible: "Cloud & DevOps",
  cicd: "Cloud & DevOps",
  "ci/cd": "Cloud & DevOps",
  jenkins: "Cloud & DevOps",
  linux: "Cloud & DevOps",
  bash: "Cloud & DevOps",

  // Cybersecurity
  wireshark: "Cybersecurity",
  metasploit: "Cybersecurity",
  owasp: "Cybersecurity",
  cryptography: "Cybersecurity",
  networksecurity: "Cybersecurity",
  "network security": "Cybersecurity",
  penetrationtesting: "Cybersecurity",

  // Mobile Development
  flutter: "Mobile Development",
  reactnative: "Mobile Development",
  "react native": "Mobile Development",
  swift: "Mobile Development",
  kotlin: "Mobile Development",
  android: "Mobile Development",
  ios: "Mobile Development",

  // Software Engineering & DSA
  c: "Software Engineering & DSA",
  "c++": "Software Engineering & DSA",
  cpp: "Software Engineering & DSA",
  java: "Software Engineering & DSA",
  dsa: "Software Engineering & DSA",
  "data structures": "Software Engineering & DSA",
  algorithms: "Software Engineering & DSA",
  systemdesign: "Software Engineering & DSA",
  "system design": "Software Engineering & DSA",
};

/**
 * Returns the matching domain category for a skill string.
 * @param {string} skillName
 * @returns {string} Domain category name
 */
function classifySkillDomain(skillName) {
  if (!skillName || typeof skillName !== "string") {
    return "Web Development";
  }

  const clean = skillName.trim().toLowerCase();
  return DOMAIN_MAPPING[clean] || "Web Development";
}

module.exports = { classifySkillDomain, DOMAIN_MAPPING };
