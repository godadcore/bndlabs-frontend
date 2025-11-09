(() => {
  // Base API URL – make sure to replace with your real backend if needed
  const API_BASE = "https://bndlabs-backend.onrender.com/api";
    .replace(/\/+$/, "") + "/api";

  async function get(endpoint, fallback) {
    try {
      const r = await fetch(`${API_BASE}/${endpoint}`, { credentials: "omit" });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) {
      console.warn(`⚠️ Failed to fetch ${endpoint}:`, e);
      return fallback;
    }
  }

  const cache = {
    home: {},
    projects: [],
    blogs: [],
    profile: {},
    about: {},
    contact: {},
    "404": {}
  };

  // ===== Global CMS Data Object =====
  window.Data = {
    async prime() {
      const [home, projects, blogs, profile, about, contact, four] = await Promise.all([
        get("home", {}),
        get("projects", []),
        get("blogs", []),
        get("profile", {}),
        get("about", {}),
        get("contact", {}),
        get("404", {})
      ]);
      Object.assign(cache, { home, projects, blogs, profile, about, contact, "404": four });
      return cache;
    },
    get(key) {
      return structuredClone(cache[key]);
    },
    projects() {
      return [...cache.projects].sort((a, b) => (b.updated || 0) - (a.updated || 0));
    },
    blogs() {
      return [...cache.blogs].sort((a, b) => (b.updated || 0) - (a.updated || 0));
    }
  };

  // ===== Shortcut functions for each page =====
  window.getHome = async () => await get("home", {});
  window.getProjects = async () => await get("projects", []);
  window.getBlogs = async () => await get("blogs", []);
  window.getProfile = async () => await get("profile", {});
  window.getAbout = async () => await get("about", {});
  window.getContact = async () => await get("contact", {});
  window.get404 = async () => await get("404", {});
})();
