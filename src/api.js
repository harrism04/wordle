export const fetchWord = async () => {
  console.log('Attempting to fetch word from server...');
  try {
    const response = await fetch('/api/word');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Word fetched from server:', data.word);
    return data.word;
  } catch (error) {
    console.error('Failed to fetch word:', error.message);
    return 'ERROR';
  }
};
