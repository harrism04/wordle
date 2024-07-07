import axios from 'axios';

export default async function handler(req, res) {
  console.log(`[${new Date().toISOString()}] Received request: ${req.method} ${req.url}`);

  const SHEET_ID = process.env.REACT_APP_SHEET_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    console.error(`[${new Date().toISOString()}] Missing SHEET_ID or API_KEY in environment variables`);
    return res.status(500).json({ error: 'Missing SHEET_ID or API_KEY in environment variables' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Fetching words from Google Sheets with SHEET_ID: ${SHEET_ID}`);
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`
    );
    const words = response.data.values.flat().filter(word => word && word.length === 5);
    if (words.length === 0) {
      throw new Error('No 5-letter words found in the sheet');
    }
    const selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    console.log(`[${new Date().toISOString()}] Word fetched successfully: ${selectedWord}`);
    res.status(200).json({ word: selectedWord });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching word: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
}
