import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

const API = "http://localhost:5000/api/auth";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /* ================= USER REGISTER ================= */
  const handleSignUp = async () => {
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      alert("Account created successfully");
      setMode("signin");
      setEmail("");
      setPassword("");
      setError("");

    } catch {
      setError("Server error");
      
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // 🔐 Save JWT token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      navigate(`/dashboard/${data.role}`);

    } catch {
      setError("Server error");
    }
  };

  return (
  <div className="login-page">
    <div className="login-card">

      <h1 className="login-title">
        {role.toUpperCase()} {mode === "signup" ? "REGISTER" : "LOGIN"}
      </h1>

      {/* Toggle for all roles */}
      <div className="login-toggle">
        <button
          className={mode === "signin" ? "active-toggle" : ""}
          onClick={() => setMode("signin")}
        >
          SIGN IN
        </button>

        <button
          className={mode === "signup" ? "active-toggle" : ""}
          onClick={() => setMode("signup")}
        >
          SIGN UP
        </button>
      </div>

      <input
        className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      {error && <div className="login-error">{error}</div>}

      {mode === "signup" ? (
        <button className="btn-primary login-btn" onClick={handleSignUp}>
          CREATE ACCOUNT
        </button>
      ) : (
        <button className="btn-primary login-btn" onClick={handleLogin}>
          LOGIN
        </button>
      )}

    </div>
  </div>
);

};

export default Login;
