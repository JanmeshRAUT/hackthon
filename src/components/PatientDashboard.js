import React, { useEffect, useState } from "react";
import "../css/PatientDashboard.css";

const PatientDashboard = ({ user }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const accessLogs = [
    { doctor: "Dr. John Smith", reason: "Routine checkup", time: "10:30 AM" },
    { doctor: "Dr. Emily Brown", reason: "Emergency allergy info", time: "3:45 PM" },
  ];

  return (
    <div className={`patient-dashboard ${fadeIn ? "fade-in" : ""}`}>
      <h1 className="patient-title">
        Welcome, <span className="patient-name">{user.name}</span>
      </h1>
      <p className="patient-role">Role: {user.role}</p>

      <div className="access-card">
        <h2 className="access-header">Data Access History</h2>
        <div className="access-list">
          {accessLogs.map((log, index) => (
            <div key={index} className="access-item">
              <div>
                <p className="access-doctor">{log.doctor}</p>
                <p className="access-reason">{log.reason}</p>
              </div>
              <p className="access-time">{log.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
