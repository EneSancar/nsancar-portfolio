window.AdminBlogUI = (function () {
  const C = window.AdminCore;
  let container = null;
  let data = null;

  function render(el, blogData) {
    container = el;
    data = blogData;
    rebuild();
  }

  function rebuild() {
    container.innerHTML = "";

    // Hero settings
    const heroSection = C.el("div", { className: "admin-card" }, [
      C.el("h3", { text: "Hero Ayarları" }),
      C.field("Başlık", buildInput("hero-title", data.hero?.title || "Blog", (v) => { data.hero = data.hero || {}; data.hero.title = v; })),
      C.field("Alt Başlık", buildInput("hero-subtitle", data.hero?.subtitle || "", (v) => { data.hero = data.hero || {}; data.hero.subtitle = v; })),
    ]);
    container.appendChild(heroSection);

    // Categories
    const catSection = C.el("div", { className: "admin-card" }, [
      C.el("h3", { text: "Kategoriler" }),
      C.field("Kategoriler (her satıra bir tane)", buildCatTextarea()),
    ]);
    container.appendChild(catSection);

    // Posts
    const postsHeader = C.el("div", { className: "admin-card-header" }, [
      C.el("h3", { text: `Blog Yazıları (${data.posts?.length || 0})` }),
      buildAddBtn(),
    ]);
    container.appendChild(postsHeader);

    (data.posts || []).forEach((post, i) => {
      container.appendChild(buildPostCard(post, i));
    });
  }

  function buildInput(id, value, onChange) {
    const inp = C.input("text", value, "");
    inp.id = id;
    inp.addEventListener("input", () => onChange(inp.value));
    return inp;
  }

  function buildCatTextarea() {
    const ta = C.textarea((data.categories || []).join("\n"), 4);
    ta.placeholder = "Web Tasarım\nSEO\nTeknoloji\nGeliştirme";
    ta.addEventListener("input", () => {
      data.categories = ta.value.split("\n").map(s => s.trim()).filter(Boolean);
    });
    return ta;
  }

  function buildAddBtn() {
    const btn = C.el("button", { className: "btn btn-primary", text: "+ Yeni Yazı" });
    btn.addEventListener("click", () => {
      if (!data.posts) data.posts = [];
      data.posts.unshift({
        id: "",
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        category: (data.categories || [])[0] || "",
        tags: [],
        author: "Enes Sancar",
        publishedAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        readingTime: 3,
        featured: false,
      });
      rebuild();
    });
    return btn;
  }

  function buildPostCard(post, index) {
    const card = C.el("div", { className: "admin-card admin-card--collapsible" });

    // Header (collapsible)
    const header = C.el("div", { className: "admin-card-toggle" });
    const title = C.el("strong", { text: post.title || "(Başlıksız)" });
    const badge = C.el("span", { className: "admin-badge", text: post.category || "—" });
    const meta = C.el("span", { className: "field-hint", text: ` · ${post.publishedAt || "—"}` });

    const toggleIcon = C.el("i", { className: "fa-solid fa-chevron-down" });
    header.appendChild(C.el("div", {}, [title, badge, meta]));
    header.appendChild(toggleIcon);

    const body = C.el("div", { className: "admin-card-body", style: "display:none" });

    header.style.cssText = "display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:12px 0;";
    header.addEventListener("click", () => {
      const visible = body.style.display !== "none";
      body.style.display = visible ? "none" : "block";
      toggleIcon.className = visible ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up";
    });

    // Fields
    body.appendChild(C.field("Başlık *", buildPostInput(post, "title")));
    body.appendChild(C.field("Slug (ID)", buildPostInput(post, "id", "otomatik-olusturulur")));

    // Category dropdown
    const catSelect = document.createElement("select");
    (data.categories || []).forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.text = cat;
      opt.selected = cat === post.category;
      catSelect.appendChild(opt);
    });
    catSelect.addEventListener("change", () => { post.category = catSelect.value; });
    body.appendChild(C.field("Kategori *", catSelect));

    body.appendChild(C.field("Özet", buildPostTextarea(post, "excerpt", 3)));
    body.appendChild(C.field("İçerik (HTML) *", buildPostTextarea(post, "content", 10)));
    body.appendChild(C.field("Kapak Görseli URL", buildPostInput(post, "coverImage", "image/blog/cover.webp")));
    body.appendChild(C.field("Etiketler (virgülle ayırın)", buildTagsInput(post)));
    body.appendChild(C.field("Yazar", buildPostInput(post, "author")));
    body.appendChild(C.field("Yayın Tarihi", buildPostDateInput(post, "publishedAt")));
    body.appendChild(C.field("Okuma Süresi (dk)", buildPostNumberInput(post, "readingTime")));

    // Featured toggle
    const featuredLabel = document.createElement("label");
    featuredLabel.style.cssText = "display:flex;align-items:center;gap:8px;cursor:pointer;";
    const featuredCb = document.createElement("input");
    featuredCb.type = "checkbox";
    featuredCb.checked = post.featured;
    featuredCb.addEventListener("change", () => { post.featured = featuredCb.checked; });
    featuredLabel.appendChild(featuredCb);
    featuredLabel.appendChild(document.createTextNode("Öne Çıkan Yazı"));
    body.appendChild(C.field("Öne Çıkan", featuredLabel));

    // Actions
    const actions = C.el("div", { className: "admin-card-actions" });

    if (index > 0) {
      const upBtn = C.el("button", { className: "btn btn-ghost btn-sm", text: "↑ Yukarı" });
      upBtn.addEventListener("click", () => { movePost(index, -1); });
      actions.appendChild(upBtn);
    }
    if (index < (data.posts || []).length - 1) {
      const downBtn = C.el("button", { className: "btn btn-ghost btn-sm", text: "↓ Aşağı" });
      downBtn.addEventListener("click", () => { movePost(index, 1); });
      actions.appendChild(downBtn);
    }

    const delBtn = C.el("button", { className: "btn btn-danger btn-sm", text: "Sil" });
    delBtn.addEventListener("click", () => {
      if (confirm(`"${post.title || "Bu yazı"}" silinecek. Emin misiniz?`)) {
        data.posts.splice(index, 1);
        rebuild();
      }
    });
    actions.appendChild(delBtn);
    body.appendChild(actions);

    card.appendChild(header);
    card.appendChild(body);
    return card;
  }

  function buildPostInput(post, key, placeholder) {
    const inp = C.input("text", post[key] || "", placeholder || "");
    inp.addEventListener("input", () => {
      post[key] = inp.value;
      if (key === "title" && !post.id) {
        post.id = C.slugify(inp.value);
      }
    });
    return inp;
  }

  function buildPostTextarea(post, key, rows) {
    const ta = C.textarea(post[key] || "", rows);
    ta.addEventListener("input", () => { post[key] = ta.value; });
    return ta;
  }

  function buildTagsInput(post) {
    const inp = C.input("text", (post.tags || []).join(", "), "seo, web-tasarim");
    inp.addEventListener("input", () => {
      post.tags = inp.value.split(",").map(s => s.trim()).filter(Boolean);
    });
    return inp;
  }

  function buildPostDateInput(post, key) {
    const inp = C.input("date", post[key] || "", "");
    inp.addEventListener("input", () => { post[key] = inp.value; });
    return inp;
  }

  function buildPostNumberInput(post, key) {
    const inp = C.input("number", post[key] || 3, "");
    inp.min = "1";
    inp.max = "60";
    inp.addEventListener("input", () => { post[key] = Number(inp.value) || 3; });
    return inp;
  }

  function movePost(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.posts.length) return;
    const [item] = data.posts.splice(index, 1);
    data.posts.splice(newIndex, 0, item);
    rebuild();
  }

  return { render };
})();
