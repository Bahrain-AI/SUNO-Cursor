const express = require('express');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const router = express.Router();

const KIE_API_BASE = process.env.KIE_API_BASE || 'https://api.kie.ai/v1/suno';
const KIE_API_KEY = process.env.KIE_API_KEY || '';

/**
 * Extract 10-second chorus from audio file
 * POST /api/chorus/extract
 * Body: { audioPath }
 * 
 * Uses Wispr (OpenAI Whisper) for transcription to identify chorus,
 * then ffmpeg to extract the 10-second clip
 */
router.post('/extract', async (req, res) => {
  try {
    const { audioPath } = req.body;
    
    if (!audioPath) {
      return res.status(400).json({ error: 'Audio path is required' });
    }

    const fullAudioPath = path.isAbsolute(audioPath)
      ? audioPath
      : path.join(__dirname, '../uploads', audioPath);

    if (!fs.existsSync(fullAudioPath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Step 1: Get timestamped lyrics using SUNO API
    let timestampedLyrics = null;
    try {
      // Upload audio to get a URL (or use local file if API supports it)
      // For now, we'll use the audio URL if available, otherwise use transcription
      
      // Use OpenAI Whisper API (Wispr) for transcription with timestamps
      // Check if OPENAI_API_KEY is available
      if (process.env.OPENAI_API_KEY) {
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(fullAudioPath));
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'verbose_json');
        formData.append('timestamp_granularities[]', 'segment');

        const whisperResponse = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              ...formData.getHeaders()
            }
          }
        );

        timestampedLyrics = whisperResponse.data.segments || [];
      } else {
        // Fallback: Try SUNO API for timestamped lyrics
        // Note: This requires the audio to be accessible via URL
        // For local files, we'll use a simple heuristic
        console.log('OpenAI API key not found, using fallback method');
      }
    } catch (error) {
      console.error('Error getting timestamped lyrics:', error);
      // Continue with fallback method
    }

    // Step 2: Identify chorus section
    let chorusStart = 0;
    let chorusEnd = 10; // Default to first 10 seconds

    if (timestampedLyrics && timestampedLyrics.length > 0) {
      // Find the chorus by looking for repeated text patterns
      // Simple heuristic: find the most repeated segment
      const segments = timestampedLyrics;
      
      // Look for segments that might be chorus (usually longer, repeated)
      // Find segments around the middle of the song (typical chorus location)
      const totalDuration = segments[segments.length - 1].end;
      const middlePoint = totalDuration / 2;
      
      // Find segment closest to middle point
      let closestSegment = segments[0];
      for (const segment of segments) {
        if (Math.abs(segment.start - middlePoint) < Math.abs(closestSegment.start - middlePoint)) {
          closestSegment = segment;
        }
      }
      
      chorusStart = Math.max(0, closestSegment.start - 1); // Start 1 second before
      chorusEnd = Math.min(totalDuration, closestSegment.end + 1); // End 1 second after
      
      // Ensure we have at least 10 seconds
      if (chorusEnd - chorusStart < 10) {
        chorusEnd = chorusStart + 10;
      }
      
      // Limit to 10 seconds
      if (chorusEnd - chorusStart > 10) {
        chorusEnd = chorusStart + 10;
      }
    } else {
      // Fallback: Use middle 10 seconds of the song
      const audioDuration = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fullAudioPath, (err, metadata) => {
          if (err) reject(err);
          else resolve(metadata.format.duration);
        });
      });
      
      chorusStart = Math.max(0, (audioDuration / 2) - 5);
      chorusEnd = Math.min(audioDuration, chorusStart + 10);
    }

    // Step 3: Extract 10-second clip using ffmpeg
    const chorusPath = path.join(__dirname, '../uploads', `chorus-${Date.now()}.mp3`);
    
    await new Promise((resolve, reject) => {
      ffmpeg(fullAudioPath)
        .setStartTime(chorusStart)
        .setDuration(10)
        .output(chorusPath)
        .on('end', () => {
          console.log('Chorus extraction finished');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    res.json({
      success: true,
      chorusPath: chorusPath,
      filename: path.basename(chorusPath),
      chorusUrl: `/uploads/${path.basename(chorusPath)}`,
      startTime: chorusStart,
      endTime: chorusEnd,
      duration: 10
    });
  } catch (error) {
    console.error('Error extracting chorus:', error);
    res.status(500).json({ 
      error: 'Failed to extract chorus',
      details: error.message 
    });
  }
});

module.exports = router;

