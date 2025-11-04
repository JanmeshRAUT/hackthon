import React, { useState } from "react";
import "../css/Login.css";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !role) {
      alert("Please enter your name and select a role!");
      return;
    }

    // Call parent App.js handler
    onLogin(role, name);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">MedTrust AI Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
