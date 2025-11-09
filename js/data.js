// js/data.js
// These functions will later connect to your real backend API.
// For now, they use sample placeholder endpoints so layout is preserved.

async function getHomeData() {
  try {
    const res = await fetch("https://bndlabs-backends.onrender.com/api/home");
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
    const res = await fetch("https://bndlabs-backends.onrender.com/api/projects");
    if (!res.ok) throw new Error("Failed to load projects");
    return await res.json();
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
