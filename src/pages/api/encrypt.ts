import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "default_secret";
const salt = process.env.SALT || "name";
const key = crypto.scryptSync(secretKey, salt, 32);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedText = cipher.update(text, "utf8", "hex");
    encryptedText += cipher.final("hex");

    return res.status(200).json({ encryptedText });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ error: "Encryption failed" });
  }
}