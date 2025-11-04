import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple hardcoded admin for now (can connect to backend later)
    if (email === "admin@ehr.com" && password === "secure123") {
      alert("Admin login successful ✅");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-green">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
