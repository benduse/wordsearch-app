import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [themes, setThemes] = useState([]);

  // Load themes on mount
  useEffect(() => {
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
    fetchThemes();
  }, []);

  // File upload handler
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
        await setDoc(doc(db, "wordsearch", "themes"), { themes: data.themes });
        setThemes(data.themes);
        alert("✅ Themes uploaded successfully!");
      } catch (err) {
        alert("❌ Error parsing or uploading: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Clear all themes
  const clearThemes = async () => {
    if (!window.confirm("⚠️ Are you sure? This will delete ALL themes.")) return;
    try {
      await deleteDoc(doc(db, "wordsearch", "themes"));
      await setDoc(doc(db, "wordsearch", "themes"), { themes: [] });
      setThemes([]);
      alert("✅ All themes cleared!");
    } catch (err) {
      console.error("Error clearing themes:", err);
      alert("❌ Failed to clear themes: " + err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>🛠 Admin: Manage Word Search Themes</h2>

      <input type="file" accept="application/json" onChange={handleUpload} />
      <button onClick={clearThemes}>Clear Themes</button>

      <div className="uploaded-themes">
        {themes.length === 0 && <p>No themes uploaded yet.</p>}
        {themes.map((t, i) => (
          <div key={i} className="theme-block">
            <h3>Theme {i + 1}: {t.theme}</h3>
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