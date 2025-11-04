import React, { useState } from "react";
import TrustScoreMeter from "./TrustScoreMeter";
import EmergencyAccessModal from "./EmergencyAccessModal";
import "../css/Doctor.css";
import axios from "axios"; 

const DoctorDashboard = ({ user }) => {
  const [trustScore, setTrustScore] = useState(82);
  const [showModal, setShowModal] = useState(false);


  const fetchTrustScore = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/trust_score/${user.name}`);
      setTrustScore(response.data.trust_score);
    } catch (error) {
      console.error("Error fetching trust score:", error);
    }
  };

  const requestAccess = async (type) => {
    if (type === "normal") {
      alert("Access Granted ✅");
      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        role: user.role,
        action: "Normal Access Granted",
      });
    }

    if (type === "restricted") {
      alert("Access Restricted ❌ (Low Trust)");
      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        role: user.role,
        action: "Restricted Access Attempted",
      });
    }

    fetchTrustScore();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome, <span className="user-name">Dr. {user.name}</span>
          </h1>
          <p className="dashboard-subtitle">Role: {user.role}</p>
        </header>


        <section className="trust-meter">
          <h2 className="trust-meter-title">Trust Score</h2>
          <TrustScoreMeter score={trustScore} />
          <button className="btn btn-refresh" onClick={fetchTrustScore}>
            Refresh Trust Score
          </button>
        </section>


        <section className="access-requests-section">
          <h2 className="access-requests-title">Access Requests</h2>
          <div className="access-grid">
            <div className="access-card access-card-green">
              <h3>Normal Access</h3>
              <p>Standard access for authorized patient data retrieval.</p>
              <button
                onClick={() => requestAccess("normal")}
                className="btn btn-green"
              >
                Request Normal Access
              </button>
            </div>

            <div className="access-card access-card-blue">
              <h3>Restricted Access</h3>
              <p>Confidential or emergency-level information (requires trust).</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-blue"
              >
                Emergency Access (Break Glass)
              </button>
            </div>
          </div>
        </section>

        <section className="emergency-section">
          <h2 className="emergency-title">Emergency Access Protocol</h2>
          <div className="emergency-card">
            <p>
              Emergency access allows doctors to override normal access
              restrictions in life-threatening scenarios. All activity is logged
              and audited.
            </p>
            <button
              className="btn btn-emergency"
              onClick={() => setShowModal(true)}
            >
              Break Glass Access
            </button>
          </div>
        </section>
        
        {showModal && (
          <EmergencyAccessModal
            onClose={() => setShowModal(false)}
            onAccessGranted={() => {
              requestAccess("restricted");
              setShowModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
