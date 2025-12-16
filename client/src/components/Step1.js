import React, { useState } from 'react';
import axios from 'axios';
import './Step1.css';

function Step1({ imageData, onComplete, setError, setLoading, loading }) {
  const [songDescription, setSongDescription] = useState('');
  const [style, setStyle] = useState('pop');
  const [vocals, setVocals] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [mp3Url, setMp3Url] = useState(null);
  const [mp3Filename, setMp3Filename] = useState(null);

  const generateLyrics = async () => {
    if (!songDescription.trim()) {
      setError('Please enter a song description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/lyrics/generate', {
        songDescription,
        style
      });

      setLyrics(response.data.lyrics);
    } catch (error) {
      console.error('Lyrics generation error:', error);
      setError(error.response?.data?.error || 'Failed to generate lyrics');
    } finally {
      setLoading(false);
    }
  };

  const generateMusic = async () => {
    if (!lyrics) {
      setError('Please generate lyrics first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/music/generate', {
        lyrics,
        title: 'Generated Song',
        style,
        vocals: vocals || undefined
      });

      setMp3Url(response.data.audioUrl);
      setMp3Filename(response.data.filename);
    } catch (error) {
      console.error('Music generation error:', error);
      setError(error.response?.data?.error || 'Failed to generate music');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (lyrics && mp3Url && mp3Filename) {
      onComplete(lyrics, mp3Url, mp3Filename);
    } else {
      setError('Please generate both lyrics and music before proceeding');
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>STEP 2</h2>
        <p>Generate Lyrics & Music</p>
      </div>

      <div className="step1-content">
        <div className="inputs-section">
          <div className="input-group">
            <div className="input-icon">
              <div className="sound-wave">🎵</div>
              <span>SUNO</span>
            </div>
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <div className="document-icon">📄</div>
              <span>LYRICS (GEMINI 3)</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <div className="input-group">
            <label>Song Description *</label>
            <textarea
              value={songDescription}
              onChange={(e) => setSongDescription(e.target.value)}
              placeholder="e.g., piano song ballad about love"
              rows={2}
            />
          </div>

          <div className="controls-section">
            <div className="control-group">
              <label>Style:</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="ballad">Ballad</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="electronic">Electronic</option>
                <option value="jazz">Jazz</option>
                <option value="country">Country</option>
              </select>
            </div>

            <div className="control-group">
              <label>Vocals (Optional):</label>
              <input
                type="text"
                value={vocals}
                onChange={(e) => setVocals(e.target.value)}
                placeholder="e.g., soft, powerful, emotional"
              />
            </div>
          </div>
        </div>

        <div className="actions-section">
          <button 
            onClick={generateLyrics} 
            disabled={loading}
            className="action-button"
          >
            {loading ? 'Generating...' : 'Generate Lyrics'}
          </button>

          {lyrics && (
            <div className="lyrics-preview">
              <h3>Generated Lyrics:</h3>
              <pre>{lyrics}</pre>
            </div>
          )}

          <button 
            onClick={generateMusic} 
            disabled={loading || !lyrics}
            className="action-button"
          >
            {loading ? 'Generating...' : 'Generate Music (MP3)'}
          </button>

          {mp3Url && (
            <div className="audio-preview">
              <h3>Generated Music:</h3>
              <audio controls src={mp3Url} />
            </div>
          )}
        </div>

        <div className="output-section">
          <div className="output-icon">
            <div className="music-note">🎶</div>
            <span>MP3 SONG</span>
          </div>
        </div>

        {lyrics && mp3Url && (
          <button 
            onClick={handleComplete}
            className="complete-button"
          >
            Continue to Step 2 →
          </button>
        )}
      </div>
    </div>
  );
}

export default Step1;

