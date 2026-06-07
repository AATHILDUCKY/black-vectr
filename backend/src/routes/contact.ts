import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma";
import { env } from "../lib/env";
import { sendMail } from "../lib/mailer";
import { asyncHandler, ApiError } from "../middleware/error";
import { validateBody } from "../middleware/validate";
import { contactSchema } from "../schemas";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 5/15min was tripping during normal use/testing (and trips fast in dev where
  // every submission shares one IP). 20/15min still blocks spam comfortably.
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  // Don't rate-limit local development at all, so testing the form is painless.
  skip: () => !env.isProd,
  message: { error: "Too many submissions. Please try again in a few minutes." },
});

router.post(
  "/",
  contactLimiter,
  validateBody(contactSchema),
  asyncHandler(async (req, res) => {
    const { name, email, company, service, message, website } = req.body;

    // Honeypot tripped → pretend success, store nothing.
    if (website) return res.status(201).json({ ok: true });

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company: company || null,
        service: service || null,
        message,
      },
    });

    // Notify the agency (logged to console in dev when no SMTP configured).
    try {
      await sendMail({
        to: env.smtp.notifyTo,
        replyTo: email,
        subject: `New contact form lead — ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          service ? `Service: ${service}` : null,
          "",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (err) {
      // Don't fail the request if the email transport hiccups.
      console.error("Contact notification email failed:", err);
    }

    res.status(201).json({ ok: true, id: lead.id });
  }),
);

export default router;
