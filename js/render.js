// js/render.js
// This file connects to your data source and fills in the layout dynamically.
// It does NOT alter layout or design — only updates text and images inside existing tags.

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const home = await getHomeData();
    const projects = await getProjects();

    if (home.title)  document.getElementById("h_title").textContent = home.title;
    if (home.sub)    document.getElementById("h_sub").textContent = home.sub;
    if (home.pill)   document.getElementById("h_pill").textContent = home.pill;
    if (home.proj_title)
      document.getElementById("h_proj_title").textContent = home.proj_title;
    if (home.button)
      document.getElementById("h_button").textContent = home.button;

    const grid = document.getElementById("projectsGrid");
    if (grid && Array.isArray(projects)) {
      grid.innerHTML = projects.map(p => `
        <a href="portfolio-details.html?id=${encodeURIComponent(p.id)}" class="project-card">
          <img src="${p.hero}" alt="${p.title}">
          <div class="project-content">
            <h3>${p.title}</h3>
            <p>${p.tag}</p>
          </div>
        </a>
      `).join("");
    }
  } catch (err) {
    console.error("Render error:", err);
  } finally {
    // Hide loader when content is ready
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.add("hidden");
  }
});
