const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate lyrics using Gemini 3
 * POST /api/lyrics/generate
 * Body: { songDescription, style? }
 * 
 * Example: { songDescription: "piano song ballad about love", style: "ballad" }
 */
router.post('/generate', async (req, res) => {
  try {
    const { songDescription, style } = req.body;
    
    if (!songDescription) {
      return res.status(400).json({ error: 'Song description is required' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env file' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Create engaging song lyrics for a ${songDescription}.
${style ? `Style: ${style}` : ''}

Generate creative, catchy lyrics that would work well for a music video. Include verses, a chorus, and make it suitable for a modern song. Format the lyrics clearly with line breaks. Make sure the chorus is memorable and repeatable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const lyrics = response.text();

    res.json({
      success: true,
      lyrics: lyrics,
      songDescription: songDescription
    });
  } catch (error) {
    console.error('Error generating lyrics:', error);
    res.status(500).json({ 
      error: 'Failed to generate lyrics',
      details: error.message 
    });
  }
});

module.exports = router;

