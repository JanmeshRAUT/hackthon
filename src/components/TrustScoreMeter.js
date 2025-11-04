import React, { useState, useEffect } from "react";

const TrustScoreMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= score) {
        clearInterval(interval);
        current = score;
      }
      setAnimatedScore(current);
    }, 15);
    return () => clearInterval(interval);
  }, [score]);

  const getStrokeColor = () => {
    if (animatedScore > 80) return "#10b981"; // Green
    if (animatedScore > 50) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="trust-meter">
      <h2 className="trust-meter-title">Trust Score Overview</h2>
      <div className="trust-meter-content">
        <div className="meter-svg-wrapper">
          <svg className="meter-svg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              className="meter-progress"
              cx="50"
              cy="50"
              r="45"
              stroke={getStrokeColor()}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div
            className="meter-score-text"
            style={{ color: getStrokeColor() }}
          >
            {animatedScore}
          </div>
        </div>

        <div className="meter-info">
          <div className="meter-status-box" style={{ color: getStrokeColor() }}>
            {animatedScore > 80
              ? "✅ Secure — Fully Trusted Access"
              : animatedScore > 50
              ? "⚠️ Moderate Trust — Monitor Behavior"
              : "❌ Low Trust — Restricted Access"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreMeter;
