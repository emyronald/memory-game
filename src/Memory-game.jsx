import { useState, useEffect } from "react";

export default function MemoryGame() {
  const [char, setChar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clicked, setClicked] = useState([]);

  useEffect(() => {
    async function fetchChars() {
      try {
        const charArr = Array.from({ length: 20 }, (_, i) => i + 1);
        const url = `https://rickandmortyapi.com/api/character/${charArr}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChar(data);
      } catch (error) {
        console.error("Error fetching characters:", error);
        alert("Failed to load characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchChars();
  }, []);

  function shuffleCards(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setChar(newArray);
  }

  function handleCardClick(characterId) {
    if (clicked.includes(characterId)) {
      alert("Game Over! You clicked the same chracter twice.");
      setClicked([]);
      setScore(0);
      if (score > highScore) {
        setHighScore(score);
      }
    } else {
      setClicked((prev) => [...prev, characterId]);
      setScore((prev) => prev + 1);
    }
    shuffleCards(char);
  }

  function handleNewGame() {
    setClicked([]);
    setScore(0);
    shuffleCards(char);
  }
  return (
    <>
      {loading && <p>Loading</p>}
      {!loading && (
        <main>
          <header>
            <h1>Memory Game</h1>
            <p className="instructions">
              Click on a character to earn points, but don't click on any
              character more than once!
            </p>
            <div className="board">
              <p>Score:{score}</p>
              <p>Highscore: {highScore}</p>
            </div>
            <button onClick={handleNewGame}>New Game</button>
          </header>
          {char.length > 1 && (
            <div className="cards">
              {char.map((character) => (
                <Card
                  key={character.id}
                  character={character}
                  onClick={() => handleCardClick(character.id)}
                />
              ))}
            </div>
          )}
        </main>
      )}
    </>
  );
}

function Card({ character, onClick }) {
  return (
    <figure className="card">
      <img src={character.image} alt={character.name} onClick={onClick} />
      <figcaption>{character.name}</figcaption>
    </figure>
  );
}
