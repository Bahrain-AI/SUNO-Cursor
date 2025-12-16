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
 * Create video using OmniHuman v1.5
 * POST /api/video/create
 * Body: { imagePath, audioPath }
 * 
 * Uses fal.ai OmniHuman model to generate video from image + audio
 */
router.post('/create', async (req, res) => {
  try {
    const { imagePath, audioPath } = req.body;
    
    if (!imagePath || !audioPath) {
      return res.status(400).json({ error: 'Both imagePath and audioPath are required' });
    }

    if (!process.env.FAL_API_KEY) {
      return res.status(500).json({ 
        error: 'FAL API key not configured. Please set FAL_API_KEY in your .env file' 
      });
    }

    const fullImagePath = path.isAbsolute(imagePath) 
      ? imagePath 
      : path.join(__dirname, '../uploads', imagePath);
    const fullAudioPath = path.isAbsolute(audioPath)
      ? audioPath
      : path.join(__dirname, '../uploads', audioPath);

    // Check if files exist
    if (!fs.existsSync(fullImagePath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }
    if (!fs.existsSync(fullAudioPath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Upload files to a temporary URL or use fal.ai file upload
    // For now, we'll need to make the files accessible via URL
    // In production, you'd upload to a CDN or use fal.ai's file upload API
    
    // Read files and convert to base64 or upload to temporary storage
    // For simplicity, we'll assume the files are accessible via local server URLs
    // In production, upload to S3/CDN first
    
    const imageUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${path.basename(fullImagePath)}`;
    const audioUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${path.basename(fullAudioPath)}`;

    // Generate video using OmniHuman v1.5
    const result = await fal.subscribe('fal-ai/bytedance/omnihuman/v1.5', {
      input: {
        image_url: imageUrl,
        audio_url: audioUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Video generation in progress...');
        }
      }
    });

    // Get the video URL
    const videoUrl = result.video?.url || result.url;
    if (!videoUrl) {
      return res.status(500).json({ error: 'Failed to get video URL from API' });
    }

    // Download the video file
    const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });
    const outputPath = path.join(__dirname, '../uploads', `video-${Date.now()}.mp4`);
    const writer = fs.createWriteStream(outputPath);
    
    videoResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    res.json({
      success: true,
      videoPath: outputPath,
      filename: path.basename(outputPath),
      videoUrl: `/uploads/${path.basename(outputPath)}`,
      duration: 10 // OmniHuman generates 10-second videos
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ 
      error: 'Failed to create video',
      details: error.message 
    });
  }
});

router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Video file not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Failed to download video' });
    }
  });
});

module.exports = router;

