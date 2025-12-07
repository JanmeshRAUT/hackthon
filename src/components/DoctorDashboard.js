import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrustScoreMeter from "./TrustScoreMeter";
import PatientFormModal from "./PatientFormModal";
import {
  FaHospitalUser,
  FaUserMd,
  FaUserInjured,
  FaClipboardList,
  FaSignOutAlt,
  FaLock,
  FaExclamationTriangle,
  FaGlobeAsia,
  FaClock,
  FaListAlt,
  FaFilePdf,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaSync,
  FaPlus,
} from "react-icons/fa";
import "../css/Doctor.css";
import "../css/UserManagement.css";

const DoctorDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // ✅ ALL HOOKS MUST BE AT THE TOP
  const [activeTab, setActiveTab] = useState("dashboard");
  const [trustScore, setTrustScore] = useState(0);
  const [allPatients, setAllPatients] = useState([]);  // ✅ All patients from admin
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedPatientData, setSelectedPatientData] = useState(null);  // ✅ Patient details
  const [justification, setJustification] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [isInsideNetwork, setIsInsideNetwork] = useState(false);
  const [lastLogin, setLastLogin] = useState("");
  const [logs, setLogs] = useState([]);
  const [accessResponse, setAccessResponse] = useState(null);
  const [myPatients, setMyPatients] = useState([]);
  
  // ✅ Record editing state
  const [recordForm, setRecordForm] = useState({
    diagnosis: "",
    treatment: "",
    notes: "",
  });
  const [recordLoading, setRecordLoading] = useState(false);

  // ✅ New: Enhanced loading and error states
  const [loading, setLoading] = useState({
    trust: false,
    patients: false,
    logs: false,  
    access: false,
    myPatients: false,
  });
  const [error, setError] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);  // ✅ ADD THIS
  const [currentAccessType, setCurrentAccessType] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // ✅ Toast notification helper
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // ✅ Fetch IP and Network
  const fetchIPAndNetwork = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/ip_check");
      setIpAddress(res.data.ip);
      setIsInsideNetwork(res.data.inside_network);
    } catch (error) {
      console.error("Failed to fetch IP/network:", error);
      setIpAddress("Unavailable");
      setIsInsideNetwork(false);
    }
  }, []);

  // ✅ Improved Fetch Trust Score with loading state
  const fetchTrustScore = useCallback(async () => {
    if (!user?.name) return;
    try {
      setLoading((prev) => ({ ...prev, trust: true }));
      const res = await axios.get(
        `http://localhost:5000/trust_score/${user.name}`
      );
      setTrustScore(res.data.trust_score || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching trust score:", err);
      setError("Failed to load trust score");
    } finally {
      setLoading((prev) => ({ ...prev, trust: false }));
    }
  }, [user?.name]);

  // ✅ Fetch ALL patients (created by admin)
  const fetchAllPatients = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, patients: true }));
      const res = await axios.get("http://localhost:5000/all_patients");
      if (res.data.success) {
        setAllPatients(res.data.patients || []);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients");
    } finally {
      setLoading((prev) => ({ ...prev, patients: false }));
    }
  }, []);

  // ✅ Improved Fetch Access Logs - Uses new DoctorAccessLog collection
  const fetchAccessLogs = useCallback(async () => {
    if (!user?.name) return;
    try {
      setLoading((prev) => ({ ...prev, logs: true }));
      // ✅ NEW: Use dedicated DoctorAccessLog endpoint
      const res = await axios.get(
        `http://localhost:5000/doctor_access_logs/${user.name}`
      );
      if (res.data.success) {
        setLogs(res.data.logs || []);
        console.log(`✅ Fetched ${res.data.logs?.length || 0} access logs from DoctorAccessLog`);
      }
    } catch (err) {
      console.error("Error fetching access logs:", err);
      setLogs([]);
    } finally {
      setLoading((prev) => ({ ...prev, logs: false }));
    }
  }, [user?.name]);

  // ✅ Log Login Access
  const logLoginAccess = useCallback(async () => {
    if (!user?.name || !user?.role) return;
    try {
      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        doctor_name: user.name,
        role: user.role,
        doctor_role: user.role,
        patient_name: "N/A",
        action: "LOGIN",
        justification: "User logged into system",
        status: "Success",
      });
      setLastLogin(new Date().toLocaleString());
    } catch (error) {
      console.error("Error logging login access:", error);
    }
  }, [user?.name, user?.role]);

  // ✅ NEW: Fetch patients diagnosed by this doctor
  const fetchMyPatients = useCallback(async () => {
    if (!user?.name) return;
    try {
      setLoading((prev) => ({ ...prev, myPatients: true }));
      const res = await axios.get(
        `http://localhost:5000/doctor_patients/${user.name}`
      );
      if (res.data.success) {
        setMyPatients(res.data.patients || []);
        console.log(`✅ Fetched ${res.data.patients?.length || 0} diagnosed patients`);
      }
    } catch (err) {
      console.error("Error fetching my patients:", err);
      setMyPatients([]);
    } finally {
      setLoading((prev) => ({ ...prev, myPatients: false }));
    }
  }, [user?.name]);

  // ✅ Lifecycle Setup
  useEffect(() => {
    if (!user?.name) return;

    fetchTrustScore();
    fetchAllPatients();  // ✅ Changed from fetchPatients
    fetchIPAndNetwork();
    logLoginAccess();
    fetchAccessLogs();
    fetchMyPatients();

    const interval = setInterval(fetchTrustScore, 10000);
    return () => clearInterval(interval);
  }, [
    user?.name,
    fetchTrustScore,
    fetchAllPatients,  // ✅ Changed
    fetchIPAndNetwork,
    logLoginAccess,
    fetchAccessLogs,
    fetchMyPatients,
  ]);

  // ✅ NOW do the safety check AFTER all hooks
  if (!user || !user.name) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#ef4444" }}>
          ❌ Session expired or invalid user data
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  // ✅ Enhanced Access Request Handler
  const handleAccessRequest = async (type) => {
    if (!selectedPatient) {
      showToast("⚠️ Please select a patient first!", "warning");
      return;
    }

    // Validate justification for outside network access
    if (!isInsideNetwork && type !== "normal" && !justification.trim()) {
      setCurrentAccessType(type);
      setShowJustificationModal(true);
      return;
    }

    await performAccessRequest(type, justification.trim());
  };

  // ✅ Perform the actual access request
  const performAccessRequest = async (type, reason = "") => {
    try {
      setLoading((prev) => ({ ...prev, access: true }));
      setError(null);

      const res = await axios.post(`http://localhost:5000/${type}_access`, {
        name: user.name,
        role: user.role,
        patient_name: selectedPatient,
        justification: reason,
      });

      if (res.data.success) {
        setAccessResponse(res.data);
        showToast(res.data.message, "success");
        
        // Auto-show PDF modal if patient data available
        if (res.data.patient_data && Object.keys(res.data.patient_data).length > 0) {
          setTimeout(() => setShowPDFModal(true), 500);
        }
      } else {
        showToast(res.data.message, "error");
      }

      // Log the access attempt
      await axios.post("http://localhost:5000/log_access", {
        name: user.name,
        doctor_name: user.name,
        role: user.role,
        doctor_role: user.role,
        patient_name: selectedPatient,
        action: `${type.toUpperCase()} Access`,
        justification: reason,
        status: res.data.success ? "Granted" : "Denied",
      });

      fetchTrustScore();
      fetchAccessLogs();
      setJustification("");
      setShowJustificationModal(false);
    } catch (error) {
      console.error("Access request error:", error);
      const errorMsg = error.response?.data?.message || "❌ Access request failed.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading((prev) => ({ ...prev, access: false }));
    }
  };

  // ✅ Handle PDF Download
  const handleDownloadPDF = () => {
    if (accessResponse?.pdf_link) {
      window.open(accessResponse.pdf_link, "_blank");
    } else {
      alert("No PDF report available for this patient.");
    }
  };

  // ✅ Improved logout
  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.clear();
    navigate("/");
  };

  // ✅ Handle patient selection
  const handleSelectPatient = async (patientName) => {
    setSelectedPatient(patientName);
    
    // Fetch patient details
    try {
      const res = await axios.get(
        `http://localhost:5000/get_patient/${patientName.toLowerCase()}`
      );
      if (res.data.success) {
        setSelectedPatientData(res.data.patient);
        setRecordForm({
          diagnosis: res.data.patient.diagnosis || "",
          treatment: res.data.patient.treatment || "",
          notes: res.data.patient.notes || "",
        });
      }
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  // ✅ Update patient medical records
  const handleUpdateRecords = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      showToast("⚠️ Please select a patient first!", "warning");
      return;
    }

    if (!recordForm.diagnosis.trim()) {
      showToast("⚠️ Diagnosis is required!", "warning");
      return;
    }

    try {
      setRecordLoading(true);
      const res = await axios.put(
        `http://localhost:5000/update_patient/${selectedPatient.toLowerCase()}`,
        {
          doctor_name: user.name,
          diagnosis: recordForm.diagnosis,
          treatment: recordForm.treatment,
          notes: recordForm.notes,
        }
      );

      if (res.data.success) {
        showToast("✅ " + res.data.message, "success");
        handleSelectPatient(selectedPatient); // Refresh data
        fetchMyPatients(); // Update my patients list
      } else {
        showToast("❌ " + res.data.message, "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("❌ Failed to update patient records", "error");
    } finally {
      setRecordLoading(false);
    }
  };

  return (
    <div className="ehr-layout">
      {/* Sidebar */}
      <aside className="ehr-sidebar">
        <div className="ehr-sidebar-header">
          <FaHospitalUser className="ehr-logo" />
          <h2>MedTrust EHR</h2>
        </div>

        <nav>
          <ul>
            <li
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
              title="View trust score and request patient access"
            >
              <FaUserMd /> Dashboard
            </li>
            <li
              className={activeTab === "patients" ? "active" : ""}
              onClick={() => setActiveTab("patients")}
              title="View all your diagnosed patients"
            >
              <FaUserInjured /> My Patients ({myPatients.length})
            </li>
            <li
              className={activeTab === "accessLogs" ? "active" : ""}
              onClick={() => setActiveTab("accessLogs")}
              title="View your access history and logs"
            >
              <FaClipboardList /> Access Logs ({logs.length})
            </li>
            <li title="Manage your access permissions">
              <FaLock /> Permissions
            </li>
            <li title="View system alerts and notifications">
              <FaExclamationTriangle /> Alerts
            </li>
          </ul>
        </nav>

        <div className="ehr-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ehr-main">
        {/* Header */}
        <header className="ehr-header">
          <div className="header-left">
            <h1>Welcome, Dr. {user.name}</h1>
            <p className="user-role">Role: {user.role}</p>
          </div>

          <div className="header-right">
            <div className="ip-display">
              <FaGlobeAsia className="icon" /> <span>{ipAddress}</span>
            </div>
            <div className="last-login">
              <FaClock className="icon" />{" "}
              <span>Last Login: {lastLogin || "Loading..."}</span>
            </div>
            <div className="session-indicator">
              {isInsideNetwork ? "🏥 In Hospital Network" : "🌐 External Access"}
            </div>
          </div>
        </header>

        {/* ============== TOAST NOTIFICATION ============== */}
        {toast.show && (
          <div className={`toast-notification toast-${toast.type}`}>
            <div className="toast-content">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "warning" && "⚠️"}
              {toast.type === "info" && "ℹ️"}
              <span>{toast.message}</span>
            </div>
            <button className="toast-close" onClick={() => setToast({ ...toast, show: false })}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* ============== ERROR NOTIFICATION ============== */}
        {error && (
          <div className="error-banner">
            <FaExclamationTriangle /> {error}
            <button onClick={() => setError(null)} className="error-close">
              <FaTimes />
            </button>
          </div>
        )}

        {/* ------------------ Dashboard TAB ------------------ */}
        {activeTab === "dashboard" && (
          <>
            {/* ============== TRUST SCORE SECTION ============== */}
            <section className="ehr-section">
              <h2>🛡️ Trust Score Analysis</h2>
              <div className="trust-section">
                {loading.trust ? (
                  <div className="loading-spinner">
                    <FaSpinner className="spin-icon" /> Loading trust score...
                  </div>
                ) : (
                  <TrustScoreMeter score={trustScore} />
                )}
              </div>
            </section>

            {/* ============== PATIENT SELECTION ============== */}
            <section className="ehr-section">
              <h2>🩺 Select Patient (Created by Admin)</h2>
              {loading.patients ? (
                <div className="loading-spinner">
                  <FaSpinner className="spin-icon" /> Loading patients...
                </div>
              ) : (
                <>
                  <select
                    className="patient-dropdown"
                    value={selectedPatient}
                    onChange={(e) => handleSelectPatient(e.target.value)}
                  >
                    <option value="">-- Select a Patient --</option>
                    {allPatients.map((p, idx) => (
                      <option key={idx} value={p.name || p.patient_name}>
                        {p.name || p.patient_name} ({p.email || "N/A"})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </section>

            {/* ============== PATIENT RECORD FORM ============== */}
            {selectedPatient && selectedPatientData && (
              <section className="ehr-section">
                <h2>📋 Update Patient Medical Records</h2>
                
                {/* Patient Info Display */}
                <div className="patient-info-display">
                  <div className="info-box">
                    <label>Patient Name:</label>
                    <span>{selectedPatientData.name}</span>
                  </div>
                  <div className="info-box">
                    <label>Age:</label>
                    <span>{selectedPatientData.age} years</span>
                  </div>
                  <div className="info-box">
                    <label>Gender:</label>
                    <span>{selectedPatientData.gender}</span>
                  </div>
                  <div className="info-box">
                    <label>Email:</label>
                    <span>{selectedPatientData.email}</span>
                  </div>
                </div>

                {/* Record Update Form */}
                <form onSubmit={handleUpdateRecords} className="record-form">
                  <div className="form-group">
                    <label>🏥 Diagnosis *</label>
                    <input
                      type="text"
                      placeholder="e.g., Hypertension, Type-2 Diabetes"
                      value={recordForm.diagnosis}
                      onChange={(e) =>
                        setRecordForm({ ...recordForm, diagnosis: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>💊 Treatment Plan</label>
                    <textarea
                      rows="3"
                      placeholder="e.g., Amlodipine 5mg daily, Regular exercise..."
                      value={recordForm.treatment}
                      onChange={(e) =>
                        setRecordForm({ ...recordForm, treatment: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>📝 Clinical Notes</label>
                    <textarea
                      rows="3"
                      placeholder="Additional observations, follow-up recommendations..."
                      value={recordForm.notes}
                      onChange={(e) =>
                        setRecordForm({ ...recordForm, notes: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-blue"
                    disabled={recordLoading}
                  >
                    {recordLoading ? (
                      <>
                        <FaSpinner className="spin-icon" /> Saving...
                      </>
                    ) : (
                      <>
                        ✅ Save Patient Records
                      </>
                    )}
                  </button>
                </form>
              </section>
            )}

            {/* ============== ACCESS CONTROL ============== */}
            <section className="ehr-section">
              <h2>🔐 Access Control Panel</h2>
              <div className="ehr-access-grid">
                <div className="ehr-access-card green">
                  <div className="card-icon">🏥</div>
                  <h3>Normal Access</h3>
                  <p>Standard access within hospital network. Suitable for routine patient care and record reviews.</p>
                  <button
                    className="btn btn-green"
                    onClick={() => handleAccessRequest("normal")}
                    disabled={loading.access || !selectedPatient}
                  >
                    {loading.access ? (
                      <>
                        <FaSpinner className="spin-icon" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Request Access
                      </>
                    )}
                  </button>
                  {!selectedPatient && (
                    <p className="card-hint">Select a patient first</p>
                  )}
                </div>

                <div
                  className={`ehr-access-card blue ${
                    isInsideNetwork ? "disabled-card" : ""
                  }`}
                >
                  <div className="card-icon">🔒</div>
                  <h3>Restricted Access</h3>
                  <p>
                    For external consultations, research, or off-network access. Requires detailed justification.
                    {isInsideNetwork && (
                      <span className="card-warning">
                        {" "}Available only from outside network
                      </span>
                    )}
                  </p>
                  <button
                    className="btn btn-blue"
                    onClick={() => handleAccessRequest("restricted")}
                    disabled={isInsideNetwork || loading.access || !selectedPatient}
                  >
                    {loading.access ? (
                      <>
                        <FaSpinner className="spin-icon" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaLock /> Request Access
                      </>
                    )}
                  </button>
                  {isInsideNetwork && (
                    <p className="card-hint">Not available in-network</p>
                  )}
                </div>

                <div className="ehr-access-card red">
                  <div className="card-icon">🚨</div>
                  <h3>Emergency Access</h3>
                  <p>Break-glass access for critical, life-threatening situations only. All emergency accesses are logged and reviewed by security.</p>
                  <button
                    className="btn btn-emergency"
                    onClick={() => handleAccessRequest("emergency")}
                    disabled={loading.access || !selectedPatient}
                  >
                    {loading.access ? (
                      <>
                        <FaSpinner className="spin-icon" /> Processing...
                      </>
                    ) : (
                      <>
                        🚨 Break Glass Access
                      </>
                    )}
                  </button>
                  {!selectedPatient && (
                    <p className="card-hint">Select a patient first</p>
                  )}
                </div>
              </div>
            </section>

            {/* ============== PATIENT DATA DISPLAY ============== */}
            {accessResponse?.patient_data &&
              Object.keys(accessResponse.patient_data).length > 0 && (
                <section className="ehr-section patient-data-section">
                  <div className="section-header">
                    <h2>📋 Patient Medical Record</h2>
                    <div className="header-actions">
                      <button
                        className="btn btn-blue btn-sm"
                        onClick={() => setShowPDFModal(true)}
                      >
                        <FaFilePdf /> View Full Report
                      </button>
                      <button
                        className="btn btn-gray btn-sm"
                        onClick={handleDownloadPDF}
                      >
                        <FaFilePdf /> Download PDF
                      </button>
                    </div>
                  </div>
                  <div className="patient-info-grid">
                    {Object.entries(accessResponse.patient_data).map(([k, v]) => (
                      <div key={k} className="patient-info-item">
                        <label>{k.replace("_", " ").toUpperCase()}</label>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="access-timestamp">
                    <FaClock /> Accessed on {new Date().toLocaleString()}
                  </div>
                </section>
              )}
          </>
        )}

        {/* ------------------ MY PATIENTS TAB ------------------ */}
        {activeTab === "patients" && (
          <section className="ehr-section">
            <div className="section-header">
              <h2>
                <FaUserInjured /> My Patient Records ({myPatients.length})
              </h2>
              <button
                className="btn btn-blue btn-sm"
                onClick={fetchMyPatients}
                disabled={loading.myPatients}
              >
                <FaSync /> Refresh
              </button>
            </div>

            <p className="section-description">
              Patients whose records you have updated
            </p>

            {loading.myPatients ? (
              <div className="loading-spinner">
                <FaSpinner className="spin-icon" /> Loading...
              </div>
            ) : myPatients.length > 0 ? (
              <div className="patients-grid">
                {myPatients.map((patient, idx) => (
                  <div key={idx} className="patient-card">
                    <div className="patient-card-header">
                      <div className="patient-avatar">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="patient-info">
                        <h3>{patient.name}</h3>
                        <span className="patient-age">
                          {patient.age} years • {patient.gender}
                        </span>
                      </div>
                    </div>

                    <div className="patient-card-body">
                      <div className="info-row">
                        <span className="info-label">📋 Diagnosis:</span>
                        <span className="info-value">{patient.diagnosis}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">💊 Treatment:</span>
                        <span className="info-value">{patient.treatment}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">📅 Last Updated:</span>
                        <span className="info-value">{patient.last_access || "N/A"}</span>
                      </div>
                    </div>

                    <div className="patient-card-footer">
                      <button
                        className="btn-patient-action"
                        onClick={() => {
                          handleSelectPatient(patient.name);
                          setActiveTab("dashboard");
                        }}
                      >
                        <FaUserMd /> Edit Records
                      </button>
                      <button
                        className="btn-patient-action"
                        onClick={() => {
                          window.open(
                            `http://localhost:5000/generate_patient_pdf/${patient.name.toLowerCase()}`,
                            "_blank"
                          );
                        }}
                      >
                        <FaFilePdf /> Download PDF
                      </button>
                    </div>

                    {patient.notes && (
                      <div className="patient-notes">
                        <strong>📝 Notes:</strong> {patient.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaUserInjured className="empty-icon" />
                <h3>No Patient Records Updated Yet</h3>
                <p>Select a patient and update their medical records to see them here.</p>
              </div>
            )}
          </section>
        )}

        {/* ------------------ Access Logs TAB ------------------ */}
        {activeTab === "accessLogs" && (
          <section className="ehr-section">
            <div className="section-header">
              <h2>
                <FaListAlt /> My Access History
              </h2>
              <button
                className="btn btn-blue btn-sm"
                onClick={fetchAccessLogs}
                disabled={loading.logs}
              >
                {loading.logs ? <FaSpinner className="spin-icon" /> : <FaSync />}
                {" "}Refresh
              </button>
            </div>
            {loading.logs ? (
              <div className="loading-spinner">
                <FaSpinner className="spin-icon" /> Loading access history...
              </div>
            ) : (
              <div className="log-table-wrapper">
                <table className="log-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Patient</th>
                      <th>Justification</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                          <td>{log.action || log.type || "—"}</td>
                          <td>{log.patient_name || "N/A"}</td>
                          <td>{log.justification?.slice(0, 50) || "—"}</td>
                          <td
                            className={
                              log.status === "Granted" || log.status === "Approved"
                                ? "status-granted"
                                : log.status === "Denied"
                                ? "status-denied"
                                : "status-info"
                            }
                          >
                            {log.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            color: "#64748b",
                            padding: "2rem",
                          }}
                        >
                          No access logs available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ============== PDF PREVIEW MODAL ============== */}
        {showPDFModal && accessResponse?.pdf_link && (
          <div className="modal-overlay" onClick={() => setShowPDFModal(false)}>
            <div className="modal-content pdf-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📄 Patient Report</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowPDFModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <iframe
                  src={accessResponse.pdf_link}
                  title="Patient PDF Report"
                  className="pdf-iframe"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-blue"
                  onClick={handleDownloadPDF}
                >
                  <FaFilePdf /> Download PDF
                </button>
                <button
                  className="btn btn-gray"
                  onClick={() => setShowPDFModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============== JUSTIFICATION MODAL ============== */}
        {showJustificationModal && (
          <div className="modal-overlay" onClick={() => setShowJustificationModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📝 Access Justification Required</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowJustificationModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <p>Please provide a valid reason for <strong>{currentAccessType}</strong> access:</p>
                <textarea
                  className="justification-textarea"
                  rows="5"
                  placeholder="Enter detailed justification..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-gray"
                  onClick={() => {
                    setShowJustificationModal(false);
                    setJustification("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-blue"
                  onClick={() => performAccessRequest(currentAccessType, justification.trim())}
                  disabled={!justification.trim() || loading.access}
                >
                  {loading.access ? <FaSpinner className="spin-icon" /> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============== PATIENT FORM MODAL ============== */}
        <PatientFormModal
          isOpen={showPatientForm}
          onClose={() => setShowPatientForm(false)}
          doctorName={user.name}
          onSuccess={() => {
            fetchMyPatients();
            showToast("✅ Patient added successfully!", "success");
          }}
        />
      </main>
    </div>
  );
};

export default DoctorDashboard;