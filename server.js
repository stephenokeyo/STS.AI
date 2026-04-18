const path = require('path');
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBjs1ApmUcn4ORxc7tymIz50uEnC-aNnL8';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const DEFAULT_TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE) || 1;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt in request body.' });
  }

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: { temperature: DEFAULT_TEMPERATURE },
    });

    const response = await result.response;
    const text = response.text();
    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: error.message || 'Gemini API request failed.' });
  }
});

app.get('/config', (req, res) => {
  res.json({ model: DEFAULT_MODEL, temperature: DEFAULT_TEMPERATURE });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gemini browser assistant running at http://localhost:${PORT}`);
});