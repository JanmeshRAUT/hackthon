import React, { useEffect, useState } from "react";
import "../css/NurseDashboard.css";

const NurseDashboard = ({ user }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Sample access logs (can later be fetched from backend)
  const accessLogs = [
    { patient: "Alice Johnson", reason: "Vitals monitoring", time: "9:15 AM" },
    { patient: "Robert White", reason: "Medication update", time: "11:00 AM" },
    { patient: "Sophia Miller", reason: "Post-surgery check", time: "2:40 PM" },
  ];

  const handleRequestAccess = () => {
    alert("🔒 Access request sent to supervising doctor for approval!");
  };

  return (
    <div className={`nurse-dashboard ${fadeIn ? "fade-in" : ""}`}>
      <h1 className="nurse-title">
        Welcome, <span className="nurse-name">{user.name}</span>
      </h1>
      <p className="nurse-role">Role: {user.role}</p>

      <div className="nurse-card">
        <h2 className="nurse-header">Patient Access History</h2>
        <div className="nurse-list">
          {accessLogs.map((log, index) => (
            <div key={index} className="nurse-item">
              <div>
                <p className="nurse-patient">{log.patient}</p>
                <p className="nurse-reason">{log.reason}</p>
              </div>
              <p className="nurse-time">{log.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="nurse-actions">
        <button className="nurse-btn" onClick={handleRequestAccess}>
          Request Temporary Access
        </button>
      </div>
    </div>
  );
};

export default NurseDashboard;
