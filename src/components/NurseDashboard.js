import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrustScoreMeter from "./TrustScoreMeter";
import {
  FaUserNurse,
  FaHospitalUser,
  FaClipboardList,
  FaSignOutAlt,
  FaUserInjured,
  FaGlobeAsia,
  FaClock,
  FaKey,
  FaShieldAlt,
} from "react-icons/fa";
import "../css/NurseDashboard.css";

const NurseDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // ✅ ALL HOOKS MUST BE AT THE TOP
  const [trustScore, setTrustScore] = useState(0);
  const [ipAddress, setIpAddress] = useState("");
  const [isInsideNetwork, setIsInsideNetwork] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [logs, setLogs] = useState([]);
  const [lastLogin, setLastLogin] = useState("");

  // ✅ Fetch Trust Score
  const fetchTrustScore = useCallback(async () => {
    if (!user?.name) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/trust_score/${user.name}`
      );
      setTrustScore(res.data.trust_score || 0);
    } catch (err) {
      console.error("Error fetching trust score:", err);
    }
  }, [user?.name]);

  // ✅ Fetch IP + Network info
  const fetchIPAndNetwork = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/ip_check");
      setIpAddress(res.data.ip);
      setIsInsideNetwork(res.data.inside_network);
    } catch (err) {
      console.error("Error fetching network:", err);
      setIsInsideNetwork(false);
    }
  }, []);

  // ✅ Fetch Patients
  const fetchPatients = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/patients");
      if (res.data.success) setPatients(res.data.patients);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  }, []);

  // ✅ Fetch Nurse Access Logs
  const fetchAccessLogs = useCallback(async () => {
    if (!user?.name) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/access_logs/${user.name}`
      );
      if (res.data.success) setLogs(res.data.logs);
    } catch (err) {
      console.error("Error fetching access logs:", err);
    }
  }, [user?.name]);

  // ✅ Log Nurse Login
  const logLoginAccess = useCallback(async () => {
    if (!user?.name || !user?.role) return;
    try {
      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        role: user.role,
        patient_name: "N/A",
        action: "LOGIN",
        status: "Success",
      });
      setLastLogin(new Date().toLocaleString());
      fetchAccessLogs();
    } catch (error) {
      console.error("Error logging nurse login:", error);
    }
  }, [user?.name, user?.role, fetchAccessLogs]);

  // ✅ Lifecycle setup
  useEffect(() => {
    if (!user?.name) return;

    fetchTrustScore();
    fetchIPAndNetwork();
    fetchPatients();
    logLoginAccess();
    fetchAccessLogs();

    const interval = setInterval(fetchTrustScore, 10000);
    return () => clearInterval(interval);
  }, [
    user?.name,
    fetchTrustScore,
    fetchIPAndNetwork,
    fetchPatients,
    logLoginAccess,
    fetchAccessLogs,
  ]);

  // ✅ NOW check user AFTER all hooks
  if (!user || !user.name) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#ef4444" }}>
          ❌ Session expired or invalid user data
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  // ✅ Handle Temporary Access Request (Time-based, no justification)
  const handleAccessRequest = async () => {
    if (!selectedPatient) {
      alert("⚠️ Please select a patient first!");
      return;
    }

    if (!isInsideNetwork) {
      alert(
        "❌ Temporary Access can only be requested inside the hospital network!"
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/request_temp_access", {
        name: user.name,
        role: user.role,
        patient_name: selectedPatient,
      });

      alert(res.data.message);
      fetchAccessLogs();
    } catch (error) {
      console.error("Access request error:", error);
      alert("❌ Failed to request temporary access.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="ehr-layout">
      {/* Sidebar */}
      <aside className="ehr-sidebar">
        <div className="ehr-sidebar-header">
          <FaHospitalUser className="ehr-logo" />
          <h2>MedTrust EHR</h2>
        </div>

        <nav>
          <ul>
            <li className="active">
              <FaUserNurse /> Dashboard
            </li>
            <li>
              <FaUserInjured /> Patients
            </li>
            <li>
              <FaClipboardList /> Access Logs
            </li>
            <li>
              <FaShieldAlt /> Approvals
            </li>
          </ul>
        </nav>

        <div className="ehr-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="ehr-main">
        {/* Header */}
        <header className="ehr-header">
          <div className="header-left">
            <h1>Welcome, Nurse {user.name}</h1>
            <p className="user-role">Role: {user.role}</p>
          </div>

          <div className="header-right">
            <div className="ip-display">
              <FaGlobeAsia className="icon" /> {ipAddress}
            </div>
            <div className="last-login">
              <FaClock className="icon" /> Last Login:{" "}
              {lastLogin || "Loading..."}
            </div>
            <div className="session-indicator">
              {isInsideNetwork
                ? "🏥 In Hospital Network"
                : "🌐 Outside Network"}
            </div>
          </div>
        </header>

        {/* Trust Score */}
        <section className="ehr-section">
          <h2>Trust Score</h2>
          <TrustScoreMeter score={trustScore} />
        </section>

        {/* Patient Selection */}
        <section className="ehr-section">
          <h2>Select Patient</h2>
          <select
            className="patient-dropdown"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p, idx) => (
              <option key={idx} value={p.name}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </section>

        {/* Temporary Access */}
        <section className="ehr-section">
          <h2>Temporary Access Request</h2>
          <div
            className={`nurse-access-card ${
              !isInsideNetwork ? "disabled-card" : ""
            }`}
          >
            <p>
              Request short-term patient data access (valid for 30 minutes).
              {!isInsideNetwork && (
                <span
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Disabled outside hospital network
                </span>
              )}
            </p>
            <button
              className="btn btn-green"
              onClick={handleAccessRequest}
              disabled={!isInsideNetwork}
            >
              <FaKey /> Request Temporary Access
            </button>
          </div>
        </section>

        {/* Access Logs */}
        <section className="ehr-section">
          <h2>
            <FaClipboardList /> Access History
          </h2>
          <div className="log-table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Patient</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.timestamp}</td>
                      <td>{log.patient_name}</td>
                      <td>{log.action}</td>
                      <td
                        className={
                          log.status === "Granted"
                            ? "status-granted"
                            : log.status === "Denied"
                            ? "status-denied"
                            : "status-info"
                        }
                      >
                        {log.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No access logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NurseDashboard;
