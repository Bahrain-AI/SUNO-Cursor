import React, { useState } from 'react';
import axios from 'axios';
import './Step1Image.css';

function Step1Image({ onComplete, setError, setLoading, loading }) {
  const [prompt, setPrompt] = useState('');
  const [artist, setArtist] = useState('');
  const [instrument, setInstrument] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [generatedImage, setGeneratedImage] = useState(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter an image prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/image/generate', {
        prompt,
        artist: artist || undefined,
        instrument: instrument || undefined,
        aspectRatio
      });

      setGeneratedImage(response.data);
    } catch (error) {
      console.error('Image generation error:', error);
      setError(error.response?.data?.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (generatedImage) {
      onComplete(generatedImage);
    } else {
      setError('Please generate an image first');
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>STEP 1</h2>
        <p>Generate Image</p>
      </div>

      <div className="step1-content">
        <div className="input-section">
          <div className="input-group">
            <label>Image Prompt *</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A person in a golden dress standing in a sunlit garden"
              rows={3}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Artist (Optional)</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g., Taylor Swift"
              />
            </div>

            <div className="input-group">
              <label>Instrument (Optional)</label>
              <select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
                <option value="">None</option>
                <option value="piano">Piano</option>
                <option value="guitar">Guitar</option>
                <option value="violin">Violin</option>
                <option value="drums">Drums</option>
                <option value="saxophone">Saxophone</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Aspect Ratio</label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              <option value="9:16">9:16 (Mobile/Portrait)</option>
              <option value="16:9">16:9 (Landscape)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>

          <button 
            onClick={generateImage} 
            disabled={loading || !prompt.trim()}
            className="generate-button"
          >
            {loading ? 'Generating Image...' : 'Generate Image'}
          </button>
        </div>

        {generatedImage && (
          <div className="result-section">
            <div className="image-preview">
              <img src={generatedImage.imageUrl} alt="Generated" />
            </div>
            <button onClick={handleContinue} className="continue-button">
              Continue to Step 2 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step1Image;

