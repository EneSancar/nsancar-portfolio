function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateAbout(payload) {
  if (!isObject(payload)) return "about verisi bir nesne olmalı.";
  if (!isObject(payload.profile)) return "profile alanı gerekli.";
  if (typeof payload.profile.name !== "string" || !payload.profile.name.trim()) {
    return "profile.name gerekli.";
  }
  if (!Array.isArray(payload.education)) return "education dizisi gerekli.";
  if (!Array.isArray(payload.experience)) return "experience dizisi gerekli.";
  if (!Array.isArray(payload.skills)) return "skills dizisi gerekli.";
  if (!Array.isArray(payload.interests)) return "interests dizisi gerekli.";
  return null;
}

function validateProjects(payload) {
  if (!isObject(payload)) return "projects verisi bir nesne olmalı.";
  if (!Array.isArray(payload.sections)) return "sections dizisi gerekli.";
  if (!Array.isArray(payload.projects)) return "projects dizisi gerekli.";

  for (const project of payload.projects) {
    if (!isObject(project)) return "Her proje bir nesne olmalı.";
    if (typeof project.id !== "string" || !project.id.trim()) return "Her projenin id alanı gerekli.";
    if (typeof project.sectionId !== "string") return `Proje ${project.id}: sectionId gerekli.`;
    if (typeof project.title !== "string") return `Proje ${project.id}: title gerekli.`;
    if (!isObject(project.modal)) return `Proje ${project.id}: modal gerekli.`;
  }

  return null;
}

module.exports = { validateAbout, validateProjects };
