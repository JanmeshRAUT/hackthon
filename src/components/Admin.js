import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("doctor");

  const handleAssignRole = async () => {
    try {
      await axios.post("http://localhost:5000/assign_role", {
        name,
        email,
        role,
      });
      alert(`Role '${role}' assigned to ${name}`);
      setName("");
      setEmail("");
    } catch (error) {
      alert("Error assigning role");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Admin Dashboard</h1>

      <div className="bg-white rounded-xl shadow-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Assign Role to User</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded mb-3 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="border p-2 rounded mb-3 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>

        <button
          onClick={handleAssignRole}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign Role
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
