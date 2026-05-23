window.AdminAboutUI = (function () {
  const C = window.AdminCore;

  function bindInput(input, setter) {
    input.addEventListener("input", () => setter(input.value));
  }

  function render(container, data) {
    container.innerHTML = "";
    data.profile = data.profile || {};
    data.profile.social = Array.isArray(data.profile.social) ? data.profile.social : [];
    data.education = Array.isArray(data.education) ? data.education : [];
    data.experience = Array.isArray(data.experience) ? data.experience : [];
    data.skills = Array.isArray(data.skills) ? data.skills : [];
    data.interests = Array.isArray(data.interests) ? data.interests : [];

    const p = data.profile;

    const profileCard = C.el("section", { className: "admin-card-block" }, [
      C.el("h3", {}, [icon("fa-solid fa-id-card"), document.createTextNode(" Profil")]),
    ]);
    const profileGrid = C.el("div", { className: "field-row" });

    const nameIn = C.input("text", p.name);
    bindInput(nameIn, (v) => { p.name = v; });
    profileGrid.appendChild(C.field("Ad Soyad", nameIn));

    const titleIn = C.input("text", p.title);
    bindInput(titleIn, (v) => { p.title = v; });
    profileGrid.appendChild(C.field("Ünvan", titleIn));

    profileCard.appendChild(profileGrid);

    const photoIn = C.input("text", p.photo, "image/enes-about.jpg");
    bindInput(photoIn, (v) => { p.photo = v; });
    profileCard.appendChild(
      window.AdminUpload.attachImageField({
        label: "Profil fotoğrafı",
        pathInput: photoIn,
        folder: "image",
        hint: "Dosya seçince GitHub’a yüklenir; yol otomatik dolar.",
      })
    );

    const photoAltIn = C.input("text", p.photoAlt);
    bindInput(photoAltIn, (v) => { p.photoAlt = v; });
    profileCard.appendChild(C.field("Fotoğraf alt metni", photoAltIn));

    const bioTa = C.textarea(p.bio, 5);
    bindInput(bioTa, (v) => { p.bio = v; });
    profileCard.appendChild(C.field("Hakkımda metni", bioTa));

    container.appendChild(profileCard);

    container.appendChild(renderSocial(data));
    container.appendChild(renderEducation(data));
    container.appendChild(renderExperience(data));
    container.appendChild(renderSimpleList(data, "skills", "Yetenekler", "fa-solid fa-wand-magic-sparkles", "Her satıra bir yetenek"));
    container.appendChild(renderSimpleList(data, "interests", "İlgi alanları", "fa-solid fa-heart", "Her satıra bir ilgi alanı"));
  }

  function icon(cls) {
    const i = document.createElement("i");
    i.className = cls;
    return i;
  }

  function renderSocial(data) {
    const block = C.el("section", { className: "admin-card-block" });
    const header = C.el("div", { className: "admin-block-header" });
    header.appendChild(C.el("h3", {}, [icon("fa-solid fa-share-nodes"), document.createTextNode(" Sosyal medya")]));
    const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", text: "+ Ekle" });
    header.appendChild(addBtn);
    block.appendChild(header);

    const list = C.el("div", { className: "admin-repeater" });

    function draw() {
      list.innerHTML = "";
      data.profile.social.forEach((item, index) => {
        const card = C.el("div", { className: "admin-repeater-item" });
        card.appendChild(C.el("div", { className: "admin-repeater-item__title", text: `Link ${index + 1}` }));

        const hrefIn = C.input("url", item.href, "https://");
        bindInput(hrefIn, (v) => { item.href = v; });
        card.appendChild(C.field("URL", hrefIn));

        const labelIn = C.input("text", item.label, "Instagram");
        bindInput(labelIn, (v) => { item.label = v; });
        card.appendChild(C.field("Etiket", labelIn));

        const iconIn = C.input("text", item.icon, "fa-brands fa-instagram");
        bindInput(iconIn, (v) => { item.icon = v; });
        card.appendChild(C.field("Font Awesome sınıfı", iconIn, "Örn. fa-brands fa-github"));

        const del = C.el("button", { type: "button", className: "btn btn-danger btn-sm", text: "Sil" });
        del.addEventListener("click", () => {
          data.profile.social.splice(index, 1);
          draw();
        });
        card.appendChild(C.el("div", { className: "admin-repeater-item__actions" }, [del]));
        list.appendChild(card);
      });
    }

    addBtn.addEventListener("click", () => {
      data.profile.social.push({
        href: "",
        icon: "fa-brands fa-link",
        label: "Yeni link",
      });
      draw();
    });

    draw();
    block.appendChild(list);
    return block;
  }

  function renderEducation(data) {
    const block = C.el("section", { className: "admin-card-block" });
    const header = C.el("div", { className: "admin-block-header" });
    header.appendChild(C.el("h3", {}, [icon("fa-solid fa-graduation-cap"), document.createTextNode(" Eğitim")]));
    const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", text: "+ Ekle" });
    header.appendChild(addBtn);
    block.appendChild(header);

    const list = C.el("div");

    function draw() {
      list.innerHTML = "";
      data.education.forEach((edu, index) => {
        const card = C.el("div", { className: "admin-repeater-item" });
        card.appendChild(C.el("div", { className: "admin-repeater-item__title", text: `Eğitim ${index + 1}` }));

        [["Okul", "school"], ["Dönem", "period"], ["Konum", "location"], ["Bölüm", "department"]].forEach(([label, key]) => {
          const inp = C.input("text", edu[key] || "");
          bindInput(inp, (v) => { edu[key] = v; });
          card.appendChild(C.field(label, inp));
        });

        const del = C.el("button", { type: "button", className: "btn btn-danger btn-sm", text: "Sil" });
        del.addEventListener("click", () => {
          data.education.splice(index, 1);
          draw();
        });
        card.appendChild(C.el("div", { className: "admin-repeater-item__actions" }, [del]));
        list.appendChild(card);
      });
    }

    addBtn.addEventListener("click", () => {
      data.education.push({
        id: `edu-${Date.now()}`,
        school: "",
        period: "",
        location: "",
        department: "",
      });
      draw();
    });

    draw();
    block.appendChild(list);
    return block;
  }

  function renderExperience(data) {
    const block = C.el("section", { className: "admin-card-block" });
    const header = C.el("div", { className: "admin-block-header" });
    header.appendChild(C.el("h3", {}, [icon("fa-solid fa-briefcase"), document.createTextNode(" Deneyim")]));
    const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", text: "+ Ekle" });
    header.appendChild(addBtn);
    block.appendChild(header);

    const list = C.el("div");

    function draw() {
      list.innerHTML = "";
      data.experience.forEach((exp, index) => {
        const card = C.el("div", { className: "admin-repeater-item" });
        card.appendChild(C.el("div", { className: "admin-repeater-item__title", text: `Deneyim ${index + 1}` }));

        [["Rol / Alan", "role"], ["Şirket", "company"], ["Konum", "location"], ["Dönem", "period"]].forEach(([label, key]) => {
          const inp = C.input("text", exp[key] || "");
          bindInput(inp, (v) => { exp[key] = v; });
          card.appendChild(C.field(label, inp));
        });

        const del = C.el("button", { type: "button", className: "btn btn-danger btn-sm", text: "Sil" });
        del.addEventListener("click", () => {
          data.experience.splice(index, 1);
          draw();
        });
        card.appendChild(C.el("div", { className: "admin-repeater-item__actions" }, [del]));
        list.appendChild(card);
      });
    }

    addBtn.addEventListener("click", () => {
      data.experience.push({
        id: `exp-${Date.now()}`,
        role: "",
        company: "",
        location: "",
        period: "",
      });
      draw();
    });

    draw();
    block.appendChild(list);
    return block;
  }

  function renderSimpleList(data, key, title, iconClass, hint) {
    const block = C.el("section", { className: "admin-card-block tags-field" });
    block.appendChild(C.el("h3", {}, [icon(iconClass), document.createTextNode(` ${title}`)]));
    const ta = C.textarea(C.arrayToLines(data[key]), 6);
    ta.addEventListener("input", () => {
      data[key] = C.linesToArray(ta.value);
    });
    block.appendChild(C.field("Liste", ta, hint));
    return block;
  }

  return { render };
})();
