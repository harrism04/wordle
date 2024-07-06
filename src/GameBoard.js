import React from 'react';

const GameBoard = ({ guesses, currentGuess, word }) => {
  const rows = guesses.map((guess, i) => {
    const isCurrentGuess = i === guesses.findIndex(g => g === '');
    const rowGuess = isCurrentGuess ? currentGuess.padEnd(5, ' ') : guess;

    return (
      <div key={i} className="flex mb-1">
        {rowGuess.split('').map((letter, j) => {
          let bgColor = 'bg-gray-200';
          if (guess !== '') {
            if (letter === word[j]) {
              bgColor = 'bg-green-500';
            } else if (word.includes(letter)) {
              bgColor = 'bg-yellow-500';
            } else {
              bgColor = 'bg-gray-500';
            }
          }

          return (
            <div
              key={j}
              className={`w-12 h-12 border-2 flex items-center justify-center mx-0.5 text-2xl font-bold ${bgColor}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  });

  return <div className="mb-4">{rows}</div>;
};

export default GameBoard;