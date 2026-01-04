// backend/nfc_emulator/chip.js
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
  chip.js        -> backend/nfc_emulator/chip.js
  secretStore.js -> backend/secretStore.json
*/
const SECRET_FILE = path.join(__dirname, "../secretStore.json");

function loadSecrets() {
  if (!fs.existsSync(SECRET_FILE)) {
    console.error("❌ secretStore.json NOT FOUND at:", SECRET_FILE);
    return {};
  }

  return JSON.parse(fs.readFileSync(SECRET_FILE, "utf-8"));
}

export function signChallenge(productId, challenge) {
  const secrets = loadSecrets();

  console.log("🔎 NFC DEBUG:");
  console.log("Product ID:", productId);
  console.log("Available secrets:", Object.keys(secrets));

  const secret = secrets[productId];

  if (!secret) {
    throw new Error("Unknown NFC chip / secret not found");
  }

  return crypto
    .createHash("sha256")
    .update(secret + challenge)
    .digest("hex");
}
