import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "abdulsalam024.main@gmail.com";

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));

let messagesCollection = null;

async function connectDatabase() {
  if (!process.env.MONGODB_URI || String(process.env.MONGODB_URI).includes("YOUR_")) {
    console.log("MongoDB skipped. Contact will email only.");
    return;
  }
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db(process.env.MONGODB_DB_NAME || "abdul_salam_portfolio");
  messagesCollection = db.collection("contactMessages");
  console.log("MongoDB connected.");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

app.get("/api/health", (req, res) => {
  const pass = String(process.env.SMTP_PASS || "");
  res.json({ success: true, mail: Boolean(pass && pass.indexOf("YOUR_") < 0 && pass.length >= 16) });
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many messages. Please try again later." }
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanName.length < 2 || !emailPattern.test(cleanEmail) || cleanSubject.length < 2 || cleanMessage.length < 10) {
      return res.status(400).json({ success: false, message: "Please provide valid information." });
    }
    const pass = String(process.env.SMTP_PASS || "");
    if (!process.env.SMTP_USER || !pass || pass.indexOf("YOUR_") >= 0) {
      return res.status(500).json({ success: false, message: "Mail is not configured on the server." });
    }
    if (messagesCollection) {
      await messagesCollection.insertOne({ name: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage, createdAt: new Date() });
    }
    await transporter.sendMail({
      from: '"Portfolio Contact" <' + process.env.SMTP_USER + ">",
      to: CONTACT_EMAIL,
      replyTo: cleanEmail,
      subject: "Portfolio Contact: " + cleanSubject,
      text: "Name: " + cleanName + "\nEmail: " + cleanEmail + "\nSubject: " + cleanSubject + "\n\n" + cleanMessage + "\n"
    });
    return res.status(201).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Unable to send the message right now." });
    }
  }
});

const distPath = path.join(__dirname, "../dist");

app.use(express.static(distPath));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

connectDatabase().catch((error) => {
  console.warn("MongoDB skipped:", error.message);
}).finally(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Portfolio API running on http://localhost:" + PORT);
  });
});