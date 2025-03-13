import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "default_secret";
const salt = process.env.SALT || "YourName";
const key = crypto.scryptSync(secretKey, salt, 32);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { encryptedText } = req.body;
    if (!encryptedText) {
      return res.status(400).json({ error: "Encrypted text is required" });
    }

    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return res.status(200).json({ decrypted });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ error: "Decryption failed" });
  }
}