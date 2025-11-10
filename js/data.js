(() => {
  // ===== Base API URL (Render backend) =====
  const API_BASE = "https://bndlabs-backend.onrender.com/api";

  // ===== Helper: Fetch data safely =====
  async function get(endpoint, fallback) {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText || res.status);
      return await res.json();
    } catch (err) {
      console.warn(`⚠️ Failed to fetch ${endpoint}:`, err);
      return fallback;
    }
  }

  // ===== Local cache (all sections) =====
  const cache = {
    home: {},
    projects: [],
    blogs: [],
    profile: {},
    about: {},
    contact: {},
    socials: [],
    "404": {}
  };

  // ===== Global CMS Data Object =====
  window.Data = {
    // 🔹 Preload everything from backend
    async prime() {
      try {
        const [
          home,
          projects,
          blogs,
          profile,
          about,
          contact,
          socials,
          four
        ] = await Promise.all([
          get("home", {}),
          get("projects", []),
          get("blogs", []),
          get("profile", {}),
          get("about", {}),
          get("contact", {}),
          get("socials", []),
          get("404", {})
        ]);

        Object.assign(cache, {
          home,
          projects,
          blogs,
          profile,
          about,
          contact,
          socials,
          "404": four
        });

        console.log("✅ CMS data loaded from backend:", cache);
        return cache;
      } catch (e) {
        console.warn("⚠️ CMS prime() failed:", e);
        return cache;
      }
    },

    // 🔹 Safe getter
    get(key) {
      if (!cache[key]) {
        console.warn(`⚠️ Unknown CMS key: ${key}`);
        return {};
      }
      return structuredClone(cache[key]);
    },

    // 🔹 Sorted helpers
    projects() {
      return [...cache.projects].sort(
        (a, b) => (b.updated || 0) - (a.updated || 0)
      );
    },
    blogs() {
      return [...cache.blogs].sort(
        (a, b) => (b.updated || 0) - (a.updated || 0)
      );
    }
  };

  // ===== Shortcut functions (optional direct calls) =====
  window.getHome = async () => await get("home", {});
  window.getProjects = async () => await get("projects", []);
  window.getBlogs = async () => await get("blogs", []);
  window.getProfile = async () => await get("profile", {});
  window.getAbout = async () => await get("about", {});
  window.getContact = async () => await get("contact", {});
  window.getSocials = async () => await get("socials", []);
  window.get404 = async () => await get("404", {});
})();
