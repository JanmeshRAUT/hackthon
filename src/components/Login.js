import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
const componentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');

  .login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
    padding: 1rem;
    font-family: 'Inter', sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 448px;
    background-color: white;
    padding: 2.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    transition: transform 0.2s ease-in-out;
  }

  .login-title {
    font-size: 1.875rem;
    font-weight: 800;
    text-align: center;
    color: #4f46e5;
    margin-bottom: 2rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    margin-bottom: 0; /* Handled by gap on .login-form */
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .form-input, .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    font-size: 1rem;
    color: #111827;
    outline: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    background-color: white;
  }

  .form-input:focus, .form-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }

  .form-select {
    appearance: none;
    padding-right: 2.5rem; /* Space for arrow */
  }
  
  .form-select-container {
    position: relative;
  }

  .select-arrow {
    pointer-events: none;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    color: #374151;
  }

  .submit-button {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.75rem 1rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    background-color: #4f46e5;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  }

  .submit-button:hover {
    background-color: #4338ca;
  }
  
  .submit-button:active {
    transform: scale(0.98);
  }
`;

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      onLogin(userData.role, userData.name);
    }
  } catch (error) {
    console.error(error.message);
    alert("Invalid credentials");
  }
};

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("doctor");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(role, name);
  };


  return (
    <>
      <style>{componentStyles}</style>

      <div className="login-wrapper">
        <div className="login-card">
          
          <h1 className="login-title">
            MedTrust AI Login
          </h1>

          <form className="login-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Select Role
              </label>
              <div className="form-select-container">
                <select
                  id="role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                  <option value="nurse">Nurse</option>
                </select>
                <div className="select-arrow">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="submit-button"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};


export default Login;
