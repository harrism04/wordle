import axios from 'axios';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

// Function to fetch word from local server
const fetchWordFromServer = async () => {
  console.log('Attempting to fetch word from local server...');
  try {
    const response = await axios.get('/api/word');
    console.log('Word fetched from server:', response.data.word);
    return response.data.word;
  } catch (error) {
    console.error('Error fetching word from server:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

// Function to fetch word directly from Google Sheets
const fetchWordFromSheets = async () => {
  console.log('Attempting to fetch word directly from Google Sheets...');
  
  if (!SHEET_ID || !API_KEY) {
    console.error('Missing SHEET_ID or API_KEY. Please check your .env file.');
    throw new Error('Missing API credentials');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`;
  console.log(`Fetching from: ${url.replace(API_KEY, 'API_KEY_REDACTED')}`);

  try {
    const response = await axios.get(url);
    console.log('Response received from Google Sheets');

    if (!response.data.values || response.data.values.length === 0) {
      console.error('No data found in the sheet');
      throw new Error('No data in sheet');
    }

    const words = response.data.values.flat().filter(word => word && word.length === 5);
    console.log(`Found ${words.length} valid 5-letter words`);

    if (words.length === 0) {
      console.error('No 5-letter words found in the sheet');
      throw new Error('No valid words found');
    }

    const selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    console.log('Selected word:', selectedWord);
    return selectedWord;
  } catch (error) {
    console.error('Error fetching word from Google Sheets:', error.message);
    if (error.response) {
      console.error('Error response:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

// Main fetchWord function that decides which method to use
export const fetchWord = async () => {
  try {
    // Uncomment the method you want to use:
    // return await fetchWordFromServer();
    return await fetchWordFromSheets();
  } catch (error) {
    console.error('Failed to fetch word:', error.message);
    return 'ERROR';
  }
};