(() => {
  const API_BASE = (window.BNDLABS_API_BASE || "").replace(/\/+$/,"") + "/api";

  async function get(endpoint, fallback) {
    try {
      const r = await fetch(`${API_BASE}/${endpoint}`, { credentials: "omit" });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) {
      return fallback;
    }
  }

  const cache = { home:{}, projects:[], blogs:[], profile:{}, about:{}, contact:{}, "404":{} };

  window.Data = {
    async prime() {
      const [home, projects, blogs, profile, about, contact, four] = await Promise.all([
        get("home",{}),
        get("projects",[]),
        get("blogs",[]),
        get("profile",{}),
        get("about",{}),
        get("contact",{}),
        get("404",{})
      ]);
      Object.assign(cache, {home, projects, blogs, profile, about, contact, "404": four});
      return cache;
    },
    get(key){ return structuredClone(cache[key]); },
    projects(){ return [...cache.projects].sort((a,b)=>(b.updated||0)-(a.updated||0)); },
    blogs(){ return [...cache.blogs].sort((a,b)=>(b.updated||0)-(a.updated||0)); }
  };
})();
