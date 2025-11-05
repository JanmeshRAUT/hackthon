import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/PatientDashboard.css";
import {
  FaUserMd,
  FaClock,
  FaNotesMedical,
  FaFileAlt,
  FaArrowLeft,
} from "react-icons/fa";

const PatientDashboard = ({ user, onBack }) => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/patient_access_logs/${user.name}`
      );
      if (res.data.success) setLogs(res.data.logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Optional fallback if no prop is passed
  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="patient-dashboard">
      <header className="patient-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft className="back-icon" />
          Back
        </button>
        <h1 className="welcome-text">Welcome, {user.name}</h1>
        <p className="subtext">Your secure health data access history</p>
      </header>

      <section className="logs-section">
        <h2 className="section-title">Access Logs</h2>

        <div className="access-log-container">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} className="access-log-card">
                <div className="log-header">
                  <FaUserMd className="log-icon" />
                  <h3 className="log-title">{log.doctor_name}</h3>
                </div>

                <div className="log-body">
                  <p>
                    <FaFileAlt className="log-detail-icon" />
                    <strong>Access Type:</strong> {log.access_type}
                  </p>
                  <p>
                    <FaNotesMedical className="log-detail-icon" />
                    <strong>Reason:</strong> {log.justification || "—"}
                  </p>
                  <p>
                    <FaClock className="log-detail-icon" />
                    <strong>Time:</strong> {log.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-logs">
              <p>No access logs available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
