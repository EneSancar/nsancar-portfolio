/**
 * Birleşik admin kayıt endpoint'i.
 * Kullanım: POST /api/admin-save?type=about|projects|activities|video-edits
 *
 * Vercel Hobby planındaki 12 function limitine uymak için
 * about.js, projects.js, activities.js ve video-edits.js burada birleştirildi.
 */
const { isAuthorized, sendUnauthorized } = require("./_lib/auth");
const { writeJsonFile } = require("./_lib/github");
const {
  validateAbout,
  validateProjects,
  validateActivities,
  validateVideoEdits,
  validateBlog,
} = require("./_lib/validate");

const TYPES = {
  about:        { file: "about.json",       validate: validateAbout       },
  projects:     { file: "projects.json",     validate: validateProjects    },
  activities:   { file: "activities.json",   validate: validateActivities  },
  "video-edits":{ file: "video-edits.json",  validate: validateVideoEdits  },
  blog:         { file: "blog.json",         validate: validateBlog        },
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Secret");
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed", message: "Yalnızca POST desteklenir." });
    return;
  }

  if (!isAuthorized(req)) {
    sendUnauthorized(res, req);
    return;
  }

  const type = req.query.type;
  const config = TYPES[type];
  if (!config) {
    res.status(400).json({
      error: "invalid_type",
      message: `type parametresi gerekli. Geçerli değerler: ${Object.keys(TYPES).join(", ")}`,
    });
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      res.status(400).json({ error: "invalid_json", message: "Geçersiz JSON gövdesi." });
      return;
    }
  }

  const validationError = config.validate(payload);
  if (validationError) {
    res.status(400).json({ error: "invalid_payload", message: validationError });
    return;
  }

  const result = await writeJsonFile(config.file, payload, `admin: update ${config.file}`);
  res.status(result.status).json(result.body);
};
