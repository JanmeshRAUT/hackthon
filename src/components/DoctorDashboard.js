import React, { useState } from "react";
import TrustScoreMeter from "./TrustScoreMeter";
import EmergencyAccessModal from "./EmergencyAccessModal";

const DoctorDashboard = ({ user }) => {
  const [trustScore, setTrustScore] = useState(82);
  const [showModal, setShowModal] = useState(false);

  const requestAccess = (type) => {
    if (type === "normal") alert("Access Granted ✅");
    if (type === "restricted") alert("Access Restricted ❌ (Low Trust)");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Welcome, Dr. {user.name}
      </h1>
      <p className="mb-4 text-gray-600">Role: {user.role}</p>

      <TrustScoreMeter score={trustScore} />

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => requestAccess("normal")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Request Normal Access
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Emergency Access (Break Glass)
        </button>
      </div>

      {showModal && (
        <EmergencyAccessModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default DoctorDashboard;
