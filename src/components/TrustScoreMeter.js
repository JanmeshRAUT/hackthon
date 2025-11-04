import React from "react";

const TrustScoreMeter = ({ score }) => {
  const getColor = () => {
    if (score > 80) return "bg-green-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mt-4">
      <div
        className={`${getColor()} h-6 rounded-full transition-all`}
        style={{ width: `${score}%` }}
      ></div>
      <p className="mt-2 text-gray-700 font-medium">
        Current Trust Score: {score} / 100
      </p>
    </div>
  );
};

export default TrustScoreMeter;
