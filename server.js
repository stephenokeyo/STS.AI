const path = require('path');
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const DEFAULT_TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE) || 1;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

app.post('/api/chat', async (req, res) => {
  const { prompt, image, imageType } = req.body;
  const promptText = typeof prompt === 'string' ? prompt.trim() : '';
  const hasImage = typeof image === 'string' && image.length > 0;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Gemini API key is not configured.' });
  }

  if (!promptText && !hasImage) {
    return res.status(400).json({ error: 'Missing prompt or image in request body.' });
  }

  const parts = [];
  if (promptText) {
    parts.push({ text: promptText });
  }
  if (hasImage) {
    parts.push({
      image: {
        imageBytesBase64: image,
        mimeType: imageType || 'image/jpeg',
      },
    });
  }

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts,
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