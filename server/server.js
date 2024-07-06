require('dotenv').config(); // This line loads the environment variables from .env file
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;  // Use the PORT env variable if available, otherwise use 3001

// Access environment variables
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.API_KEY;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/api/word', async (req, res) => {
  try {
    if (!SHEET_ID || !API_KEY) {
      throw new Error('Missing SHEET_ID or API_KEY environment variables');
    }

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`
    );

    const words = response.data.values.flat().filter(word => word && word.length === 5);

    if (words.length === 0) {
      throw new Error('No valid words found in the sheet');
    }

    const randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    res.json({ word: randomWord });
  } catch (error) {
    console.error('Error fetching word:', error.message);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});