import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useWordSearch } from "../hooks/useWordSearch";
import InstructionsBox from "./InstructionsBox";
import ThemeSelector from "./ThemeSelector";
import PuzzleGrid from "./PuzzleGrid";
import ScoreBoard from "./ScoreBoard";
import WordList from "./WordList";

const GameScreen = () => {
  const [allThemes, setAllThemes] = useState([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(null);
  const advanceTheme = () => setTimeout(() => setCurrentThemeIndex((i)=>i+1<allThemes.length?i+1:i), 3000);

  const { grid, score, foundWords, currentWords, currentTheme, generatePuzzle, handleCellClick, remainingTime, animations } = useWordSearch(10, advanceTheme);

  useEffect(()=> {
    const load = async () => {
      const snap = await getDoc(doc(db,"wordsearch","themes"));
      if (snap.exists() && snap.data().themes?.length) {
        setAllThemes(snap.data().themes); setCurrentThemeIndex(0);
        let t = snap.data().themes[0]; generatePuzzle(t.words,t.theme);
      } else {
        let fallback={theme:"Default",words:["AMATA","MAMA","KURYA"]};
        setAllThemes([fallback]); setCurrentThemeIndex(0); generatePuzzle(fallback.words,fallback.theme);
      }
    };
    load();
  },[generatePuzzle]);

  useEffect(() => { if(allThemes[currentThemeIndex]) {
    let t = allThemes[currentThemeIndex]; generatePuzzle(t.words, t.theme);
  }},[currentThemeIndex, allThemes, generatePuzzle]);

  return (
    <div className="app">
      <h1>ejo Kinyarwanda Word Search Puzzle</h1>
      <InstructionsBox/>
      <ThemeSelector allThemes={allThemes} currentThemeIndex={currentThemeIndex} onThemeSelected={i=>setCurrentThemeIndex(parseInt(i))}/>
      <div className="puzzle-container">
        <div className="grid-section"><PuzzleGrid grid={grid} onCellClick={handleCellClick}/></div>
        <div className="game-info">
          <ScoreBoard score={score} found={foundWords.size} total={currentWords.length} remainingTime={remainingTime} animations={animations}/>
          <WordList words={currentWords} foundWords={foundWords} theme={currentTheme}/>
        </div>
      </div>
    </div>
  );
};
export default GameScreen;