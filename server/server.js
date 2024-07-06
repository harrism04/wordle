import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
// Assuming you're in a Node.js environment that doesn't have fetch globally available
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

app.use(cors({
  origin: ['https://sohaidle.vercel.app', 'http://localhost:3000', 'https://soh.ai','https://www.soh.ai']
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

app.use(express.static(path.join(__dirname, 'build')));

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
    // Process the data or send it in the response
  } catch (error) {
    console.error('Error fetching word from Google Sheets:', error);
    res.status(500).send('Error fetching word');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});