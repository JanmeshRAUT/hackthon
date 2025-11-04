import React, { useState } from "react";
import Login from "./components/Login";
import DoctorDashboard from "./components/DoctorDashboard";
import NurseDashboard from "./components/NurseDashboard";
import PatientDashboard from "./components/PatientDashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, name) => {
    setUser({ role, name });
  };

  const handleLogout = () => setUser(null);

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <>
      {user.role === "doctor" && <DoctorDashboard user={user} onLogout={handleLogout} />}
      {user.role === "nurse" && <NurseDashboard user={user} onLogout={handleLogout} />}
      {user.role === "patient" && <PatientDashboard user={user} onLogout={handleLogout} />}
    </>
  );
}

export default App;
