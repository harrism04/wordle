const axios = require('axios');

export default async function handler(req, res) {
  const SHEET_ID = process.env.REACT_APP_SHEET_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    return res.status(500).json({ error: 'Missing SHEET_ID or API_KEY in environment variables' });
  }

  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`
    );
    const words = response.data.values.flat().filter(word => word && word.length === 5);
    if (words.length === 0) {
      throw new Error('No 5-letter words found in the sheet');
    }
    const selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    res.status(200).json({ word: selectedWord });
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
}