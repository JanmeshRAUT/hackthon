import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrustScoreMeter from "./TrustScoreMeter";
import {
  FaHospitalUser,
  FaUserMd,
  FaUserInjured,
  FaClipboardList,
  FaSignOutAlt,
  FaLock,
  FaExclamationTriangle,
  FaGlobeAsia,
  FaClock,
  FaListAlt,
} from "react-icons/fa";
import "../css/Doctor.css";

const DoctorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [trustScore, setTrustScore] = useState(0);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [justification, setJustification] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [logs, setLogs] = useState([]);

  // ✅ Fetch IP
  const fetchIP = useCallback(async () => {
    try {
      const res = await axios.get("https://api.ipify.org?format=json");
      setIpAddress(res.data.ip);
    } catch (error) {
      console.error("Failed to fetch IP:", error);
      setIpAddress("Unavailable");
    }
  }, []);

  // ✅ Fetch Trust Score
  const fetchTrustScore = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/trust_score/${user.name}`);
      setTrustScore(res.data.trust_score || 0);
    } catch (err) {
      console.error("Error fetching trust score:", err);
    }
  }, [user.name]);

  // ✅ Fetch Patients
  const fetchPatients = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/patients");
      if (res.data.success) setPatients(res.data.patients);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  }, []);

  // ✅ Fetch Access Logs
  const fetchAccessLogs = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/access_logs/${user.name}`);
      if (res.data.success) setLogs(res.data.logs);
    } catch (err) {
      console.error("Error fetching access logs:", err);
    }
  }, [user.name]);

  // ✅ Log login access
  const logLoginAccess = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        role: user.role,
        patient_name: "N/A",
        action: "LOGIN",
        justification: "User logged into system",
        status: "Success",
      });
      setLastLogin(new Date().toLocaleString());
      fetchAccessLogs(); // refresh logs immediately
    } catch (error) {
      console.error("Error logging login access:", error);
    }
  }, [user.name, user.role, fetchAccessLogs]);

  // ✅ Lifecycle setup
  useEffect(() => {
    fetchTrustScore();
    fetchPatients();
    fetchIP();
    logLoginAccess();
    fetchAccessLogs();
    const interval = setInterval(fetchTrustScore, 10000);
    return () => clearInterval(interval);
  }, [fetchTrustScore, fetchPatients, fetchIP, logLoginAccess, fetchAccessLogs]);

  // ✅ Handle Access Requests
  const handleAccessRequest = async (type) => {
    if (!selectedPatient) {
      alert("⚠️ Please select a patient first!");
      return;
    }

    let reason = justification.trim();
    if (type !== "normal" && !reason) {
      reason = prompt(`Enter ${type} access justification:`);
      if (!reason) return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/${type}_access`, {
        name: user.name,
        role: user.role,
        patient_name: selectedPatient,
        justification: reason,
      });

      alert(res.data.message);

      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        role: user.role,
        patient_name: selectedPatient,
        action: `${type.toUpperCase()} Access`,
        justification: reason,
        status: res.data.success ? "Granted" : "Denied",
      });

      fetchTrustScore();
      fetchAccessLogs();
    } catch (error) {
      console.error("Access request error:", error);
      alert(error.response?.data?.message || "❌ Access request failed.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
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
            <li className="active"><FaUserMd /> Dashboard</li>
            <li><FaUserInjured /> Patients</li>
            <li><FaClipboardList /> Access Logs</li>
            <li><FaLock /> Permissions</li>
            <li><FaExclamationTriangle /> Alerts</li>
          </ul>
        </nav>

        <div className="ehr-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ehr-main">
        {/* Header */}
        <header className="ehr-header">
          <div className="header-left">
            <h1>Welcome, Dr. {user.name}</h1>
            <p className="user-role">Role: {user.role}</p>
          </div>

          <div className="header-right">
            <div className="ip-display">
              <FaGlobeAsia className="icon" /> <span>{ipAddress}</span>
            </div>
            <div className="last-login">
              <FaClock className="icon" />{" "}
              <span>Last Login: {lastLogin || "Loading..."}</span>
            </div>
            <div className="session-indicator">Secure Session ✅</div>
          </div>
        </header>

        {/* Trust Score */}
        <section className="ehr-section">
          <h2>Trust Score Overview</h2>
          <div className="trust-section">
            <TrustScoreMeter score={trustScore} />
            <button className="btn btn-blue" onClick={fetchTrustScore}>
              🔄 Refresh Trust Score
            </button>
          </div>
        </section>

        {/* Patient Selection */}
        <section className="ehr-section">
          <h2>Patient Selection</h2>
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

        {/* Access Controls */}
        <section className="ehr-section">
          <h2>Access Patient Data</h2>
          <div className="ehr-access-grid">
            <div className="ehr-access-card green">
              <h3>Normal Access</h3>
              <p>Standard access within hospital network.</p>
              <button className="btn btn-green" onClick={() => handleAccessRequest("normal")}>
                Request Normal Access
              </button>
            </div>

            <div className="ehr-access-card blue">
              <h3>Restricted Access</h3>
              <p>For off-network or research purposes.</p>
              <button className="btn btn-blue" onClick={() => handleAccessRequest("restricted")}>
                Request Restricted Access
              </button>
            </div>

            <div className="ehr-access-card red">
              <h3>Emergency Access</h3>
              <p>Used only during critical emergencies.</p>
              <button className="btn btn-emergency" onClick={() => handleAccessRequest("emergency")}>
                🚨 Break Glass Access
              </button>
            </div>
          </div>
        </section>

        {/* ✅ Access Logs Section */}
        <section className="ehr-section">
          <h2><FaListAlt /> Access Logs</h2>
          <div className="log-table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Patient</th>
                  <th>Justification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.timestamp}</td>
                      <td>{log.action}</td>
                      <td>{log.patient_name}</td>
                      <td>{log.justification || "—"}</td>
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
                    <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                      No access logs available yet.
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

export default DoctorDashboard;
