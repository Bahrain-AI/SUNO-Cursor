import React from 'react';
import './Step3.css';

function Step3({ videoUrl, onReset }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'music-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>STEP 4</h2>
        <p>Download Complete Video</p>
      </div>

      <div className="step3-content">
        <div className="download-icon-container">
          <div className="folder-icon">
            <div className="download-arrow">⬇</div>
            <div className="video-icon-small">▶</div>
          </div>
        </div>

        <div className="video-display">
          <video controls src={videoUrl} />
        </div>

        <div className="download-section">
          <button onClick={handleDownload} className="download-button">
            DOWNLOAD COMPLETE VIDEO
          </button>
        </div>

        <button onClick={onReset} className="reset-button-large">
          Create Another Video
        </button>
      </div>
    </div>
  );
}

export default Step3;

