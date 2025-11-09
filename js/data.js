// js/data.js
// Connects all pages to the live BndLabs backend API
const API = "https://bndlabs-backend.onrender.com/api";

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.warn("Backend not connected yet:", err);
    return null;
  }
}

// HOME
async function getHomeData() {
  return await fetchJSON(`${API}/home`);
}

// PROJECTS
async function getProjects() {
  return await fetchJSON(`${API}/projects`);
}

// BLOGS
async function getBlogs() {
  return await fetchJSON(`${API}/blogs`);
}

// PROFILE (for admin or About)
async function getProfile() {
  return await fetchJSON(`${API}/profile`);
}

// ABOUT
async function getAbout() {
  return await fetchJSON(`${API}/about`);
}

// CONTACT
async function getContact() {
  return await fetchJSON(`${API}/contact`);
}

// 404 PAGE
async function getPage404() {
  return await fetchJSON(`${API}/404`);
}
