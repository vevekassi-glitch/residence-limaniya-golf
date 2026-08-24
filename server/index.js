import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 3001;

/* ——— Security ——— */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "10kb" }));

/* ——— Rate limiting ——— */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ——— Email (lazy init, no crash on failure) ——— */
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    return transporter;
  }

  // Dev: try Ethereal, fallback to console logger
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("📧 Ethereal:", testAccount.user);
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return transporter;
  } catch {
    console.log("⚠️  Email: mode console (pas de SMTP configuré)");
    transporter = {
      sendMail: async (opts) => {
        console.log("📬 [DEV] To:", opts.to, "| Subject:", opts.subject);
        return { messageId: "dev-" + Date.now() };
      },
    };
    return transporter;
  }
}

/* ——— Health ——— */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ——— Contact POST ——— */
app.post("/api/contact", contactLimiter, [
  body("name").trim().isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage("Nom invalide."),
  body("email").trim().isEmail().withMessage("Email invalide.").normalizeEmail(),
  body("phone").optional({ checkFalsy: true }).trim()
    .matches(/^[\d\s\+\-\(\)]{8,20}$/).withMessage("Téléphone invalide."),
  body("subject").trim().isLength({ min: 3, max: 200 })
    .withMessage("Objet invalide."),
  body("message").trim().isLength({ min: 10, max: 2000 })
    .withMessage("Message invalide (10-2000 caractères)."),
  body("website").optional().custom((v) => {
    if (v && v.length > 0) throw new Error("Spam");
    return true;
  }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Données invalides",
      details: errors.array().map((e) => e.msg),
    });
  }

  const { name, email, phone, subject, message } = req.body;

  try {
    const transport = await getTransporter();

    const info = await transport.sendMail({
      from: `"Résidence Limaniya Golf" <${process.env.SMTP_USER || "noreply@limaniya.ci"}>`,
      to: "desire.yoopi@gmail.com",
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f6f0;padding:32px;">
  <div style="background:#1a2332;padding:20px;text-align:center;margin-bottom:20px;">
    <h1 style="color:#cba24b;font-size:18px;margin:0;">RÉSIDENCE LIMANIYA GOLF</h1>
    <p style="color:#e9e1ce;font-size:11px;margin:6px 0 0;letter-spacing:2px;">NOUVEAU MESSAGE</p>
  </div>
  <div style="background:#fff;padding:20px;border-radius:4px;margin-bottom:12px;">
    <p><strong style="color:#999;font-size:11px;text-transform:uppercase;">Nom:</strong> ${name}</p>
    <p><strong style="color:#999;font-size:11px;text-transform:uppercase;">Email:</strong> <a href="mailto:${email}" style="color:#cba24b;">${email}</a></p>
    ${phone ? `<p><strong style="color:#999;font-size:11px;text-transform:uppercase;">Tél:</strong> ${phone}</p>` : ""}
    <p><strong style="color:#999;font-size:11px;text-transform:uppercase;">Objet:</strong> ${subject}</p>
  </div>
  <div style="background:#fff;padding:20px;border-radius:4px;border-left:4px solid #cba24b;">
    <p style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 8px;">Message</p>
    <p style="color:#333;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${message}</p>
  </div>
  <p style="text-align:center;color:#999;font-size:10px;margin-top:16px;">
    ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Abidjan" })}
  </p>
</div>`,
      text: `LIMANIYA GOLF\nNom: ${name}\nEmail: ${email}\n${phone ? `Tél: ${phone}\n` : ""}Objet: ${subject}\n\n${message}`,
    });

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("✅ Email:", preview);

    // Auto-reply
    await transport.sendMail({
      from: `"Résidence Limaniya Golf" <noreply@limaniya.ci>`,
      to: email,
      subject: "Bien reçu — Résidence Limaniya Golf",
      html: `<div style="font-family:Arial;max-width:500px;margin:0 auto;padding:32px;">
        <h2 style="color:#1a2332;">Merci ${name} !</h2>
        <p>Votre message concernant « ${subject} » a bien été reçu.</p>
        <p>Notre équipe vous répondra sous 24h.</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;">
        <p style="color:#999;font-size:11px;">Résidence Limaniya Golf · Riviera 4, Abidjan</p>
      </div>`,
    });

    res.json({ success: true, message: "Votre message a été envoyé avec succès." });
  } catch (err) {
    console.error("❌ Email:", err.message);
    res.status(500).json({ error: "Erreur lors de l'envoi. Réessayez." });
  }
});

/* ——— Start ——— */
app.listen(PORT, () => {
  console.log(`\n🏨 Backend: http://localhost:${PORT}`);
  console.log(`   POST /api/contact`);
  console.log(`   GET  /api/health\n`);
});
