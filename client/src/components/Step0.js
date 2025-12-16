import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './Step0.css';

function Step0({ onComplete, setError, setLoading }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = URL.createObjectURL(file);
      onComplete(file, imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  }, [onComplete, setError, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>STEP 0</h2>
        <p>Upload your 9:16 image</p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="phone-icon">
          <div className="phone-screen">
            <div className="banana-icon">🍌</div>
            <div className="aspect-ratio">9:16</div>
          </div>
        </div>
        {isDragActive ? (
          <p className="dropzone-text">Drop the image here...</p>
        ) : (
          <p className="dropzone-text">
            Drag & drop an image here, or click to select
          </p>
        )}
      </div>
    </div>
  );
}

export default Step0;

