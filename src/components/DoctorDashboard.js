import React, { useState } from "react";
import TrustScoreMeter from "./TrustScoreMeter";
import EmergencyAccessModal from "./EmergencyAccessModal";
import "../css/Dashboard.css";

const DoctorDashboard = ({ user }) => {
  const [trustScore, setTrustScore] = useState(82);
  const [showModal, setShowModal] = useState(false);

  const requestAccess = (type) => {
    if (type === "normal") alert("Access Granted ✅");
    if (type === "restricted") alert("Access Restricted ❌ (Low Trust)");
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

        {/* Trust Meter */}
        <section className="trust-meter">
          <h2 className="trust-meter-title">Trust Score</h2>
          <TrustScoreMeter score={trustScore} />
        </section>

        {/* Access Requests */}
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

        {/* Emergency Section */}
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

        {/* Emergency Modal */}
        {showModal && <EmergencyAccessModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default DoctorDashboard;
