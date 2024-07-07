const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

// Comprehensive CORS configuration
const allowedOrigins = [
  /^https:\/\/(?:[\w-]+--)?sohaidle(?:\.vercel\.app|--[\w-]+\.vercel\.app)$/, // Matches sohaidle.vercel.app and preview URLs
  'http://localhost:3000',  // Local development
  'https://soh.ai',         // Your production domain
  'https://www.soh.ai'      // www subdomain of your production domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      console.log('CORS error:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // If you need to allow credentials
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// API routes
app.get('/api/word', async (req, res) => {
  console.log('Received request for /api/word');
  try {
    console.log('Fetching word from Google Sheets...');
    console.log('SHEET_ID:', SHEET_ID);
    console.log('API_KEY:', API_KEY ? 'Set' : 'Not set');

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=${API_KEY}`
    );
    
    console.log('Google Sheets API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Data received from Google Sheets:', data);

    const words = data.values.flat().filter(word => word && word.length === 5);
    console.log('Filtered 5-letter words:', words);

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app; // For Vercel