const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// KIE API SUNO endpoints
const KIE_API_BASE = process.env.KIE_API_BASE || 'https://api.kie.ai/v1/suno';
const KIE_API_KEY = process.env.KIE_API_KEY || '';

/**
 * Generate music using SUNO API (KIE)
 * POST /api/music/generate
 * Body: { lyrics, title?, style?, vocals? }
 */
router.post('/generate', async (req, res) => {
  try {
    const { lyrics, title, style, vocals } = req.body;
    
    if (!lyrics) {
      return res.status(400).json({ error: 'Lyrics are required' });
    }

    if (!KIE_API_KEY) {
      return res.status(500).json({ 
        error: 'KIE API key not configured. Please set KIE_API_KEY in your .env file' 
      });
    }

    // Build tags from style and vocals
    const tags = [style || 'pop'];
    if (vocals) {
      tags.push(vocals);
    }

    // Generate music using SUNO API
    const response = await axios.post(
      `${KIE_API_BASE}/generate`,
      {
        prompt: lyrics.substring(0, 500), // Limit prompt length
        title: title || 'Generated Song',
        tags: tags.join(', '),
        make_instrumental: false,
        wait_audio: true
      },
      {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Handle async response - check if task_id is returned
    let audioUrl;
    if (response.data.task_id) {
      // Poll for completion
      let taskStatus = 'processing';
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (taskStatus === 'processing' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await axios.get(
          `${KIE_API_BASE}/task/${response.data.task_id}`,
          {
            headers: {
              'Authorization': `Bearer ${KIE_API_KEY}`
            }
          }
        );

        taskStatus = statusResponse.data.status;
        if (taskStatus === 'completed') {
          audioUrl = statusResponse.data.audio_url;
          break;
        }
        attempts++;
      }

      if (!audioUrl) {
        return res.status(500).json({ error: 'Music generation timed out or failed' });
      }
    } else {
      audioUrl = response.data.audio_url || response.data.url;
    }
    
    if (!audioUrl) {
      return res.status(500).json({ error: 'Failed to get audio URL from SUNO API' });
    }

    // Download the audio file
    const audioResponse = await axios.get(audioUrl, { responseType: 'stream' });
    const audioPath = path.join(__dirname, '../uploads', `song-${Date.now()}.mp3`);
    const writer = fs.createWriteStream(audioPath);
    
    audioResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    res.json({
      success: true,
      audioPath: audioPath,
      filename: path.basename(audioPath),
      audioUrl: `/uploads/${path.basename(audioPath)}`
    });
  } catch (error) {
    console.error('Error generating music:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: 'SUNO API error',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate music',
      details: error.message,
      note: 'Please ensure KIE_API_KEY is correctly configured'
    });
  }
});

module.exports = router;

