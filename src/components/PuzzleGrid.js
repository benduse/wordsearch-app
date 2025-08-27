import React from "react"; 

const PuzzleGrid = ({ grid, onCellClick }) => (
  <div className="grid">
    {grid.map((row,r)=>(
      <div key={r} className="grid-row">
        {row.map((cell,c)=>(
          <div key={`${r}-${c}`} className="grid-cell" onClick={()=>onCellClick(r,c)}>{cell}</div>
        ))}
      </div>
    ))}
  </div>
);
export default PuzzleGrid;