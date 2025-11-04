import React, { useState, useEffect } from "react";
import TrustScoreMeter from "./TrustScoreMeter";
import EmergencyAccessModal from "./EmergencyAccessModal";
import "../css/Doctor.css";
import axios from "axios";

const DoctorDashboard = ({ user }) => {
  const [trustScore, setTrustScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Fetch dynamic trust score
  const fetchTrustScore = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/trust_score/${user.name}`);
      const score = response.data.trust_score ?? 0;
      setTrustScore(score);
    } catch (error) {
      console.error("Error fetching trust score:", error);
      setTrustScore(0);
    }
  };

  // Auto-refresh trust score
  useEffect(() => {
    fetchTrustScore();
    const interval = setInterval(fetchTrustScore, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔐 Access request logic
  const requestAccess = async (type, justification = "") => {
    try {
      let endpoint = "";
      if (type === "normal") endpoint = "normal_access";
      else if (type === "restricted") endpoint = "restricted_access";
      else if (type === "emergency") endpoint = "emergency_access";

      const response = await axios.post(`http://localhost:5000/${endpoint}`, {
        name: user.name,
        role: user.role,
        justification,
      });

      alert(response.data.message);
      fetchTrustScore();
    } catch (error) {
      alert(error.response?.data?.message || "❌ Access request failed. Check backend logs.");
    }
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

        {/* Trust Score */}
        <section className="trust-meter">
          <h2 className="trust-meter-title">Trust Score</h2>
          <TrustScoreMeter score={trustScore} />
          <button className="btn btn-blue" onClick={fetchTrustScore}>
            🔄 Refresh Trust Score
          </button>
        </section>

        {/* Access Request Section */}
        <section className="access-requests-section">
          <h2 className="access-requests-title">Access Requests</h2>
          <div className="access-grid">
            {/* Normal Access */}
            <div className="access-card access-card-green">
              <h3>Normal Access</h3>
              <p>Access within hospital network (secure zone).</p>
              <button
                onClick={() => requestAccess("normal")}
                className="btn btn-green"
              >
                Request Normal Access
              </button>
            </div>

            {/* Restricted Access */}
            <div className="access-card access-card-blue">
              <h3>Restricted Access</h3>
              <p>Access for study or review outside secure network.</p>
              <button
                onClick={() => requestAccess("restricted")}
                className="btn btn-blue"
              >
                Request Restricted Access
              </button>
            </div>
          </div>
        </section>

        {/* Emergency Access */}
        <section className="emergency-section">
          <h2 className="emergency-title">Emergency Access Protocol</h2>
          <div className="emergency-card">
            <p>
              Emergency access overrides restrictions during critical conditions.
              This action is logged and analyzed by AI for justification validity.
            </p>
            <button
              className="btn btn-emergency"
              onClick={() => setShowModal(true)}
            >
              🚨 Break Glass Access
            </button>
          </div>
        </section>

        {/* Emergency Modal */}
        {showModal && (
          <EmergencyAccessModal
            onClose={() => setShowModal(false)}
            onAccessGranted={(justification) => {
              requestAccess("emergency", justification);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
