import React, { useState } from "react";
import Login from "./components/Login";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, name) => {
    setUser({ role, name });
  };

  if (!user) return <Login onLogin={handleLogin} />;

  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "patient") return <PatientDashboard user={user} />;
}

export default App;