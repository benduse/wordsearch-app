import React from "react";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => (
  <div className="landing-container">
    <img src="/ejo-logo.svg" alt="Ejo Logo" className="landing-logo" />
    <h1 className="landing-title">Ejo Word Search</h1>
    <p className="landing-subtitle">Find the words. Test your mind. Have fun!</p>
    <button className="landing-button" onClick={onStart}>▶ Play Puzzle</button>
    <div className="landing-footer"><a href="/admin">🔑 Admin</a></div>
  </div>
);

export default LandingPage;