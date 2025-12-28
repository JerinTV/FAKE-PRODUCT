// frontend/src/nfc/nfcScanner.js
import CryptoJS from "crypto-js";

/*
  scanNfcTag(productId, challenge)
  → returns cryptographic response
*/
export async function scanNfcTag(productId, challenge) {

  /* ================= REAL NFC (future) ================= */
  if ("NDEFReader" in window) {
    console.warn("Web NFC detected — real NFC support pending");

    /*
      Real secure NFC chips (DESFire, NTAG424)
      would compute HMAC internally.
      Web NFC cannot do secure auth yet.
    */

    throw new Error("Secure NFC auth not supported via Web NFC");
  }

  /* ================= DEMO MODE ================= */
  console.warn("Web NFC not supported — using demo mode");

  // MUST match backend chip.js secret
  const DEMO_SECRET_MAP = {
    P1001: "SECURE_SECRET_1001",
    P1002: "SECURE_SECRET_1002"
  };

  const secret = DEMO_SECRET_MAP[productId];

  if (!secret) {
    throw new Error("Unknown demo NFC tag");
  }

  // response = hash(secret + challenge)
  const response = CryptoJS.SHA256(secret + challenge).toString();

  return response;
}
