import React, { useState } from "react";
import "../css/Login.css";


const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("doctor");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(role, name);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">MedTrust AI Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
