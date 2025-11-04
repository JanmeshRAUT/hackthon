import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DoctorDashboard from "./components/DoctorDashboard";
import NurseDashboard from "./components/NurseDashboard";
import PatientDashboard from "./components/PatientDashboard";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, name) => setUser({ role, name });
  const handleLogout = () => setUser(null);

  return (
      <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : user.role === "doctor" ? (
              <DoctorDashboard user={user} onLogout={handleLogout} />
            ) : user.role === "nurse" ? (
              <NurseDashboard user={user} onLogout={handleLogout} />
            ) : (
              <PatientDashboard user={user} onLogout={handleLogout} />
            )
          }
        />

        <Route path="/admin" element={<AdminLogin />} />
        
      </Routes>
    </Router>
  );
}

export default App;
