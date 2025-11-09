// js/data.js
// These functions connect to your live backend API on Render
// Only the first 3 projects will show on the home page.

async function getHomeData() {
  try {
    const res = await fetch("https://bndlabs-backend.onrender.com/api/home");
    if (!res.ok) throw new Error("Failed to load home data");
    return await res.json();
  } catch (err) {
    console.warn("Backend not connected yet:", err);
    // Temporary dummy data for visual preview
    return {
      title: "UI/UX Designer & Developer",
      sub: "I design clean, conversion-focused digital interfaces.",
      pill: "Design + Code",
      proj_title: "Some of my latest work",
      button: "See All Work"
    };
  }
}

async function getProjects() {
  try {
    const res = await fetch("https://bndlabs-backend.onrender.com/api/projects");
    if (!res.ok) throw new Error("Failed to load projects");
    const projects = await res.json();

    // ✅ Limit to first 3 projects for home display
    return projects.slice(0, 3);
  } catch (err) {
    console.warn("Backend not connected yet:", err);
    // Temporary dummy projects for visual preview
    return [
      { id: "1", title: "Monitor Dashboard", tag: "Web App", hero: "images/project1.jpg" },
      { id: "2", title: "Analytics Suite", tag: "UI Design", hero: "images/project2.jpg" },
      { id: "3", title: "Marketing Landing Page", tag: "Web Design", hero: "images/project3.jpg" }
    ];
  }
}
