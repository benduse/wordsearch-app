const ScoreBoard = ({ score, found, total, remainingTime, animations }) => (
  <div className="score-section">
    <div className="score-display">Score: {score}</div>
    <div className="timer-display">{remainingTime>0?`⏳ ${remainingTime}s`:""}</div>
    <div className="points-animation-container">
      {animations.map(m=><div key={m.id} className={`points-animation ${m.type}`}>{m.text}</div>)}
    </div>
    <div className="progress-bar"><div className="progress-fill" style={{width:`${total?found/total*100:0}%`}}/></div>
    <div className="stats"><span>Found: {found}</span><span>Total: {total}</span></div>
  </div>
);
export default ScoreBoard;