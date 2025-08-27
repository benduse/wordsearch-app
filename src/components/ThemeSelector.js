import React from "react";

const ThemeSelector = ({ allThemes, currentThemeIndex, onThemeSelected }) => {
  return (
    <div id="theme-selector-container">
      <label htmlFor="theme-selector">Choose a theme:</label>
      <select
        id="theme-selector"
        value={currentThemeIndex ?? ""}
        onChange={(e) => onThemeSelected(parseInt(e.target.value))}
      >
        <option value="">-- Select Theme --</option>
        {allThemes.map((t, i) => (
          <option key={i} value={i}>
            {t.theme}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;