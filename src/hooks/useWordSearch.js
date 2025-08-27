import { useState, useEffect, useCallback } from "react";

let idCounter = 0;

export const useWordSearch = (size = 10, onComplete = () => {}) => {
  const [grid, setGrid] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [currentTheme, setCurrentTheme] = useState("Word Search");
  const [currentWords, setCurrentWords] = useState([]);
  const [firstClick, setFirstClick] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [animations, setAnimations] = useState([]);

  const showMessage = useCallback((text, type = "info", duration = 3000) => {
    const id = idCounter++;
    setAnimations((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setAnimations((prev) => prev.filter((m) => m.id !== id));
    }, duration);
  }, []);

  // Generates new puzzle
  const generatePuzzle = useCallback((words, theme = "Word Search") => {
    setFoundWords(new Set());
    setScore(0);
    setCurrentWords(words.map((w) => w.toUpperCase()));
    setCurrentTheme(theme);

    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal_down: [1, 1],
      diagonal_up: [-1, 1],
    };
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let newGrid = Array(size).fill().map(() => Array(size).fill(""));
    let newPlacedWords = [];

    const canPlaceWord = (word, row, col, [dr, dc]) => {
      const endRow = row + dr * (word.length - 1);
      const endCol = col + dc * (word.length - 1);
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) return false;
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (newGrid[r][c] && newGrid[r][c] !== word[i]) return false;
      }
      return true;
    };

    const placeWord = (word, row, col, dir) => {
      const [dr, dc] = dir;
      const positions = [];
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i, c = col + dc * i;
        newGrid[r][c] = word[i];
        positions.push([r, c]);
      }
      newPlacedWords.push({ word, positions });
    };

    const keys = Object.values(directions);
    words.forEach((raw) => {
      const word = raw.toUpperCase();
      let attempts = 0, placed = false;
      while (!placed && attempts < 100) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        const dir = keys[Math.floor(Math.random() * keys.length)];
        if (canPlaceWord(word, row, col, dir)) {
          placeWord(word, row, col, dir);
          placed = true;
        }
        attempts++;
      }
    });

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!newGrid[r][c]) newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
    setGrid(newGrid);
    setPlacedWords(newPlacedWords);
  }, [size]);

  const selectWord = (word) => {
    if (foundWords.has(word)) return;
    const newFound = new Set(foundWords);
    newFound.add(word);
    setFoundWords(newFound);
    setScore((s) => s + 10);
    showMessage(`+10 Points!`, "points");
    showMessage(`Found: ${word}!`, "success");

    if (newFound.size === currentWords.length && currentWords.length > 0) {
      showMessage("🎉 Congratulations! Puzzle complete!", "complete", 4000);
      onComplete();
    }
  };

  const handleCellClick = useCallback((row, col) => {
    if (!firstClick) {
      setFirstClick({ row, col });
      setRemainingTime(5);
    } else {
      validate(firstClick, { row, col });
      setFirstClick(null);
      setRemainingTime(0);
    }
  }, [firstClick, placedWords]);

  const validate = (first, last) => {
    for (const placed of placedWords) {
      const firstPos = placed.positions[0];
      const lastPos = placed.positions[placed.positions.length - 1];
      if (
        (first.row === firstPos[0] && first.col === firstPos[1] &&
         last.row === lastPos[0] && last.col === lastPos[1]) ||
        (first.row === lastPos[0] && first.col === lastPos[1] &&
         last.row === firstPos[0] && last.col === firstPos[1])
      ) {
        selectWord(placed.word);
        return;
      }
    }
    showMessage("Invalid selection!", "error");
  };

  // timer effect
  useEffect(() => {
    if (remainingTime > 0) {
      const t = setTimeout(() => setRemainingTime((r) => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [remainingTime]);

  return { grid, score, foundWords, currentWords, currentTheme, generatePuzzle, handleCellClick, remainingTime, animations };
};