/* ===== Site Asistanı (chatbot) — sol alt widget ===== */
(function () {
  var API_URL = "/api/chat";
  var MAX_HISTORY = 8;

  var SUGGESTIONS = [
    "Hangi hizmetleri veriyorsun?",
    "Projelerinden bahset",
    "Nasıl iletişime geçebilirim?",
  ];

  var state = {
    open: false,
    sending: false,
    history: [], // { role: "user" | "model", text: string }
  };

  function escHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Bot cevabındaki site-içi yolları tıklanabilir yap (/servisler, /projeler, /blog, /hakkimda)
  function linkifyPaths(html) {
    return html.replace(/(^|\s)(\/(?:servisler|projeler|blog|hakkimda)(?:\/[^\s<]*)?)/g, '$1<a href="$2" style="color:var(--accent)">$2</a>');
  }

  function formatBotText(text) {
    return linkifyPaths(escHtml(text).replace(/\n/g, "<br>"));
  }

  function buildWidget() {
    var fab = document.createElement("button");
    fab.className = "chatbot-fab";
    fab.id = "chatbotFab";
    fab.setAttribute("aria-label", "Site asistanı ile konuş");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML =
      '<span class="chatbot-fab__btn">' +
      '<i class="fa-solid fa-robot chatbot-fab__icon-open"></i>' +
      '<i class="fa-solid fa-xmark chatbot-fab__icon-close"></i>' +
      "</span>" +
      '<span class="chatbot-fab__label">Asistana sor</span>';

    var panel = document.createElement("div");
    panel.className = "chatbot-panel";
    panel.id = "chatbotPanel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Site asistanı");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<div class="chatbot-panel__header">' +
      '<div class="chatbot-panel__avatar"><i class="fa-solid fa-robot"></i></div>' +
      "<div>" +
      '<p class="chatbot-panel__title">Site Asistanı</p>' +
      '<p class="chatbot-panel__status">çevrimiçi</p>' +
      "</div>" +
      '<button class="chatbot-panel__close" type="button" aria-label="Sohbeti kapat"><i class="fa-solid fa-xmark"></i></button>' +
      "</div>" +
      '<div class="chatbot-panel__messages" id="chatbotMessages" aria-live="polite"></div>' +
      '<div class="chatbot-panel__suggestions" id="chatbotSuggestions"></div>' +
      '<form class="chatbot-panel__form" id="chatbotForm">' +
      '<input class="chatbot-panel__input" id="chatbotInput" type="text" placeholder="Sorunu yaz…" autocomplete="off" maxlength="600" aria-label="Mesajın">' +
      '<button class="chatbot-panel__send" type="submit" aria-label="Gönder"><i class="fa-solid fa-paper-plane"></i></button>' +
      "</form>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    return {
      fab: fab,
      panel: panel,
      messages: panel.querySelector("#chatbotMessages"),
      suggestions: panel.querySelector("#chatbotSuggestions"),
      form: panel.querySelector("#chatbotForm"),
      input: panel.querySelector("#chatbotInput"),
      sendBtn: panel.querySelector(".chatbot-panel__send"),
      closeBtn: panel.querySelector(".chatbot-panel__close"),
    };
  }

  function addMessage(el, kind, html) {
    var div = document.createElement("div");
    div.className = "chatbot-msg chatbot-msg--" + kind;
    div.innerHTML = html;
    el.messages.appendChild(div);
    el.messages.scrollTop = el.messages.scrollHeight;
    return div;
  }

  function addGreeting(el) {
    addMessage(
      el,
      "bot",
      "Merhaba! Ben site asistanıyım. Hizmetler, projeler veya iletişim hakkında merak ettiklerini sorabilirsin."
    );
    SUGGESTIONS.forEach(function (text) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chatbot-suggestion";
      btn.textContent = text;
      btn.addEventListener("click", function () {
        sendMessage(el, text);
      });
      el.suggestions.appendChild(btn);
    });
  }

  function setSending(el, sending) {
    state.sending = sending;
    el.input.disabled = sending;
    el.sendBtn.disabled = sending;
  }

  async function sendMessage(el, rawText) {
    var text = String(rawText ?? "").trim();
    if (!text || state.sending) return;

    el.suggestions.innerHTML = "";
    addMessage(el, "user", escHtml(text));
    var typing = addMessage(el, "typing", "<span></span><span></span><span></span>");
    setSending(el, true);

    try {
      var res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: state.history.slice(-MAX_HISTORY) }),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      typing.remove();

      if (res.ok && data.reply) {
        addMessage(el, "bot", formatBotText(data.reply));
        state.history.push({ role: "user", text: text });
        state.history.push({ role: "model", text: data.reply });
        state.history = state.history.slice(-MAX_HISTORY);
      } else {
        addMessage(el, "error", escHtml(data.error || "Asistan şu an cevap veremiyor, lütfen biraz sonra tekrar dene."));
      }
    } catch {
      typing.remove();
      addMessage(el, "error", "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.");
    } finally {
      setSending(el, false);
      el.input.focus();
    }
  }

  function setOpen(el, open) {
    state.open = open;
    el.fab.classList.toggle("is-open", open);
    el.panel.classList.toggle("is-open", open);
    el.fab.setAttribute("aria-expanded", String(open));
    el.panel.setAttribute("aria-hidden", String(!open));
    if (open) {
      setTimeout(function () {
        el.input.focus();
      }, 150);
    }
  }

  function initChatbot() {
    // Sadece ana sayfada değil, chatbot.css yüklenen her sayfada çalışır
    if (document.getElementById("chatbotFab")) return;
    var el = buildWidget();
    addGreeting(el);

    el.fab.addEventListener("click", function () {
      setOpen(el, !state.open);
    });
    el.closeBtn.addEventListener("click", function () {
      setOpen(el, false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) setOpen(el, false);
    });
    el.form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = el.input.value;
      el.input.value = "";
      sendMessage(el, text);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();
