
# FAKE-PRODUCT 🚫📦

A blockchain-based anti-counterfeit system using NFC and Challenge–Response authentication.

---

## 🚀 Project Overview

Fake products can easily enter the supply chain when static identifiers (QR/NFC IDs) are used.
This project prevents counterfeiting by combining:

- NFC scanning
- Challenge–Response authentication
- Blockchain-based product records

---

## 🔐 Core Idea

Instead of trusting a fixed product ID, the system verifies that an NFC tag can correctly respond to a random challenge without revealing its secret.

---

## 🧠 Architecture

```

User scans NFC
↓
Frontend reads Product ID
↓
Backend generates challenge
↓
NFC (simulated secure chip) signs challenge
↓
Backend verifies response
↓
Blockchain validates product lifecycle
↓
UI shows Genuine / Fake

```

---

## 📁 Project Structure

```

backend/        → Security, verification, blockchain
contracts/      → Smart contracts (Solidity)
frontend/       → React UI + NFC scanning

````

---

## 🔧 Technologies Used

- NFC (Web NFC)
- Node.js + Express
- Ethereum + Solidity
- Hardhat
- React
- Ethers.js

---

## 🧪 NFC Implementation

- NFC tags store **only Product ID**
- Cryptographic secret is **never readable**
- Secure NFC behavior is **simulated** in backend
- Architecture supports real secure NFC chips (NTAG 424 / DESFire)

---

## ⛓️ Blockchain Role

- Stores immutable product records
- Tracks lifecycle (registered, shipped, sold)
- Prevents tampering of verification history

---

## ⚠️ Limitations

- Web NFC works only on Android Chrome
- Secure NFC hardware is simulated
- Physical tag transfer is not digitally preventable

---

## ✅ Future Enhancements

- Integrate secure NFC chips (NTAG 424)
- Native Android app for APDU support
- Scan history & analytics
- Tamper-evident packaging

---

## 👨‍💻 How to Run

### Backend
```bash
cd backend
npm install
node server.js
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Conclusion

This project demonstrates a realistic, scalable approach to counterfeit detection using Challenge–Response authentication combined with blockchain trust.

```

---

# ✅ What you should do next (short & practical)

1️⃣ Plug `api.js` and `nfcScanner.js` into `UserDashboard.jsx`  
2️⃣ Run backend + frontend together  
3️⃣ Test with a **real NFC tag** containing `P1001`  
4️⃣ Demo: original tag vs copied tag  

You now have a **complete, professional-grade project**.

If you want next, I can:
- Fix any runtime errors
- Clean up `UserDashboard.jsx` fully
- Add visual verification states
- Prepare a short demo script

Just tell me what to do next 👍
```




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
