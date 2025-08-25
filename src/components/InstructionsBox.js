import React,{useState} from "react";
const InstructionsBox=()=> {
const [open,setOpen]=useState(false);
return (<div className="instructions-box">
  <button className="instructions-toggle" onClick={()=>setOpen(!open)}>📖 How to Play</button>
  {open && <div className="instructions-content">
    <h3>📝 How to Play</h3>
    <ol>
      <li>Grid of letters loads with word list.</li>
      <li>Click first and last letters of a word.</li>
      <li>You have 5s between clicks.</li>
      <li>Correct = +10 points & highlights; Wrong = error.</li>
      <li>Find all words → win!</li>
    </ol>
  </div>}
</div>);
}
export default InstructionsBox;