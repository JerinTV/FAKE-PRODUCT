// src/components/UserDashboard.jsx

import { useState } from "react";
import { scanNfcTag } from "../../nfc/nfcScanner.js";
import { requestChallenge,verifyResponse } from "../../services/api.js";
import "../../index2.css";

const UserDashboard = () => {
  const [status, setStatus] = useState("");
  const [product, setProduct] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [productId, setProductId] = useState(""); // Add productId state
  const searchProductId = productId.trim();
  
// ---------- Scan NFC & Verify ----------
const handleScanAndVerify = async () => {
  if (!searchProductId) {
    setStatus("❗ Please enter a Product ID.");
    return;
  }

  try {
    setScanning(true);
    setStatus("🔄 Requesting challenge...");

    // 1️⃣ Request challenge
    const { challenge } = await requestChallenge(searchProductId);

    console.log("FRONTEND DEBUG:");
    console.log("Product ID:", searchProductId);
    console.log("Challenge:", challenge);

    // 2️⃣ NFC signs challenge
    setStatus("📡 Signing challenge via NFC...");
    const response = await scanNfcTag(searchProductId, challenge);

    console.log("Response:", response);

    // 3️⃣ Verify with backend
    setStatus("🔐 Verifying product...");
    const result = await verifyResponse(searchProductId, response);

    if (result.status === "GENUINE") {
      setStatus("✅ Genuine Product");
      setProduct(result.product);
    } else {
      setStatus("❌ Fake Product");
      setProduct(null);
    }

  } catch (err) {
    console.error("Verification error:", err);
    setStatus("❌ Verification failed");
    setProduct(null);
  } finally {
    setScanning(false);
  }
};


  return (
    <div className="premium-dashboard" style={{ width: "100vw", padding: "20px" }}>
      <h2>Product Verification Portal</h2>

      {/* ================= SCAN NFC ================= */}
      <div className="product-form">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={e => setProductId(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px", width: "250px" }}
        />
        <button
          className="btn-outline"
          onClick={handleScanAndVerify}
          disabled={scanning}
          style={{ marginBottom: "15px", marginLeft: "10px" }}
        >
          {scanning ? "Scanning NFC..." : "Scan NFC"}
        </button>

        {status && <div className="login-error">{status}</div>}

        {/* ================= PRODUCT CARD ================= */}
        {product && (
          <div
            className="fetched-product-card premium"
            style={{
              display: "flex",
              padding: "25px",
              gap: "25px",
              width: "95%",
              marginTop: "20px",
              alignItems: "flex-start"
            }}
          >
            {/* ---------- IMAGE ---------- */}
            <div className="fetched-image">
              <img
                src={product.image}
                alt={product.name}
                className="product-preview"
                style={{
                  width: "350px",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.25)"
                }}
              />
            </div>

            {/* ---------- DETAILS ---------- */}
            <div className="fetched-details" style={{ flex: 1 }}>
              <h3>{product.name}</h3>

              <div
                className="details-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px",
                  marginTop: "10px"
                }}
              >
                <div><strong>Product ID:</strong> {product.productId}</div>
                <div><strong>Manufacturer:</strong> {product.manufacturer}</div>
              </div>

              {/* ---------- STATUS ---------- */}
              <div
                className="status-icons"
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "30px",
                  fontSize: "20px"
                }}
              >
                <div>
                  <strong>Shipped:</strong>{" "}
                  {product.shipped ? "✔️" : "❌"}
                </div>
                <div>
                  <strong>Verified:</strong>{" "}
                  {product.verifiedByRetailer ? "✔️" : "❌"}
                </div>
                <div>
                  <strong>Sold:</strong>{" "}
                  {product.sold ? "✔️" : "❌"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
