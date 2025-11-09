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

app.post("/api/home", (req, res) => {
  fs.writeFileSync("./data/home.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ Home data saved successfully!" });
});

// 2️⃣ Projects data
app.get("/api/projects", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/projects.json", "utf8"));
  res.json(data);
});

app.post("/api/projects", (req, res) => {
  fs.writeFileSync("./data/projects.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ Projects saved successfully!" });
});

// 3️⃣ Blogs data
app.get("/api/blogs", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/blogs.json", "utf8"));
  res.json(data);
});

app.post("/api/blogs", (req, res) => {
  fs.writeFileSync("./data/blogs.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ Blogs saved successfully!" });
});

// 4️⃣ Profile data
app.get("/api/profile", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/profile.json", "utf8"));
  res.json(data);
});

app.post("/api/profile", (req, res) => {
  fs.writeFileSync("./data/profile.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ Profile saved successfully!" });
});

// 5️⃣ About data
app.get("/api/about", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/about.json", "utf8"));
  res.json(data);
});

app.post("/api/about", (req, res) => {
  fs.writeFileSync("./data/about.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ About data saved successfully!" });
});

// 6️⃣ Contact data
app.get("/api/contact", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/contact.json", "utf8"));
  res.json(data);
});

app.post("/api/contact", (req, res) => {
  fs.writeFileSync("./data/contact.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ Contact data saved successfully!" });
});

// 7️⃣ 404 Page data
app.get("/api/404", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/404.json", "utf8"));
  res.json(data);
});

app.post("/api/404", (req, res) => {
  fs.writeFileSync("./data/404.json", JSON.stringify(req.body, null, 2), "utf8");
  res.json({ message: "✅ 404 data saved successfully!" });
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ BndLabs backend running on http://localhost:${PORT}`);
});
