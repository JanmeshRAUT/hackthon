import React, { useState, useEffect } from "react";
import "../css/TrustScore.css";

const TrustScoreMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate the score smoothly
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(score / 50)); // speed control
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 15);
    return () => clearInterval(interval);
  }, [score]);

  const getColorClass = () => {
    if (animatedScore > 80) return "trust-bar-green";
    if (animatedScore > 50) return "trust-bar-yellow";
    return "trust-bar-red";
  };

  return (
    <div className="trust-meter-container">
      <div className="trust-meter-bg">
        <div
          className={`trust-meter-bar ${getColorClass()}`}
          style={{ width: `${animatedScore}%` }}
        ></div>
      </div>
      <p className="trust-score-text">
        Current Trust Score:{" "}
        <span className="trust-score-value">{animatedScore}</span> / 100
      </p>
    </div>
  );
};

export default TrustScoreMeter;
