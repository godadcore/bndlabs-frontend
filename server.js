// server.js
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files if you want to host frontend together
app.use(express.static("public"));

// === ROUTES ===

// 1️⃣ Home page data
app.get("/api/home", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/home.json", "utf8"));
  res.json(data);
});

// 2️⃣ Projects data
app.get("/api/projects", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/projects.json", "utf8"));
  res.json(data);
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ BndLabs backend running on http://localhost:${PORT}`);
});
