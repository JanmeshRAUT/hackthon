import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; // ✅ Import Firebase Auth
import "../css/Login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔹 Step 1: Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 🔹 Step 2: Send token to Flask backend for verification
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔹 Step 3: If backend verifies token, store locally
      if (response.data.success) {
        localStorage.setItem("adminToken", token);
        alert("✅ Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        alert("❌ Unauthorized: Not an admin user");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
          "❌ Invalid credentials or Firebase setup issue"
      );
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
