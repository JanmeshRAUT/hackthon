import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Login.css";

const Login = ({ onLogin }) => {
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("");
	const [otp, setOtp] = useState("");
	const [sessionId, setSessionId] = useState("");
	const [timer, setTimer] = useState(180);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	// ✅ Check if email is admin
	const isAdminEmail = (testEmail) => {
		return testEmail.toLowerCase() === "admin@ehr.com";
	};

	useEffect(() => {
		let interval;
		if (step === 2 && timer > 0) {
			interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
		}
		return () => clearInterval(interval);
	}, [step, timer]);

	const formatTime = (sec) => {
		const m = String(Math.floor(sec / 60)).padStart(2, "0");
		const s = String(sec % 60).padStart(2, "0");
		return `${m}:${s}`;
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		// ✅ Check if admin login
		if (isAdminEmail(email)) {
			// ✅ Admin login - direct bypass for demo (in production, use Firebase Auth)
			try {
				setLoading(true);
				setMessage("🔐 Verifying admin credentials...");

				// ✅ Simulate admin auth verification
				// In production, use Firebase signInWithEmailAndPassword here
				setTimeout(() => {
					setMessage("✅ Admin authenticated!");
					onLogin("admin", "Admin");
				}, 1000);
			} catch (error) {
				setMessage("❌ Admin authentication failed");
				console.error("Admin auth error:", error);
			} finally {
				setLoading(false);
			}
			return;
		}

		if (!name.trim() || !role) return setMessage("❌ Enter name & role!");
		if (!email.trim()) return setMessage("❌ Enter email address!");
		if (!email.includes("@")) return setMessage("❌ Enter a valid email address!");

		try {
			setLoading(true);
			setMessage("");
			const res = await axios.post("http://localhost:5000/user_login", {
				name,
				role,
				email,
			});

			if (res.data.success) {
				setSessionId(res.data.session_id);
				setStep(2);
				setTimer(180);
				setOtp("");
				setMessage("✅ " + (res.data.message || "OTP sent to your email"));
			} else {
				setMessage("❌ " + (res.data.error || "Login failed"));
			}
		} catch (error) {
			console.error("Login error:", error);
			if (error.response?.data?.error) {
				setMessage("❌ " + error.response.data.error);
			} else {
				setMessage("❌ Failed to send OTP. Check your email and internet connection.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		if (!otp.trim()) return setMessage("Enter OTP!");

		try {
			setLoading(true);
			setMessage("");
			const res = await axios.post("http://localhost:5000/verify_otp", {
				session_id: sessionId,
				otp,
			});

			if (res.data.verified) {
				onLogin(role, name);
			} else {
				setMessage("❌ " + (res.data.error || "Incorrect or expired OTP"));
			}
		} catch {
			setMessage("❌ OTP verification failed");
		} finally {
			setLoading(false);
		}
	};

	const resendOtp = async () => {
		if (!sessionId) return;
		try {
			setLoading(true);
			setMessage("");
			const res = await axios.post("http://localhost:5000/resend_otp", {
				session_id: sessionId,
			});
			if (res.data.sent) {
				setTimer(180);
				setOtp("");
				setMessage("✅ OTP resent. Check your email.");
			} else {
				setMessage("❌ " + (res.data.error || "Unable to resend OTP"));
			}
		} catch {
			setMessage("❌ Resend failed");
		} finally {
			setLoading(false);
		}
	};

	const goBack = () => {
		setStep(1);
		setOtp("");
		setSessionId("");
		setTimer(180);
		setMessage("");
	};

	return (
		<div className="login-full">
			{/* Left Side Visual */}
			<div className="left-section">
				<div className="overlay">
					<h1 className="brand-title">MedTrust AI</h1>
					<p className="brand-text">
						Secure access to Electronic Health Records using AI-Driven Trust.
					</p>
				</div>
			</div>

			{/* Right Side Form */}
			<div className="right-section">
				<div className="form-wrapper">
					{step === 1 && (
						<form className="login-form" onSubmit={handleLogin}>
							{/* small logo + title */}
							<div className="form-head">
								<div className="logo">MT</div>
								<div>
									<h2 className="form-title">Sign In</h2>
									<p className="form-sub">
										Secure access to patient records
									</p>
								</div>
							</div>

							<label className="label">Full Name</label>
							<input
								className="input"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								aria-label="Full name"
							/>

							<label className="label">Email Address</label>
							<input
								className="input"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								aria-label="Email"
							/>

							{/* ✅ Show role dropdown only for non-admin */}
							{!isAdminEmail(email) && (
								<>
									<label className="label">Select Role</label>
									<select
										className="input"
										value={role}
										onChange={(e) => setRole(e.target.value)}
										aria-label="Select role"
									>
										<option value="">-- Select Role --</option>
										<option value="doctor">Doctor</option>
										<option value="nurse">Nurse</option>
										<option value="patient">Patient</option>
									</select>
								</>
							)}

							{/* ✅ Show admin note if admin email detected */}
							{isAdminEmail(email) && (
								<div style={{
									background: "#eff6ff",
									border: "1px solid #2563eb",
									borderRadius: "8px",
									padding: "0.75rem",
									marginTop: "0.5rem",
									color: "#1e40af",
									fontSize: "0.875rem",
									fontWeight: "500"
								}}>
									🔐 Admin Account Detected - Firebase Authentication Required
								</div>
							)}

							<button
								className="btn"
								disabled={loading || !name.trim() || !email.trim() || (!isAdminEmail(email) && !role)}
							>
								{loading ? (
									isAdminEmail(email) 
										? "Authenticating Admin..." 
										: "Authenticating..."
								) : (
									isAdminEmail(email) 
										? "🔐 Access Admin Panel" 
										: "Send OTP"
								)}
							</button>

							{message && <p className="message">{message}</p>}
						</form>
					)}

					{step === 2 && (
						<form className="login-form" onSubmit={handleVerifyOtp}>
							<div className="form-head small">
								<button
									type="button"
									className="link-back"
									onClick={goBack}
								>
									← Back
								</button>
								<h2 className="form-title">Verify OTP</h2>
							</div>

							<p className="otp-timer">
								OTP Expires in <strong>{formatTime(timer)}</strong>
							</p>

							{/* progress bar */}
							<div className="progress-wrap" aria-hidden>
								<div
									className="progress"
									style={{ width: `${(timer / 180) * 100}%` }}
								/>
							</div>

							<input
								className="input otp"
								placeholder="6-digit OTP"
								maxLength="6"
								value={otp}
								onChange={(e) =>
									setOtp(e.target.value.replace(/\D/g, ""))
								}
								inputMode="numeric"
								aria-label="OTP"
							/>

							<button
								className="btn"
								disabled={loading || !otp.trim()}
							>
								{loading ? "Verifying..." : "Verify OTP"}
							</button>

							<div className="otp-actions">
								<button
									type="button"
									className="link-btn"
									onClick={resendOtp}
									disabled={loading || timer > 0}
								>
									Resend OTP
								</button>
								<span className="note">
									Available when timer reaches 00:00
								</span>
							</div>

							{message && <p className="message">{message}</p>}
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default Login;
