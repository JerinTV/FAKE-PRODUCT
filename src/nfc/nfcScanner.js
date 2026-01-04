// frontend/src/nfc/nfcScanner.js

/*
  FIX B:
  Frontend calls backend NFC emulator
*/

export async function scanNfcTag(productId, challenge) {
  console.warn("📡 NFC emulation via backend");

  const res = await fetch("http://localhost:5000/nfc/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productId,
      challenge
    })
  });

  if (!res.ok) {
    throw new Error("Backend NFC signing failed");
  }

  const data = await res.json();

  return data.response; // ✅ THIS is the signed response
}
