import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import GameBoard from './GameBoard.js';
import Keyboard from './Keyboard.js';
import { fetchWord } from './api.js';

const App = () => {
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchWord().then(setWord);
  }, []);

  // New useEffect hook for physical keyboard support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return;
      const key = event.key.toUpperCase();
      if (key === 'ENTER') {
        handleKeyPress('Enter');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('Backspace');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, currentGuess, word, guesses]);

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'Enter') {
      if (currentGuess.length !== 5) return;

      const newGuesses = [...guesses];
      const currentGuessIndex = newGuesses.findIndex(guess => guess === '');
      newGuesses[currentGuessIndex] = currentGuess;
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === word) {
        setGameOver(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else if (currentGuessIndex === 5) {
        setGameOver(true);
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold mb-8">Verdle</h1>
      <GameBoard guesses={guesses} currentGuess={currentGuess} word={word} />
      <Keyboard onKeyPress={handleKeyPress} guesses={guesses} word={word} />
      {gameOver && (
        <div className="mt-4 text-xl font-bold">
          {guesses.includes(word) 
            ? 'Congrats nerd! You guessed it right for once!' 
            : `What a loser! The word was: ${word}`}
        </div>
      )}
    </div>
  );
};

export default App;