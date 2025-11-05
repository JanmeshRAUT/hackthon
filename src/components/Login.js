import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Login.css";

const Login = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1 = login, 2 = 2FA
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [timer, setTimer] = useState(180);
  const [isResending, setIsResending] = useState(false);

  // Countdown Timer for OTP Expiry
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Format seconds → mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Step 1: Request OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !role) {
      alert("Please enter your name and select a role!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/user_login", {
        name,
        role,
      });

      if (res.data.success) {
        setSessionId(res.data.session_id);
        setStep(2);
        setTimer(180);
        alert("✅ OTP sent! Check your email or phone.");
      } else {
        alert("❌ Invalid credentials or user not found!");
      }
    } catch {
      alert("❌ Server error during login.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return alert("Enter the OTP!");
    try {
      const res = await axios.post("http://localhost:5000/verify_otp", {
        session_id: sessionId,
        otp,
      });
      if (res.data.verified) {
        alert(`✅ Welcome, ${name}!`);
        onLogin(role, name);
      } else {
        alert("❌ Invalid or expired OTP.");
      }
    } catch {
      alert("❌ Error verifying OTP.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResending || timer > 0) return;
    setIsResending(true);
    try {
      const res = await axios.post("http://localhost:5000/user_login", {
        name,
        role,
      });
      if (res.data.success) {
        setSessionId(res.data.session_id);
        setTimer(180);
        alert("🔄 OTP resent successfully!");
      }
    } catch {
      alert("❌ Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Section: Branding */}
      <div className="login-left">
        <div className="overlay">
          <h1 className="brand-title">MedTrust AI</h1>
          <p className="brand-subtitle">
            Empowering Healthcare with Intelligence and Security.
          </p>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">
            {step === 1 ? "Sign In" : "Two-Factor Verification"}
          </h2>
          <p className="login-subtext">
            {step === 1
              ? "Secure access to your MedTrust AI account."
              : "Enter the 6-digit code sent to your registered device."}
          </p>

          {step === 1 && (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">-- Select Role --</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              <button type="submit" className="submit-button">
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  className="form-input otp-input"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                />
              </div>

              <button type="submit" className="submit-button">
                Verify OTP
              </button>

              <div className="otp-info">
                <p>
                  ⏱️ OTP expires in{" "}
                  <span className="timer">{formatTime(timer)}</span>
                </p>

                <button
                  type="button"
                  className="resend-button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || isResending}
                >
                  {isResending
                    ? "Resending..."
                    : timer > 0
                    ? "Resend Disabled"
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
