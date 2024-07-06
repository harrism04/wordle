import axios from 'axios';

export const fetchWord = async () => {
  try {
    const response = await axios.get('/api/word');
    return response.data.word;
  } catch (error) {
    console.error('Error fetching word:', error);
    return 'ERROR';
  }
};