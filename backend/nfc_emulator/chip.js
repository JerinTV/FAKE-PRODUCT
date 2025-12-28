
// backend/nfc_emulator/chip.js
import crypto from "crypto";
import { secretStore } from "./secretStore.js";

export function signChallenge(productId, challenge) {
  const secret = secretStore[productId];

  

  if (!secret) {
    throw new Error("Unknown NFC chip");
  }

  return crypto
    .createHash("sha256")
    .update(secret + challenge)
    .digest("hex");
}
