const fetchWordFromServer = async () => {
  console.log('Attempting to fetch word from local server...');
  try {
    const response = await fetch('/api/word', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Word fetched from server:', data.word);
    return data.word;
  } catch (error) {
    console.error('Error fetching word from server:', error.message);
    throw error;
  }
};

export const fetchWord = async () => {
  try {
    return await fetchWordFromServer();
  } catch (error) {
    console.error('Failed to fetch word:', error.message);
    return 'ERROR';
  }
};