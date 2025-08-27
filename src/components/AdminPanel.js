import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [themes, setThemes] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchThemes();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchThemes = async () => {
    try {
      const snap = await getDoc(doc(db, "wordsearch", "themes"));
      if (snap.exists()) {
        const data = snap.data();
        if (data.themes) setThemes(data.themes);
      }
    } catch (err) {
      console.error("Error fetching themes:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Failed to login: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data.themes)) {
          alert("❌ Invalid format. Expected { themes: [ ... ] }");
          return;
        }

        const themesRef = doc(db, "wordsearch", "themes");
        const currentThemesSnap = await getDoc(themesRef);

        if (currentThemesSnap.exists()) {
          await updateDoc(themesRef, {
            themes: arrayUnion(...data.themes),
          });
        } else {
          await setDoc(themesRef, { themes: data.themes });
        }

        fetchThemes();
        alert("✅ Themes appended successfully!");
      } catch (err) {
        alert("❌ Error parsing or uploading: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="admin-panel">
        <form onSubmit={handleLogin} className="login-form">
          <h2>🔑 Admin Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>🛠 Admin: Manage Word Search Themes</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <input type="file" accept="application/json" onChange={handleUpload} />

      <div className="uploaded-themes">
        {themes.length === 0 && <p>No themes uploaded yet.</p>}
        {themes.map((t, i) => (
          <div key={i} className="theme-block">
            <h3>
              Theme {i + 1}: {t.theme}
            </h3>
            <ul>
              {t.words.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;