import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

app.use(cors({
  origin: ['https://sohaidle.vercel.app', 'http://localhost:3000', 'https://soh.ai', 'https://www.soh.ai']
}));

// Increase header and payload size limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Detailed request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.use(express.static(path.join(path.resolve(), 'build')));

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

app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});