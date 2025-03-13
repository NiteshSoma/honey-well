import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const SALT = process.env.ENCRYPTION_SALT || "DefaultSalt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { encryptedText, iv } = req.body;
  if (!encryptedText || !iv) {
    return res.status(400).json({ error: "Encrypted text and IV are required" });
  }

  try {
    const key = crypto.pbkdf2Sync(SALT, "fixedSaltValue", 100000, 32, "sha256");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    res.status(200).json({ decrypted });
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status?: number };
      return res.status(err.status || 500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
