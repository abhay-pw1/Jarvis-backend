// server.js - JARVIS Backend Server

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure node-fetch is installed if using Node < 18

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURATION: Fill in your credentials below
// ==========================================

// 1. Paste your OpenAI API Key here:
const OPENAI_API_KEY = "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";

// 2. Paste your ElevenLabs API Key here:
const ELEVENLABS_API_KEY = "sk_bef99f6c2ae5241ff38be1807c7409a38310271a6b0c2d4b";

// 3. Paste your ElevenLabs Voice ID (Adam's Voice ID) here:
const VOICE_ID = "IRHApOXLvnW57QJPQH2P";

// ==========================================
// ROUTES
// ==========================================

// Test endpoint to verify server is running
app.get('/', (req, res) => {

  res.send('JARVIS Backend Server is Running!');
});

// Endpoint 1: Chat with OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are JARVIS, an advanced AI assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in OpenAI Chat route:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
});

// Endpoint 2: Convert Text to Speech via ElevenLabs (Adam Voice)
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBuffer = await response.buffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error in TTS route:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JARVIS backend running on port ${PORT}`);
});
