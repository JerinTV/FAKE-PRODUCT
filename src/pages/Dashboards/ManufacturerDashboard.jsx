// src/components/ManufacturerDashboard.jsx

import React, { useState } from "react";
import {
  connectBlockchain,
  registerBatch,
  shipBox,
  getProduct,
  getProductIdsByBox
} from "../../trustChain";
import "../../index2.css";

/* ================= DEFAULT BATCH TEMPLATE ================= */

const defaultBatch = {
  batchId: "BATCH-567",
  boxId: "BOX-001",
  batchSize: 5,
  startProductId: "P1001",

  // Product template
  name: "Smartphone X",
  category: "Smartphone",
  manufacturer: "TechCorp Ltd.",
  manufacturerDate: "2025-12-10",
  manufacturePlace: "Bangalore, India",
  modelNumber: "X1000",
  warrantyPeriod: "24 months",
  color: "Black",
  price: 65000,
  image: "/mob.jpg"
};

const ManufacturerDashboard = () => {
  const [batch, setBatch] = useState(defaultBatch);
  const [status, setStatus] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeAction, setActiveAction] = useState("register");
  const [batchCreated, setBatchCreated] = useState(false);

  const [boxId, setBoxId] = useState("");
  const [boxProducts, setBoxProducts] = useState([]);

  const [searchProductId, setSearchProductId] = useState("");
  const [fetchedProduct, setFetchedProduct] = useState(null);

  /* ================= CONNECT WALLET ================= */

  const handleConnect = async () => {
    try {
      await connectBlockchain();
      setWalletConnected(true);
      setStatus("✅ Wallet connected");
    } catch (err) {
      console.error(err);
      setStatus("❌ Wallet connection failed");
    }
  };

  /* ================= CREATE & REGISTER BATCH ================= */

  const handleCreateBatch = async () => {
    try {
      setStatus("⏳ Registering batch on blockchain...");
      await registerBatch(batch);
      setBatchCreated(true);

      const start = parseInt(batch.startProductId.replace(/\D/g, ""));
      const end = start + batch.batchSize - 1;

      setStatus(
        `✅ Batch registered successfully.
Products created: P${start} → P${end}`
      );
    } catch (err) {
      console.error(err);
      setStatus("❌ Batch registration failed");
    }
  };

  /* ================= FETCH BOX ================= */

  const handleFetchBox = async () => {
    try {
      setStatus("⏳ Fetching box...");
      const ids = await getProductIdsByBox(boxId);
      const products = [];

      for (let pid of ids) {
        const p = await getProduct(pid);
        products.push(p);
      }

      setBoxProducts(products);
      setStatus(`📦 Box ${boxId} contains ${products.length} products`);
    } catch {
      setBoxProducts([]);
      setStatus("❌ Box not found");
    }
  };

  /* ================= SHIP BOX ================= */

  const handleShipBox = async () => {
  try {
    setStatus("⏳ Shipping box...");
    await shipBox(boxId); // ✅ ONE transaction
    setStatus("✅ Box shipped successfully");
    handleFetchBox();
  } catch (err) {
    console.error(err);
    setStatus("❌ Shipping failed");
  }
};


  /* ================= FETCH PRODUCT ================= */

  const handleFetchProduct = async () => {
    try {
      const p = await getProduct(searchProductId);
      setFetchedProduct(p);
      setStatus("");
    } catch {
      setFetchedProduct(null);
      setStatus("❌ Product not found");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="premium-dashboard" style={{ width: "100vw", padding: "20px" }}>
      <h2>Manufacturer Dashboard</h2>

      {/* WALLET */}
      <div className="center" style={{ marginBottom: "20px" }}>
        <button
          className="btn-primary"
          onClick={handleConnect}
          style={{ backgroundColor: walletConnected ? "#28a745" : "#007bff" }}
        >
          {walletConnected ? "Connected" : "Connect Wallet"}
        </button>
      </div>

      {/* ACTION SWITCH */}
      <div className="center" style={{ marginBottom: "20px" }}>
        <button className="btn-outline" onClick={() => setActiveAction("register")}>
          Register Batch
        </button>
        <button className="btn-outline" onClick={() => setActiveAction("ship")}>
          Ship Box
        </button>
        <button className="btn-outline" onClick={() => setActiveAction("fetch")}>
          Fetch Product
        </button>
      </div>

      {/* ================= REGISTER BATCH ================= */}

      {activeAction === "register" && (
        <div className="product-form">

          <h3>Batch Details</h3>

          <div className="form-row">
            <input disabled={batchCreated} placeholder="Batch ID"
              value={batch.batchId}
              onChange={e => setBatch({ ...batch, batchId: e.target.value })} />

            <input disabled={batchCreated} placeholder="Box ID"
              value={batch.boxId}
              onChange={e => setBatch({ ...batch, boxId: e.target.value })} />

            <input disabled={batchCreated} type="number" placeholder="Batch Size"
              value={batch.batchSize}
              onChange={e => setBatch({ ...batch, batchSize: Number(e.target.value) })} />

            <input disabled={batchCreated} placeholder="Start Product ID"
              value={batch.startProductId}
              onChange={e => setBatch({ ...batch, startProductId: e.target.value })} />
          </div>

          <h3>Product Template</h3>

          <div className="form-row">
            <input disabled={batchCreated} placeholder="Product Name"
              value={batch.name}
              onChange={e => setBatch({ ...batch, name: e.target.value })} />

            <input disabled={batchCreated} placeholder="Category"
              value={batch.category}
              onChange={e => setBatch({ ...batch, category: e.target.value })} />

            <input disabled={batchCreated} placeholder="Model Number"
              value={batch.modelNumber}
              onChange={e => setBatch({ ...batch, modelNumber: e.target.value })} />
          </div>

          <div className="form-row">
            <input disabled={batchCreated} placeholder="Color"
              value={batch.color}
              onChange={e => setBatch({ ...batch, color: e.target.value })} />

            <input disabled={batchCreated} placeholder="Warranty"
              value={batch.warrantyPeriod}
              onChange={e => setBatch({ ...batch, warrantyPeriod: e.target.value })} />

            <input disabled={batchCreated} type="number" placeholder="Price"
              value={batch.price}
              onChange={e => setBatch({ ...batch, price: Number(e.target.value) })} />
          </div>

          <button
            className="btn-primary"
            disabled={batchCreated}
            onClick={handleCreateBatch}
          >
            Create & Register Batch
          </button>

          {status && <div className="login-error">{status}</div>}
        </div>
      )}

      {/* ================= SHIP BOX ================= */}

      {activeAction === "ship" && (
        <div className="product-form">
          <input placeholder="Enter Box ID"
            value={boxId}
            onChange={e => setBoxId(e.target.value)} />

          <button className="btn-outline" onClick={handleFetchBox}>
            Fetch Box
          </button>

          {boxProducts.length > 0 && (
            <button className="btn-primary" onClick={handleShipBox}>
              Ship All ({boxProducts.length})
            </button>
          )}

          {status && <div className="login-error">{status}</div>}
        </div>
      )}

      {/* ================= FETCH PRODUCT ================= */}

      {activeAction === "fetch" && (
        <div className="product-form">
          <input placeholder="Enter Product ID"
            value={searchProductId}
            onChange={e => setSearchProductId(e.target.value)} />

          <button className="btn-outline" onClick={handleFetchProduct}>
            Fetch
          </button>

          {fetchedProduct && (
            <div className="fetched-product-card">
              <h4>{fetchedProduct.name}</h4>
              <p>Product ID: {fetchedProduct.productId}</p>
              <p>Box ID: {fetchedProduct.boxId}</p>
              <p>Shipped: {fetchedProduct.shipped ? "Yes" : "No"}</p>
            </div>
          )}

          {status && <div className="login-error">{status}</div>}
        </div>
      )}
    </div>
  );
};

export default ManufacturerDashboard;
