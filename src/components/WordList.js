const WordList = ({ words, foundWords, theme }) => (
  <div className="word-list">
    <h3>{theme} - Find {words.length} words:</h3>
    <ul>
      {words.map((word,i)=>(
        <li key={i} className={`word-item ${foundWords.has(word)?"found":""}`}>
          {i+1}. {word}
        </li>
      ))}
    </ul>
  </div>
);
export default WordList;