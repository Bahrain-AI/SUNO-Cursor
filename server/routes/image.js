const express = require('express');
const { fal } = require('@fal-ai/client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Initialize fal.ai client
fal.config({
  credentials: process.env.FAL_API_KEY || ''
});

/**
 * Generate image using Nano Banana Pro
 * POST /api/image/generate
 * Body: { prompt, artist?, instrument?, aspectRatio? }
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, artist, instrument, aspectRatio = '9:16' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.FAL_API_KEY) {
      return res.status(500).json({ 
        error: 'FAL API key not configured. Please set FAL_API_KEY in your .env file' 
      });
    }

    // Build the final prompt
    let finalPrompt = prompt;
    
    // If instrument is specified, add it to the prompt
    if (instrument) {
      if (instrument.toLowerCase() === 'piano') {
        // Use first prompt style for piano
        finalPrompt = `${prompt}, playing piano`;
      } else {
        // Use second prompt style for other instruments
        finalPrompt = `${prompt}, holding a ${instrument}`;
      }
    }
    
    // If artist is specified, add it to the prompt
    if (artist) {
      finalPrompt = `${artist} ${finalPrompt}`;
    }

    // Generate image using fal.ai Nano Banana Pro
    const result = await fal.subscribe('fal-ai/nano-banana-pro', {
      input: {
        prompt: finalPrompt,
        aspect_ratio: aspectRatio,
        num_images: 1
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Image generation in progress...');
        }
      }
    });

    // Download the generated image
    const imageUrl = result.images?.[0]?.url || result.image?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to get image URL from API' });
    }

    // Download and save the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const imagePath = path.join(__dirname, '../uploads', `image-${Date.now()}.png`);
    const writer = fs.createWriteStream(imagePath);
    
    imageResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    res.json({
      success: true,
      imagePath: imagePath,
      filename: path.basename(imagePath),
      imageUrl: `/uploads/${path.basename(imagePath)}`,
      prompt: finalPrompt
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
});

module.exports = router;

