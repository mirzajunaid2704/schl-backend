const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATA FILE SETUP =================
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "enquiries.json");

// Create data folder if not exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create enquiries.json if not exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
  res.send("Suvidya School Backend is running ✅");
});

// Submit enquiry
app.post("/api/enquiry", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newEnquiry = {
    id: Date.now(),
    name,
    email,
    phone,
    message,
    date: new Date().toLocaleString()
  };

  const enquiries = JSON.parse(fs.readFileSync(dataFile));
  enquiries.push(newEnquiry);
  fs.writeFileSync(dataFile, JSON.stringify(enquiries, null, 2));

  res.json({ success: true, message: "Enquiry submitted successfully" });
});

// Get all enquiries (Admin Panel)
app.get("/api/enquiries", (req, res) => {
  const enquiries = JSON.parse(fs.readFileSync(dataFile));
  res.json(enquiries);
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});