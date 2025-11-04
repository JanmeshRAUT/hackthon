import React, { useState } from "react";

const EmergencyAccessModal = ({ onClose }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim().length < 5) {
      alert("Please provide a valid justification.");
      return;
    }
    alert("Access Granted for Emergency 🚑 (AI Approved)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Emergency Access Justification
        </h2>
        <textarea
          className="w-full border p-2 rounded-lg mb-4"
          rows={4}
          placeholder="Explain reason for emergency access..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccessModal;
