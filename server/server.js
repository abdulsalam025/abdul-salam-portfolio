import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "abdulsalam024.main@gmail.com";

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

let messagesCollection = null;

async function connectDatabase() {
  if (
    !process.env.MONGODB_URI ||
    String(process.env.MONGODB_URI).includes("YOUR_")
  ) {
    console.log("MongoDB skipped. Contact will email only.");
    return;
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 15000,
  });

  await mongoClient.connect();

  const db = mongoClient.db(
    process.env.MONGODB_DB_NAME || "abdul_salam_portfolio"
  );

  messagesCollection = db.collection("contactMessages");

  console.log("MongoDB connected.");
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API is running.",
    mail: Boolean(
      process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL
    ),
  });
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages. Please try again later.",
  },
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      cleanName.length < 2 ||
      !emailPattern.test(cleanEmail) ||
      cleanSubject.length < 2 ||
      cleanMessage.length < 10
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid information.",
      });
    }

    // Save the message to MongoDB when the database is available.
    let savedMessage = null;

    if (messagesCollection) {
      savedMessage = await messagesCollection.insertOne(
        {
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          createdAt: new Date(),
          emailStatus: "pending",
          emailProvider: "resend",
        },
        {
          timeoutMS: 10000,
        }
      );
    }

    // Send email notification through Resend HTTPS API in the background.
    const emailNotification = (async () => {
      const apiKey = process.env.RESEND_API_KEY;
      const to = CONTACT_EMAIL;

      const from =
        process.env.RESEND_FROM_EMAIL ||
        "Portfolio <onboarding@resend.dev>";

      if (!apiKey || !to) {
        throw new Error(
          "Resend email configuration is missing. Set RESEND_API_KEY and CONTACT_EMAIL."
        );
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from,
              to: [to],
              reply_to: [cleanEmail],
              subject: `Portfolio Contact: ${cleanSubject}`,
              text: [
                "New portfolio contact message",
                "",
                `Name: ${cleanName}`,
                `Email: ${cleanEmail}`,
                `Subject: ${cleanSubject}`,
                "",
                "Message:",
                cleanMessage,
              ].join("\n"),
            }),
            signal: controller.signal,
          }
        );

        const responseText = await response.text();

        let result = {};

        try {
          result = JSON.parse(responseText);
        } catch {
          result = {};
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Resend API request failed with HTTP ${response.status}.`
          );
        }

        // Update MongoDB only when MongoDB is connected and a document was saved.
        if (messagesCollection && savedMessage?.insertedId) {
          await messagesCollection.updateOne(
            {
              _id: savedMessage.insertedId,
            },
            {
              $set: {
                emailStatus: "sent",
                emailSentAt: new Date(),
                emailProvider: "resend",
                emailId: result?.id || null,
              },
            }
          );
        }

        console.log(
          `Email notification sent via Resend for: ${cleanEmail}`
        );
      } catch (error) {
        const errorMessage =
          error?.name === "AbortError"
            ? "Resend API request timed out."
            : error?.message || String(error);

        console.error(
          "Resend email notification failed:",
          errorMessage
        );

        if (messagesCollection && savedMessage?.insertedId) {
          try {
            await messagesCollection.updateOne(
              {
                _id: savedMessage.insertedId,
              },
              {
                $set: {
                  emailStatus: "failed",
                  emailProvider: "resend",
                  emailError: errorMessage,
                },
              }
            );
          } catch (updateError) {
            console.error(
              "Could not update email failure status:",
              updateError?.message || String(updateError)
            );
          }
        }
      } finally {
        clearTimeout(timeout);
      }
    })();

    // Do not make the contact form wait for the email provider.
    void emailNotification;

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Unable to send the message right now.",
      });
    }
  }
});

const distPath = path.join(__dirname, "../dist");

app.use(express.static(distPath));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

connectDatabase()
  .catch((error) => {
    console.warn("MongoDB skipped:", error.message);
  })
  .finally(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        "Portfolio API running on http://localhost:" + PORT
      );
    });
  });