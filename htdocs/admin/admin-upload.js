window.AdminUpload = (function () {
  const C = window.AdminCore;

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Dosya okunamadı."));
      reader.readAsDataURL(file);
    });
  }

  function safeFileName(name) {
    const ext = (name.match(/\.[a-z0-9]+$/i) || [".jpg"])[0].toLowerCase();
    const base = name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    return `${base || "gorsel"}-${Date.now()}${ext}`;
  }

  async function uploadImage(file, folder) {
    const secret = C.getSecret();
    if (!secret) throw new Error("Oturum kapalı.");

    const relPath = `${folder.replace(/\/$/, "")}/${safeFileName(file.name)}`;
    const contentBase64 = await readFileAsBase64(file);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: C.authHeaders(secret),
      body: JSON.stringify({ path: relPath, contentBase64 }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
    return relPath;
  }

  /**
   * @param {{ label: string, pathInput: HTMLInputElement, folder?: string, hint?: string, onUploaded?: (path:string)=>void }} opts
   */
  function attachImageField(opts) {
    const { label, pathInput, folder = "image", hint, onUploaded } = opts;
    const wrap = C.el("div", { className: "field image-upload-field" });
    wrap.appendChild(C.el("label", { text: label }));

    const row = C.el("div", { className: "image-upload-row" });
    const preview = C.el("div", { className: "image-upload-preview" });
    const previewImg = document.createElement("img");
    previewImg.alt = "";
    preview.appendChild(previewImg);

    const controls = C.el("div", { className: "image-upload-controls" });
    controls.appendChild(pathInput);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
    fileInput.hidden = true;

    const pickBtn = C.el("button", {
      type: "button",
      className: "btn btn-ghost btn-sm",
      text: "Dosya seç & yükle",
    });

    const status = C.el("p", { className: "field-hint image-upload-status", text: "" });

    function updatePreview() {
      const path = pathInput.value.trim();
      if (!path) {
        previewImg.removeAttribute("src");
        preview.classList.remove("has-image");
        return;
      }
      previewImg.src = `../${path}?v=${Date.now()}`;
      preview.classList.add("has-image");
    }

    pathInput.addEventListener("input", updatePreview);
    updatePreview();

    pickBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      fileInput.value = "";
      if (!file) return;

      pickBtn.disabled = true;
      status.textContent = "Yükleniyor…";

      try {
        const path = await uploadImage(file, folder);
        pathInput.value = path;
        pathInput.dispatchEvent(new Event("input", { bubbles: true }));
        status.textContent = `Yüklendi: ${path}`;
        if (onUploaded) onUploaded(path);
        updatePreview();
      } catch (err) {
        status.textContent = `Hata: ${err.message}`;
      } finally {
        pickBtn.disabled = false;
      }
    });

    controls.append(pickBtn, fileInput, status);
    row.append(preview, controls);
    wrap.appendChild(row);
    if (hint) wrap.appendChild(C.el("p", { className: "field-hint", text: hint }));

    return wrap;
  }

  return { attachImageField, uploadImage };
})();
