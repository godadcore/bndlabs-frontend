document.addEventListener("DOMContentLoaded", async () => {
  try {
    // === Ensure Data.js is ready before running ===
    let retries = 0;
    while ((!window.Data || !window.Data.get) && retries < 10) {
      await new Promise(r => setTimeout(r, 150));
      retries++;
    }

    // === Prime CMS cache from backend ===
    await (window.Data?.prime?.() || Promise.resolve());

    // === Utility helpers ===
    const $ = s => document.querySelector(s);
    const putText = (sel, v = "") => { const el = $(sel); if (el) el.textContent = v || ""; };
    const putHTML = (sel, v = "") => { const el = $(sel); if (el) el.innerHTML = v || ""; };
    const putSrc = (sel, v) => { const el = $(sel); if (el && v) el.src = v; };

    const page = document.body.dataset.page;

    // ========== ABOUT PAGE ==========
    if (page === "about") {
      const a = Data.get("about") || {};
      putText("#about_name", a.about_name);
      putText("#about_role", a.about_role);
      putHTML("#about_hero_desc", a.about_hero_desc);
      putSrc("#about_image", a.about_image);

      if (Array.isArray(a.about_stats)) {
        const host = $("#about_stats");
        if (host) {
          host.innerHTML = a.about_stats.map(s => `
            <div class="stat">
              <div class="value">${s.value || ""}</div>
              <div class="label">${s.label || ""}</div>
            </div>
          `).join("");
        }
      }

      if (Array.isArray(a.about_skills)) {
        const host = $("#about_skills");
        if (host) {
          host.innerHTML = a.about_skills.map(sk => `<span>${sk}</span>`).join("");
        }
      }
    }

    // ========== CONTACT PAGE ==========
    if (page === "contact") {
      const c = Data.get("contact") || {};

      // Hero
      putText("#c_pill", c.c_pill);
      putText("#c_title", c.c_title);
      putText("#c_sub", c.c_sub);
      putSrc("#c_image", c.c_image);

      // Form
      if ($("#firstName")) $("#firstName").placeholder = c.c_label_first || "";
      if ($("#lastName")) $("#lastName").placeholder = c.c_label_last || "";
      if ($("#email")) $("#email").placeholder = c.c_label_email || "";
      if ($("#message")) $("#message").placeholder = c.c_label_message || "";

      putText("#c_consent_1", c.c_consent_1);
      putText("#c_consent_2", c.c_consent_2);
      putText("#c_privacy", c.c_privacy);
      putText("#c_button", c.c_button);

      // Quick contact
      putText("#c_qc_title", c.c_qc_title);
      putText("#c_qc_email_label", c.c_qc_email_label);
      if (c.c_qc_email_value) {
        const el = $("#c_qc_email_value");
        el.textContent = c.c_qc_email_value;
        el.href = `mailto:${c.c_qc_email_value}`;
      }
      putText("#c_qc_phone_label", c.c_qc_phone_label);
      if (c.c_qc_phone_value) {
        const el = $("#c_qc_phone_value");
        el.textContent = c.c_qc_phone_value;
        el.href = `tel:${c.c_qc_phone_value.replace(/\s|\(|\)|-/g, "")}`;
      }
      putText("#c_qc_hq_label", c.c_qc_hq_label);
      putText("#c_qc_hq_value", c.c_qc_hq_value);
      putText("#c_follow_title", c.c_follow_title || "");

      // Socials
      if (Array.isArray(c.c_socials)) {
        const box = $("#c_socials");
        if (box) {
          box.innerHTML = c.c_socials.map(s => {
            const icon = s.svg && s.svg.includes("<svg") ? s.svg : `<span>${s.platform}</span>`;
            return `<a href="${s.url || "#"}" target="_blank" rel="noopener">${icon}</a>`;
          }).join("");
        }
      }
    }

    // ========== PORTFOLIO PAGE ==========
    if (page === "portfolio") {
      const host = $("#projects_list");
      if (host) {
        const items = Data.projects().filter(p => (p.status || "active") === "active");
        host.innerHTML = items.map(p => `
          <a class="card" href="portfolio-details.html?id=${encodeURIComponent(p.id)}">
            <img loading="lazy" src="${p.hero || ""}" alt="">
            <div class="t">${p.title || ""}</div>
            <div class="tag">${p.tag || ""}</div>
          </a>
        `).join("");
      }
    }

    // ========== BLOG PAGE ==========
    if (page === "blog") {
      const host = $("#blog_list");
      if (host) {
        const posts = Data.blogs().filter(b => (b.status || "active") === "active");
        host.innerHTML = posts.map(b => `
          <a class="post" href="blog-details.html?id=${encodeURIComponent(b.id)}">
            <img loading="lazy" src="${b.hero || ""}" alt="">
            <div class="t">${b.title || ""}</div>
            <div class="sub">${b.subtitle || ""}</div>
          </a>
        `).join("");
      }
    }

    // ========== 404 PAGE ==========
    if (page === "four") {
      const d = Data.get("404") || {};
      putText("#four_title", d.title);
      putHTML("#four_desc", d.desc);
    }

  } catch (err) {
    console.warn("⚠️ Render initialization failed:", err);
  }
})();

// FOOTER SOCIALS (from backend)
(async () => {
  try {
    const res = await fetch("https://bndlabs-backend.onrender.com/api/socials");
    if (!res.ok) throw new Error(res.statusText);

    const socials = await res.json();
    const footer = document.querySelector(".footer-inner .socials");

    if (footer && Array.isArray(socials)) {
      footer.innerHTML = socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener" title="${s.platform}">
          ${s.svg || `<span>${s.platform}</span>`}
        </a>
      `).join("");
    }
  } catch (e) {
    console.warn("⚠️ Could not load footer socials:", e.message);
  }
})();
