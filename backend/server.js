import cors from "cors";
import express from "express";
import crypto from "crypto";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { signChallenge } from "./nfc_emulator/chip.js";

dotenv.config();

/* ---------------- Path utils ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- Load ABI safely ---------------- */
const abi = JSON.parse(
  fs.readFileSync(path.join(__dirname, "abi.json"), "utf-8")
);

/* ---------------- App setup ---------------- */
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

/* ---------------- Blockchain setup ---------------- */
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

/* ---------------- Challenge store ---------------- */
// productId -> challenge
const activeChallenges = new Map();

/* ---------------- Utils ---------------- */
function generateChallenge() {
  return crypto.randomBytes(8).toString("hex");
}

/* =================================================
   1️⃣ CHALLENGE ENDPOINT
   ================================================= */
app.post("/challenge", async (req, res) => {
  try {
    const { productId } = req.body;

    console.log("BACKEND DEBUG:");
    console.log("RPC_URL:", process.env.RPC_URL);
    console.log("CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS);
    console.log("Checking product:", productId);


    if (!productId) {
      return res.status(400).json({ error: "productId required" });
    }

    const product = await contract.getProduct(productId);

    if (!product.productId) {
      return res.json({ status: "FAKE", reason: "Not registered" });
    }

    if (!product.shipped || !product.verifiedByRetailer) {
      return res.json({ status: "NOT_READY" });
    }

    const challenge = generateChallenge();

    activeChallenges.set(productId, challenge);

    res.json({ challenge });

  } catch (err) {
    console.error("Challenge error:", err);
    res.status(500).json({ error: "Challenge generation failed" });
  }
});

/* =================================================
   2️⃣ VERIFY ENDPOINT
   ================================================= */
app.post("/verify", async (req, res) => {
  try {
    const { productId, response } = req.body;

    if (!productId || !response) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const challenge = activeChallenges.get(productId);

    if (!challenge) {
      return res.json({ status: "FAILED", reason: "No active challenge" });
    }

    /* NFC emulator signs internally */
    const expected = signChallenge(productId, challenge);

    console.log("VERIFY DEBUG:");
    console.log("Product ID:", productId);
    console.log("Challenge:", challenge);
    console.log("Expected:", expected);
    console.log("Received:", response);

    if (expected !== response) {
      activeChallenges.delete(productId); // prevent replay
      return res.json({ status: "FAKE" });
    }

    const product = await contract.getProduct(productId);

    activeChallenges.delete(productId); // one-time use

    res.json({
      status: "GENUINE",
      product: {
        productId: product.productId,
        name: product.name,
        image: product.image,
        manufacturer: product.manufacturer,
        shipped: product.shipped,
        verifiedByRetailer: product.verifiedByRetailer,
        sold: product.sold
      }
    });



  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

/* ---------------- Server ---------------- */
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
