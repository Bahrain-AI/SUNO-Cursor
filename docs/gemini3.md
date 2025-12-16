# Google Gemini 3 API Documentation

## Overview
Google Gemini is a family of multimodal AI models that can understand and generate text, images, audio, and video content.

## Base URL
- **API Base**: `https://generativelanguage.googleapis.com/v1beta`
- **Documentation**: https://ai.google.dev/gemini-api/docs

## Authentication
Requires Google API key:
```
X-Goog-Api-Key: YOUR_GEMINI_API_KEY
```

Or use the `@google/generative-ai` SDK:
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
```

## Generate Content

### Using SDK (Recommended)

```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
```

### REST API

#### Endpoint
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
```

#### Request
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

#### Response
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Generated text response..."
          }
        ]
      }
    }
  ]
}
```

## Available Models
- `gemini-1.5-pro`: Latest and most capable model
- `gemini-1.5-flash`: Faster, optimized for speed
- `gemini-pro`: Previous generation

## Parameters
- `temperature` (float, 0-1): Controls randomness (default: 0.7)
- `topK` (integer): Number of top tokens to consider (default: 40)
- `topP` (float, 0-1): Nucleus sampling threshold (default: 0.95)
- `maxOutputTokens` (integer): Maximum tokens in response (default: 2048)

## Use Cases for Music Video Generator
1. **Lyrics Generation**: Generate creative song lyrics based on prompts
2. **Song Descriptions**: Convert user descriptions into structured lyrics
3. **Style Analysis**: Analyze and describe music styles

## Example: Generate Lyrics

```javascript
const prompt = `Create engaging song lyrics for a ${style} song about ${topic}.
Include verses, a chorus, and make it suitable for a modern song.
Format the lyrics clearly with line breaks.`;

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
const result = await model.generateContent(prompt);
const lyrics = result.response.text();
```

## Rate Limits
- Free tier: 15 requests per minute
- Paid tier: Higher limits based on plan
- Check Google Cloud Console for your specific quotas

## References
- Official Documentation: https://ai.google.dev/gemini-api/docs
- Node.js SDK: https://www.npmjs.com/package/@google/generative-ai
- API Reference: https://ai.google.dev/api

