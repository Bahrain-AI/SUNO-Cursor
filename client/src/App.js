import React, { useState } from 'react';
import './App.css';
import Step1Image from './components/Step1Image';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageData, setImageData] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [mp3Url, setMp3Url] = useState(null);
  const [mp3Filename, setMp3Filename] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStep1ImageComplete = (generatedImageData) => {
    setImageData(generatedImageData);
    setCurrentStep(2);
  };

  const handleStep1Complete = (generatedLyrics, generatedMp3Url, filename) => {
    setLyrics(generatedLyrics);
    setMp3Url(generatedMp3Url);
    setMp3Filename(filename);
    setCurrentStep(3);
  };

  const handleStep2Complete = (generatedVideoUrl) => {
    setVideoUrl(generatedVideoUrl);
    setCurrentStep(4);
  };

  const reset = () => {
    setCurrentStep(1);
    setImageData(null);
    setLyrics('');
    setMp3Url(null);
    setMp3Filename(null);
    setVideoUrl(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI MUSIC VIDEO GENERATOR</h1>
      </header>
      
      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {currentStep === 1 && (
          <Step1Image 
            onComplete={handleStep1ImageComplete}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
          />
        )}

        {currentStep === 2 && (
          <Step1 
            imageData={imageData}
            onComplete={handleStep1Complete}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <Step2 
            imageData={imageData}
            mp3Filename={mp3Filename}
            onComplete={handleStep2Complete}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
          />
        )}

        {currentStep === 4 && (
          <Step3 
            videoUrl={videoUrl}
            onReset={reset}
          />
        )}

        {currentStep > 1 && currentStep < 4 && (
          <button className="reset-button" onClick={reset}>
            Start Over
          </button>
        )}
      </main>
    </div>
  );
}

export default App;


