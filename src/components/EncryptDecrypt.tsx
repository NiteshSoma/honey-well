import { useState } from "react";
import { Input, Button, Typography, message, Card, Row, Col } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import AppLayout from "../components/Layout";

const { Title, Text } = Typography;

export default function EncryptDecrypt() {
  const [inputText, setInputText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [decryptionInput, setDecryptionInput] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      message.warning("Please enter text to encrypt!");
      return;
    }

    try {
      const response = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      if (response.ok) {
        setEncryptedText(data.encryptedText);
        message.success("Text encrypted successfully!");
      } else {
        message.error(data.error || "Encryption failed.");
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { message: string; status?: number };
        return message.error(err.message);
      }
      message.error("Error encrypting text.");
    }
  };

  const handleDecrypt = async () => {
    if (!decryptionInput.trim()) {
      message.warning("Please enter encrypted text to decrypt!");
      return;
    }

    try {
      const response = await fetch("/api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedText: decryptionInput }),
      });

      const data = await response.json();
      if (response.ok) {
        setDecryptedText(data.decrypted);
        message.success("Text decrypted successfully!");
      } else {
        message.error(data.error || "Decryption failed.");
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { message: string; status?: number };
        return message.error(err.message);
      }
      message.error("Error decrypting text.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptedText);
    message.success("Encrypted text copied!");
  };

  return (
    <AppLayout>
      <Card style={{ width: "100%", maxWidth: 800, textAlign: "center", borderRadius: 8 }}>
        <Title level={2}>AES Encryption Tool</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="Encrypt Text" bordered={false}>
              <Input.TextArea
                rows={3}
                placeholder="Enter text to encrypt"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Button type="primary" onClick={handleEncrypt} style={{ width: "100%" }}>
                Encrypt
              </Button>

              {encryptedText && (
                <div style={{ marginTop: 15 }}>
                  <Text strong>Encrypted Text:</Text>
                  <Input.TextArea rows={3} value={encryptedText} readOnly style={{ marginBottom: 10 }} />
                  <Button icon={<CopyOutlined />} onClick={handleCopy}>
                    Copy
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Decrypt Text" bordered={false}>
              <Input.TextArea
                rows={3}
                placeholder="Paste encrypted text here"
                value={decryptionInput}
                onChange={(e) => setDecryptionInput(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Button type="default" onClick={handleDecrypt} style={{ width: "100%" }}>
                Decrypt
              </Button>

              {decryptedText && (
                <div style={{ marginTop: 15 }}>
                  <Text strong>Decrypted Text:</Text>
                  <Input.TextArea rows={3} value={decryptedText} readOnly />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </AppLayout>
  );
}
