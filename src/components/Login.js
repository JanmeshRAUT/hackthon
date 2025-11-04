import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("doctor");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(role, name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">
          MedTrust AI Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full border rounded-lg p-2 mb-4"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="w-full border rounded-lg p-2 mb-6"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
