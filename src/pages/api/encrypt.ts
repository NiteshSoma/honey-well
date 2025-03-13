import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const IV_LENGTH = 16;
const SALT = process.env.ENCRYPTION_SALT || "DefaultSalt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const key = crypto.pbkdf2Sync(SALT, "fixedSaltValue", 100000, 32, "sha256");

    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encryptedText = cipher.update(text, "utf8", "hex");
    encryptedText += cipher.final("hex");

    res.status(200).json({ encryptedText, iv: iv.toString("hex") });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}