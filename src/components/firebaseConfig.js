// ✅ Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 🔥 Your Firebase configuration (from console)
const firebaseConfig = {
  apiKey: "AIzaSyAaVr5Kij4MUlqZF_1WpeQtpSwPfI5-Nro",
  authDomain: "medtrust-a481c.firebaseapp.com",
  projectId: "medtrust-a481c",
  storageBucket: "medtrust-a481c.firebasestorage.app",
  messagingSenderId: "901319230783",
  appId: "1:901319230783:web:a672ff3c100a5da123ff8a",
  measurementId: "G-N5DMCR8J1D",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize other Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ✅ Export for use in components
export { app, auth, db, analytics };
