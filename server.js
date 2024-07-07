const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

// Middleware
app.use(cors({
  origin: ['https://sohaidle.vercel.app', 'http://localhost:3000']
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// API routes
app.get('/api/word', async (req, res) => {
  try {
    console.log('Fetching word from Google Sheets...');
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const words = data.values.flat().filter(word => word && word.length === 5);
    if (words.length === 0) {
      throw new Error('No 5-letter words found in the sheet');
    }
    const selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    console.log('Word fetched successfully:', selectedWord);
    res.json({ word: selectedWord });
  } catch (error) {
    console.error('Error fetching word from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // For Vercel