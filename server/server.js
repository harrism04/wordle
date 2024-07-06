require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/word', async (req, res) => {
  try {
    console.log('Fetching word from Google Sheets...');
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`
    );
    const words = response.data.values.flat().filter(word => word && word.length === 5);
    if (words.length === 0) {
      throw new Error('No 5-letter words found in the sheet');
    }
    const selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    console.log('Word fetched successfully:', selectedWord);
    res.json({ word: selectedWord });
  } catch (error) {
    console.error('Error fetching word:', error.message);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});