// render.js — Fixed and defensive version
// Purpose: hydrate pages from the CMS Data object (Data.js)
// Notes: This file is intentionally defensive to avoid uncaught TypeErrors
//       when the backend or Data object is unavailable.

(function () {
  "use strict";

  // --- Utilities ---
  const $ = (sel) => document.querySelector(sel);
  const $all = (sel) => Array.from(document.querySelectorAll(sel) || []);
  const safeText = (v) => (v == null ? "" : String(v));
  const putText = (sel, v = "") => {
    const el = $(sel);
    if (el) el.textContent = safeText(v);
  };
  const putHTML = (sel, v = "") => {
    const el = $(sel);
    if (el) el.innerHTML = v == null ? "" : v;
  };
  const putSrc = (sel, v) => {
    const el = $(sel);
    if (el && v) el.src = v;
  };

  // Wait helper (returns Promise)
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Attempt to get Data safely
  const getDataSafe = () => {
    if (typeof window === "undefined") return null;
    if (!window.Data) return null;
    return window.Data;
  };

  // Try to call Data.prime() safely
  async function primeData(maxRetries = 10, waitMs = 150) {
    const Data = getDataSafe();
    if (!Data) {
      // Nothing to prime
      return;
    }

    // If Data.prime exists, call it and wait; otherwise, try to wait until Data.get exists
    if (typeof Data.prime === "function") {
      try {
        await Data.prime();
        return;
      } catch (err) {
        // fallthrough to retry attempt below
        console.warn("Data.prime() rejected:", err?.message || err);
      }
    }

    // Fallback: wait until Data.get is available (poll)
    let retries = 0;
    while (retries < maxRetries && !(Data && typeof Data.get === "function")) {
      await wait(waitMs);
      retries++;
    }
  }

  // Main page renderer, runs on DOMContentLoaded
  async function initRender() {
    try {
      // Ensure Data is ready
      await primeData();

      const Data = getDataSafe() || null;
      // Provide safe accessors when Data is missing
      const safeGet = (k, def = null) => {
        try {
          return Data && typeof Data.get === "function" ? Data.get(k) : def;
        } catch (e) {
          return def;
        }
      };

      // helpers for arrays on Data
      const safeArray = (fn, def = []) => {
        try {
          const val = (typeof fn === "function" ? fn() : fn) ?? def;
          return Array.isArray(val) ? val : def;
        } catch (e) {
          return def;
        }
      };

      // # Page selector from body data attribute
      const page = document.body && document.body.dataset ? document.body.dataset.page : "";

      // ========== ABOUT PAGE ==========
      if (page === "about") {
        const a = safeGet("about", {}) || {};
        putText("#about_name", a.about_name || a.name || "");
        putText("#about_role", a.about_role || a.role || "");
        putHTML("#about_hero_desc", a.about_hero_desc || a.hero_desc || "");
        putSrc("#about_image", a.about_image || a.image || "");

        // stats
        const stats = Array.isArray(a.about_stats) ? a.about_stats : Array.isArray(a.stats) ? a.stats : [];
        const statsHost = $("#about_stats");
        if (statsHost) {
          statsHost.innerHTML = stats
            .map((s) => {
              const value = s.value || s.k || "";
              const label = s.label || s.v || "";
              return `<div class="stat"><div class="value">${escapeHtml(value)}</div><div class="label">${escapeHtml(label)}</div></div>`;
            })
            .join("");
        }

        // skills
        const skills = Array.isArray(a.about_skills) ? a.about_skills : Array.isArray(a.skills) ? a.skills : [];
        const skillsHost = $("#about_skills");
        if (skillsHost) {
          skillsHost.innerHTML = skills.map((sk) => `<span class="chip">${escapeHtml(sk)}</span>`).join("");
        }

        // gallery (optional)
        const gallery = Array.isArray(a.about_gallery) ? a.about_gallery : Array.isArray(a.gallery) ? a.gallery : [];
        const galHost = $("#about_gallery");
        if (galHost) {
          galHost.innerHTML = gallery.map((g) => `<img src="${escapeAttr(g)}" alt="gallery image">`).join("");
        }

        // progress bars
        const progress = Array.isArray(a.about_progress) ? a.about_progress : Array.isArray(a.progress) ? a.progress : [];
        const progHost = $("#about_progress");
        if (progHost) {
          progHost.innerHTML = progress
            .map((p) => {
              const name = p.name || p.label || "";
              const val = Number(p.value ?? p.percent ?? 0) || 0;
              const col = p.color || "#FF4D00";
              return `<div class="bar"><span>${escapeHtml(name)}</span><div class="track"><div class="fill" style="width:${val}%; background:${escapeAttr(col)}"></div></div><em>${val}%</em></div>`;
            })
            .join("");
        }

        // features
        const features = Array.isArray(a.about_features) ? a.about_features : Array.isArray(a.features) ? a.features : [];
        const featHost = $("#about_features");
        if (featHost) {
          featHost.innerHTML = features
            .map((f) => {
              const img = f.img || f.image || "";
              const ttl = f.title || "";
              const dsc = f.desc || f.description || "";
              const lnk = f.link || "";
              const ltx = f.linkText || "View";
              return `<div class="feature-item">${img ? `<img src="${escapeAttr(img)}" alt="${escapeHtml(ttl)}">` : ""}<div class="feature-content"><h2>${escapeHtml(ttl)}</h2><p>${escapeHtml(dsc)}</p>${lnk ? `<a class="text-link" href="${escapeAttr(lnk)}">${escapeHtml(ltx)}</a>` : ""}</div></div>`;
            })
            .join("");
        }
      } // end about

      // ========== CONTACT PAGE ==========
      if (page === "contact") {
        const c = safeGet("contact", {}) || {};

        // hero bits
        putText("#c_pill", c.c_pill || c.pill || "");
        putText("#c_title", c.c_title || c.title || "");
        putText("#c_sub", c.c_sub || c.sub || "");
        putSrc("#c_image", c.c_image || c.image || "");

        // placeholders
        if ($("#firstName")) $("#firstName").placeholder = c.c_label_first || c.label_first || "";
        if ($("#lastName")) $("#lastName").placeholder = c.c_label_last || c.label_last || "";
        if ($("#email")) $("#email").placeholder = c.c_label_email || c.label_email || "";
        if ($("#message")) $("#message").placeholder = c.c_label_message || c.label_message || "";

        putText("#c_consent_1", c.c_consent_1 || "");
        putText("#c_consent_2", c.c_consent_2 || "");
        putText("#c_privacy", c.c_privacy || "");
        putText("#c_button", c.c_button || "Send");

        // quick contact values
        putText("#c_qc_title", c.c_qc_title || "");
        putText("#c_qc_email_label", c.c_qc_email_label || "");
        if (c.c_qc_email_value && $("#c_qc_email_value")) {
          const el = $("#c_qc_email_value");
          el.textContent = c.c_qc_email_value;
          el.href = `mailto:${c.c_qc_email_value}`;
        }
        putText("#c_qc_phone_label", c.c_qc_phone_label || "");
        if (c.c_qc_phone_value && $("#c_qc_phone_value")) {
          const el = $("#c_qc_phone_value");
          el.textContent = c.c_qc_phone_value;
          el.href = `tel:${(c.c_qc_phone_value || "").replace(/\s|\(|\)|-/g, "")}`;
        }
        putText("#c_qc_hq_label", c.c_qc_hq_label || "");
        putText("#c_qc_hq_value", c.c_qc_hq_value || "");
        putText("#c_follow_title", c.c_follow_title || "");

        // socials
        const socialsBox = $("#c_socials");
        if (socialsBox && Array.isArray(c.c_socials)) {
          socialsBox.innerHTML = c.c_socials
            .map((s) => {
              const icon = s.svg && String(s.svg).includes("<svg") ? s.svg : `<span>${escapeHtml(s.platform || "")}</span>`;
              return `<a href="${escapeAttr(s.url || "#")}" target="_blank" rel="noopener">${icon}</a>`;
            })
            .join("");
        }
      } // end contact

      // ========== PORTFOLIO PAGE ==========
      if (page === "portfolio") {
        const host = $("#projects_list");
        if (host && Data && typeof Data.projects === "function") {
          try {
            const items = (Data.projects() || []).filter((p) => (p.status || "active") === "active");
            host.innerHTML = items
              .map((p) => {
                const id = p.id || p.slug || "";
                const hero = p.hero || p.image || "";
                const title = p.title || "";
                const tag = p.tag || p.category || "";
                return `<a class="card" href="portfolio-details.html?id=${encodeURIComponent(id)}"><img loading="lazy" src="${escapeAttr(hero)}" alt=""><div class="t">${escapeHtml(title)}</div><div class="tag">${escapeHtml(tag)}</div></a>`;
              })
              .join("");
          } catch (e) {
            console.warn("Failed to render portfolio list:", e);
          }
        }
      }

      // ========== BLOG PAGE ==========
      if (page === "blog") {
        const host = $("#blog_list");
        if (host && Data && typeof Data.blogs === "function") {
          try {
            const posts = (Data.blogs() || []).filter((b) => (b.status || "active") === "active");
            host.innerHTML = posts
              .map((b) => {
                const id = b.id || b.slug || "";
                const hero = b.hero || b.image || "";
                const title = b.title || "";
                const subtitle = b.subtitle || b.sub || "";
                return `<a class="post" href="blog-details.html?id=${encodeURIComponent(id)}"><img loading="lazy" src="${escapeAttr(hero)}" alt=""><div class="t">${escapeHtml(title)}</div><div class="sub">${escapeHtml(subtitle)}</div></a>`;
              })
              .join("");
          } catch (e) {
            console.warn("Failed to render blog list:", e);
          }
        }
      }

      // ========== 404 PAGE ==========
      if (page === "four") {
        const d = safeGet("404", {}) || {};
        putText("#four_title", d.title || "");
        putHTML("#four_desc", d.desc || "");
      }
    } catch (err) {
      // Final guarded catch for page init
      console.warn("⚠️ Render initialization failed:", err && err.message ? err.message : err);
    }
  } // end initRender

  // Run main init when DOM is ready — use window.addEventListener for extra safety
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", initRender, { passive: true });
  } else {
    // Fallback: try immediate init (rare)
    try {
      initRender();
    } catch (e) {
      console.warn("Could not attach DOMContentLoaded listener, initRender failed:", e);
    }
  }

// Footer socials disabled — using static footer icons.
// Dynamic CMS override removed intentionally.

  // ======================
  // Small helpers: escape
  // ======================
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escapeAttr(str) {
    if (str == null) return "";
    return String(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
