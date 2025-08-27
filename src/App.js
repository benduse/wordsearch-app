import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import GameScreen from "./components/GameScreen";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GameScreen />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;