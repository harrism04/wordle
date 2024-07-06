import React from 'react';

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

const Keyboard = ({ onKeyPress, guesses, word }) => {
  const getKeyColor = (key) => {
    const flatGuesses = guesses.join('');
    if (flatGuesses.includes(key)) {
      if (word.includes(key)) {
        return word.indexOf(key) === flatGuesses.indexOf(key) ? 'bg-green-500' : 'bg-yellow-500';
      }
      return 'bg-gray-500';
    }
    return 'bg-gray-200';
  };

  return (
    <div className="mt-4">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center mb-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`mx-0.5 px-2 py-3 rounded font-bold ${getKeyColor(key)} ${
                key.length > 1 ? 'text-xs' : 'text-sm'
              }`}
              style={{ minWidth: key.length > 1 ? '4rem' : '2rem' }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;