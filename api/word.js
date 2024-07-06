const axios = require('axios');

module.exports = async function handler(req, res) {
  console.log('API route /api/word called');
  const SHEET_ID = process.env.REACT_APP_SHEET_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    console.error('Missing SHEET_ID or API_KEY in environment variables');
    return res.status(500).json({ error: 'Missing SHEET_ID or API_KEY in environment variables' });
  }

  try {
    console.log('Attempting to fetch from Google Sheets');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`;
    console.log('Fetching from URL:', url.replace(API_KEY, 'API_KEY_REDACTED'));
    
    const response = await axios.get(url);
    console.log('Response received from Google Sheets');
    
    const words = response.data.values.flat().filter(word => word && word.length === 5);
    console.log(`Found ${words.length} valid 5-letter words`);
    
    if (words.length === 0) {
      throw new Error('No 5-letter words found in the sheet');
    }
    
    const selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    console.log('Selected word:', selectedWord);
    
    res.status(200).json({ word: selectedWord });
  } catch (error) {
    console.error('Error in /api/word:', error.message);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
};