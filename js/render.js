document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Prime data cache
    await (window.Data?.prime?.() || Promise.resolve());

    const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];
    const putText = (sel, v = "") => { const el = $(sel); if (el) el.textContent = v; };
    const putHTML = (sel, v = "") => { const el = $(sel); if (el) el.innerHTML = v; };
    const putSrc = (sel, v) => { const el = $(sel); if (el && v) el.src = v; };
    const show = (sel, ok) => { const el = $(sel); if (el) el.style.display = ok ? "" : "none"; };

    // ========== ABOUT PAGE ==========
    if ($('[data-page="about"]')) {
      const a = Data.get("about") || {};
      putText("#about_name", a.about_name);
      putText("#about_role", a.about_role);
      putHTML("#about_hero_desc", a.about_hero_desc);
      putSrc("#about_image", a.about_image);

      // Stats
      if (Array.isArray(a.about_stats)) {
        const statsHost = $("#about_stats");
        if (statsHost) {
          statsHost.innerHTML = a.about_stats.map(s => `
            <div class="stat">
              <div class="value">${s.value || ""}</div>
              <div class="label">${s.label || ""}</div>
            </div>
          `).join("");
        }
      }

      // Skills
      if (Array.isArray(a.about_skills)) {
        const skillsHost = $("#about_skills");
        if (skillsHost) {
          skillsHost.innerHTML = a.about_skills.map(sk => `<span>${sk}</span>`).join("");
        }
      }
    }

    // ========== CONTACT PAGE ==========
    if ($('[data-page="contact"]')) {
      const c = Data.get("contact") || {};

      // Hero section
      putText("#c_pill", c.c_pill);
      putText("#c_title", c.c_title);
      putText("#c_sub", c.c_sub);
      putSrc("#c_image", c.c_image);

      // Form labels
      if ($("#firstName")) $("#firstName").placeholder = c.c_label_first || "First Name";
      if ($("#lastName")) $("#lastName").placeholder = c.c_label_last || "Last Name";
      if ($("#email")) $("#email").placeholder = c.c_label_email || "Email";
      if ($("#message")) $("#message").placeholder = c.c_label_message || "Message";

      // Consent / Privacy
      putText("#c_consent_1", c.c_consent_1);
      putText("#c_consent_2", c.c_consent_2);
      putText("#c_privacy", c.c_privacy);
      putText("#c_button", c.c_button);

      // Quick Contact
      putText("#c_qc_title", c.c_qc_title);
      putText("#c_qc_email_label", c.c_qc_email_label);
      if (c.c_qc_email_value) {
        const el = $("#c_qc_email_value");
        if (el) {
          el.textContent = c.c_qc_email_value;
          el.href = `mailto:${c.c_qc_email_value}`;
        }
      }
      putText("#c_qc_phone_label", c.c_qc_phone_label);
      if (c.c_qc_phone_value) {
        const el = $("#c_qc_phone_value");
        if (el) {
          el.textContent = c.c_qc_phone_value;
          el.href = `tel:${c.c_qc_phone_value.replace(/\s|\(|\)|-/g, "")}`;
        }
      }
      putText("#c_qc_hq_label", c.c_qc_hq_label);
      putText("#c_qc_hq_value", c.c_qc_hq_value);

      // Follow title
      putText("#c_follow_title", c.c_follow_title || "Follow us");

      // Social icons inside contact card
      if (Array.isArray(c.c_socials)) {
        const box = $("#c_socials");
        if (box) {
          box.innerHTML = c.c_socials.map(s => {
            const icon = s.svg && s.svg.includes("<svg")
              ? s.svg
              : `<span>${s.platform}</span>`;
            return `<a href="${s.url || "#"}" target="_blank" rel="noopener">${icon}</a>`;
          }).join("");
        }
      }
    }

    // ========== PORTFOLIO LIST ==========
    if ($('[data-page="portfolio"]')) {
      const listHost = $("#projects_list");
      if (listHost) {
        const items = Data.projects().filter(p => (p.status || "active") === "active");
        listHost.innerHTML = items.map(p => `
          <a class="card" href="portfolio-details.html?id=${encodeURIComponent(p.id)}">
            <img loading="lazy" src="${p.hero || ""}" alt="">
            <div class="t">${p.title || ""}</div>
            <div class="tag">${p.tag || ""}</div>
          </a>
        `).join("");
      }
    }

    // ========== PORTFOLIO DETAILS ==========
    if ($('[data-page="portfolio-details"]')) {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      const p = Data.projects().find(x => x.id === id);
      if (p) {
        putText("#p_title", p.title);
        putText("#p_tag", p.tag);
        putText("#p_date", p.date);
        putHTML("#p_desc", p.desc || "");
        putSrc("#p_hero", p.hero);
        const secHost = $("#p_sections");
        if (secHost) {
          secHost.innerHTML = (p.sections || []).map(s => {
            if (s.type === "img") return `<figure class="img"><img src="${s.value || ""}" alt="${s.alt || ""}"></figure>`;
            if (s.type === "h2") return `<h2>${s.value || ""}</h2>`;
            return `<p>${s.value || ""}</p>`;
          }).join("");
        }
      } else {
        show("#p_not_found", true);
      }
    }

    // ========== BLOG LIST ==========
    if ($('[data-page="blog"]')) {
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

    // ========== BLOG DETAILS ==========
    if ($('[data-page="blog-details"]')) {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      const b = Data.blogs().find(x => x.id === id);
      if (b) {
        putText("#b_title", b.title);
        putText("#b_tag", b.tag);
        putText("#b_date", b.date);
        putHTML("#b_sub", b.subtitle || "");
        putSrc("#b_hero", b.hero);
        const secHost = $("#b_sections");
        if (secHost) {
          secHost.innerHTML = (b.sections || []).map(s => {
            if (s.type === "img") return `<figure class="img"><img src="${s.value || ""}" alt="${s.alt || ""}"></figure>`;
            if (s.type === "h2") return `<h2>${s.value || ""}</h2>`;
            return `<p>${s.value || ""}</p>`;
          }).join("");
        }
      } else {
        show("#b_not_found", true);
      }
    }

    // ========== 404 PAGE ==========
    if ($('[data-page="four"]')) {
      const d = Data.get("404") || {};
      putText("#four_title", d.title || "Hmmm…");
      putHTML("#four_desc", d.desc || "This page could not be found.");
    }

  } catch (e) {
    console.warn("Render init failed", e);
  }
});

// ===== FOOTER SOCIALS =====
(async () => {
  try {
    const res = await fetch("https://bndlabs-backend.onrender.com/api/socials");
    if (!res.ok) throw new Error(res.status);
    const socials = await res.json();

    const footerSocials = document.querySelector(".footer-inner .socials");
    if (footerSocials && Array.isArray(socials)) {
      footerSocials.innerHTML = socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener" title="${s.platform}">
          ${s.svg || `<span>${s.platform}</span>`}
        </a>
      `).join("");
    }
  } catch (e) {
    console.warn("⚠️ Failed to load footer socials:", e);
  }
})();
