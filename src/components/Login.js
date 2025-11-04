import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const componentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');
  .login-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: 'Inter', sans-serif; }
  .login-card { width: 100%; max-width: 448px; background: white; padding: 2.5rem; border-radius: 0.75rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
  .login-title { text-align: center; color: #4f46e5; font-size: 1.875rem; font-weight: 800; margin-bottom: 2rem; }
  .login-form { display: flex; flex-direction: column; gap: 1.5rem; }
  .form-label { font-weight: 500; font-size: 0.9rem; color: #374151; }
  .form-input { padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
  .submit-button { background: #4f46e5; color: white; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
  .submit-button:hover { background: #4338ca; }
`;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      } else {
        alert("User record not found in Firestore!");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <style>{componentStyles}</style>
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">MedTrust AI Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
