import React from "react";

const PatientDashboard = ({ user }) => {
  const accessLogs = [
    { doctor: "Dr. John Smith", reason: "Routine checkup", time: "10:30 AM" },
    { doctor: "Dr. Emily Brown", reason: "Emergency allergy info", time: "3:45 PM" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Welcome, {user.name}
      </h1>
      <p className="mb-4 text-gray-600">Role: {user.role}</p>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Data Access History
        </h2>
        {accessLogs.map((log, index) => (
          <div
            key={index}
            className="border-b border-gray-200 py-3 flex justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">{log.doctor}</p>
              <p className="text-sm text-gray-500">{log.reason}</p>
            </div>
            <p className="text-gray-500">{log.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
