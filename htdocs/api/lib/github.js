function getGithubConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || "main";
  const pathPrefix = process.env.GITHUB_PATH_PREFIX || "htdocs/data/";
  const sitePrefix = process.env.GITHUB_SITE_PREFIX || "htdocs/";

  if (!owner || !repo || !token) {
    return { error: "missing_github_config" };
  }

  return { owner, repo, token, branch, pathPrefix, sitePrefix };
}

async function getFileMeta({ owner, repo, token, branch }, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) {
    return { sha: null };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `GitHub GET failed (${res.status})`);
  }

  const data = await res.json();
  return { sha: data.sha };
}

async function writeFileContent(filePath, contentBase64, commitMessage) {
  const config = getGithubConfig();
  if (config.error) {
    return { ok: false, status: 500, body: { error: config.error, message: "GitHub ortam değişkenleri eksik." } };
  }

  const normalized = filePath.replace(/\/{2,}/g, "/");

  let sha = null;
  try {
    const meta = await getFileMeta(config, normalized);
    sha = meta.sha;
  } catch (err) {
    return { ok: false, status: 502, body: { error: "github_read_failed", message: err.message } };
  }

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(normalized)}`;
  const body = {
    message: commitMessage || `admin: update ${normalized}`,
    content: contentBase64,
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      body: { error: "github_write_failed", message: data.message || "GitHub yazma hatası", details: data },
    };
  }

  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      path: normalized,
      commit: data.commit?.sha || null,
      html_url: data.content?.html_url || null,
    },
  };
}

async function writeJsonFile(fileName, payload, commitMessage) {
  const config = getGithubConfig();
  if (config.error) {
    return { ok: false, status: 500, body: { error: config.error, message: "GitHub ortam değişkenleri eksik." } };
  }

  const filePath = `${config.pathPrefix}${fileName}`.replace(/\/{2,}/g, "/");
  const content = Buffer.from(JSON.stringify(payload, null, 2) + "\n", "utf8").toString("base64");
  return writeFileContent(filePath, content, commitMessage || `admin: update ${fileName}`);
}

async function writeSiteFile(relativePath, contentBase64, commitMessage) {
  const config = getGithubConfig();
  if (config.error) {
    return { ok: false, status: 500, body: { error: config.error, message: "GitHub ortam değişkenleri eksik." } };
  }

  const filePath = `${config.sitePrefix}${relativePath}`.replace(/\/{2,}/g, "/");
  return writeFileContent(filePath, contentBase64, commitMessage || `admin: upload ${relativePath}`);
}

module.exports = { getGithubConfig, writeJsonFile, writeSiteFile };
