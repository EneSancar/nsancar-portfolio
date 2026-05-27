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
  if (!Array.isArray(payload.profile.social)) return "profile.social dizisi gerekli.";

  for (let i = 0; i < payload.education.length; i++) {
    const edu = payload.education[i];
    if (!edu || typeof edu.school !== "string" || !edu.school.trim()) {
      return `education[${i}]: okul adı (school) gerekli.`;
    }
  }

  return null;
}

function validateProjects(payload) {
  if (!isObject(payload)) return "projects verisi bir nesne olmalı.";
  if (!Array.isArray(payload.sections)) return "sections dizisi gerekli.";
  if (!Array.isArray(payload.projects)) return "projects dizisi gerekli.";

  const sectionIds = new Set(payload.sections.map((s) => s.id));

  for (const project of payload.projects) {
    if (!isObject(project)) return "Her proje bir nesne olmalı.";
    if (typeof project.id !== "string" || !project.id.trim()) return "Her projenin id alanı gerekli.";
    if (typeof project.sectionId !== "string") return `Proje ${project.id}: sectionId gerekli.`;
    if (typeof project.title !== "string") return `Proje ${project.id}: title gerekli.`;
    if (!isObject(project.modal)) return `Proje ${project.id}: modal gerekli.`;
    if (project.sectionId && !sectionIds.has(project.sectionId)) {
      return `Proje ${project.id}: sectionId "${project.sectionId}" tanımlı bölümlerde yok.`;
    }
  }

  return null;
}

function validateActivities(payload) {
  if (!isObject(payload)) return "activities verisi bir nesne olmalı.";
  if (!Array.isArray(payload.channels)) return "channels dizisi gerekli.";
  if (!Array.isArray(payload.series)) return "series dizisi gerekli.";
  if (!Array.isArray(payload.books)) return "books dizisi gerekli.";
  if (payload.music !== undefined && !Array.isArray(payload.music)) return "music dizisi gerekli.";

  const validStatuses = new Set(["watching", "finished", "wishlist"]);
  for (let i = 0; i < payload.series.length; i++) {
    const s = payload.series[i];
    if (!s || typeof s.title !== "string" || !s.title.trim()) {
      return `series[${i}]: title gerekli.`;
    }
    if (!validStatuses.has(s.status)) {
      return `series[${i}]: status "watching", "finished" veya "wishlist" olmalı.`;
    }
  }

  const validBookStatuses = new Set(["reading", "finished", "wishlist"]);
  for (let i = 0; i < payload.books.length; i++) {
    const b = payload.books[i];
    if (!b || typeof b.title !== "string" || !b.title.trim()) {
      return `books[${i}]: title gerekli.`;
    }
    if (!validBookStatuses.has(b.status)) {
      return `books[${i}]: status "reading", "finished" veya "wishlist" olmalı.`;
    }
  }

  for (let i = 0; i < payload.channels.length; i++) {
    const c = payload.channels[i];
    if (!c || typeof c.name !== "string" || !c.name.trim()) {
      return `channels[${i}]: name gerekli.`;
    }
  }

  const music = Array.isArray(payload.music) ? payload.music : [];
  for (let i = 0; i < music.length; i++) {
    const m = music[i];
    if (!m || typeof m.title !== "string" || !m.title.trim()) {
      return `music[${i}]: title gerekli.`;
    }
    if (typeof m.artist !== "string" || !m.artist.trim()) {
      return `music[${i}]: artist gerekli.`;
    }
  }

  return null;
}

module.exports = { validateAbout, validateProjects, validateActivities };
