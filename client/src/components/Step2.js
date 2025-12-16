import React, { useState } from 'react';
import axios from 'axios';
import './Step2.css';

function Step2({ imageData, mp3Filename, onComplete, setError, setLoading, loading }) {
  const [chorusUrl, setChorusUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const extractChorus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/chorus/extract', {
        audioPath: mp3Filename
      });

      setChorusUrl(response.data.chorusUrl);
    } catch (error) {
      console.error('Chorus extraction error:', error);
      setError(error.response?.data?.error || 'Failed to extract chorus');
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async () => {
    if (!chorusUrl) {
      setError('Please extract the chorus first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageFilename = imageData.filename;
      const chorusFilename = chorusUrl.split('/').pop();

      const response = await axios.post('/api/video/create', {
        imagePath: imageFilename,
        audioPath: chorusFilename
      });

      setVideoUrl(response.data.videoUrl);
    } catch (error) {
      console.error('Video creation error:', error);
      setError(error.response?.data?.error || 'Failed to create video');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (videoUrl) {
      onComplete(videoUrl);
    } else {
      setError('Please create the video first');
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>STEP 3</h2>
        <p>Extract Chorus & Create Video</p>
      </div>

      <div className="step2-content">
        <div className="inputs-section">
          <div className="input-group">
            <div className="phone-preview">
              <img src={imageData.imageUrl} alt="Generated" />
              <span>GENERATED IMAGE</span>
            </div>
          </div>

          <div className="input-group">
            <div className="audio-preview">
              <div className="music-note-large">🎶</div>
              <span>FULL SONG MP3</span>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button 
            onClick={extractChorus} 
            disabled={loading || !!chorusUrl}
            className="extract-button"
          >
            {loading ? 'Extracting Chorus...' : 'Extract 10-Second Chorus'}
          </button>

          {chorusUrl && (
            <div className="chorus-preview">
              <h3>Extracted Chorus:</h3>
              <audio controls src={chorusUrl} />
            </div>
          )}

          <button 
            onClick={createVideo} 
            disabled={loading || !chorusUrl}
            className="create-video-button"
          >
            {loading ? 'Creating Video...' : 'CREATE MUSIC VIDEO'}
          </button>
        </div>

        {videoUrl && (
          <div className="video-preview-section">
            <h3>Preview Video:</h3>
            <div className="video-container">
              <video controls src={videoUrl} />
            </div>
            <button 
              onClick={handleComplete}
              className="complete-button"
            >
              Continue to Step 3 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step2;

