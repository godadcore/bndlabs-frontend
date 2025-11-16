(() => {

  // ================================
  //  BASE API URL (backend)
  // ================================
  const API_BASE = "https://bndlabs-backend.onrender.com/api";

  // ================================
  //  AUTH HANDLING (NEW)
  // ================================
  function saveToken(token) {
    sessionStorage.setItem("bnd_token", token);
  }

  function getToken() {
    return sessionStorage.getItem("bnd_token") || "";
  }

  async function loginAdmin(password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!res.ok) {
      throw new Error("Invalid password");
    }

    const json = await res.json();
    saveToken(json.token);
    return json.token;
  }

  // expose to window (for your admin login UI)
  window.CMSauth = { loginAdmin, getToken };


  // ================================
  //  SAFE FETCH HELPERS
  // ================================
  async function GET(endpoint, fallback) {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (err) {
      console.warn(`⚠️ Failed GET /${endpoint}`, err);
      return fallback;
    }
  }

  async function POST(endpoint, data) {
    const token = getToken();

    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`   // <<=== JWT goes here
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`POST /${endpoint} failed: ${t}`);
    }

    return res.json().catch(() => ({ ok: true }));
  }


  // ================================
  //  LOCAL CACHE
  // ================================
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


  // ================================
  //  GLOBAL DATA OBJECT (READ ONLY)
  // ================================
  window.Data = {

    async prime() {
      try {
        const all = await Promise.all([
          GET("home", {}),
          GET("projects", []),
          GET("blogs", []),
          GET("profile", {}),
          GET("about", {}),
          GET("contact", {}),
          GET("socials", []),
          GET("404", {})
        ]);

        cache.home     = all[0];
        cache.projects = all[1];
        cache.blogs    = all[2];
        cache.profile  = all[3];
        cache.about    = all[4];
        cache.contact  = all[5];
        cache.socials  = all[6];
        cache["404"]   = all[7];

        console.log("✅ CMS data loaded:", cache);
      } catch (e) {
        console.warn("⚠️ prime() failed:", e);
      }
    },

    get(key) {
      return structuredClone(cache[key] || {});
    },

    projects() {
      return [...cache.projects].sort((a, b) => (b.updated || 0) - (a.updated || 0));
    },

    blogs() {
      return [...cache.blogs].sort((a, b) => (b.updated || 0) - (a.updated || 0));
    }
  };


  // ================================
  //  STORE WRITER (AUTH PROTECTED)
  // ================================
  window.Store = {
    async saveHome(v)     { await POST("home", v);     cache.home = v;    },
    async saveProjects(v) { await POST("projects", v); cache.projects = v;},
    async saveBlogs(v)    { await POST("blogs", v);    cache.blogs = v;   },
    async saveProfile(v)  { await POST("profile", v);  cache.profile = v; },
    async saveAbout(v)    { await POST("about", v);    cache.about = v;   },
    async saveContact(v)  { await POST("contact", v);  cache.contact = v; },
    async save404(v)      { await POST("404", v);      cache["404"] = v;  },
    async saveSocials(v)  { await POST("socials", v);  cache.socials = v; }
  };

})();