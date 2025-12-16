# SUNO API Documentation

## Overview
The SUNO API enables you to create high-quality AI-generated music, lyrics, and audio content using state-of-the-art AI models.

## Base URL
- **API Base**: `https://api.kie.ai/v1/suno`
- **Documentation**: https://docs.kie.ai/suno-api

## Authentication
Requires KIE API key in the `Authorization` header:
```
Authorization: Bearer YOUR_KIE_API_KEY
```

## Generate Music

### Endpoint
```
POST /generate
```

### Request
```json
{
  "prompt": "Your song description or lyrics here",
  "title": "Song Title",
  "tags": "pop, energetic",
  "make_instrumental": false,
  "wait_audio": true
}
```

### Parameters
- `prompt` (string, required): Song description or lyrics
- `title` (string, optional): Title of the song
- `tags` (string, optional): Comma-separated tags for style (e.g., "pop", "rock", "ballad")
- `make_instrumental` (boolean, optional): Generate instrumental only (default: false)
- `wait_audio` (boolean, optional): Wait for audio generation to complete (default: true)

### Response
```json
{
  "task_id": "task_123456",
  "status": "completed",
  "audio_url": "https://cdn.kie.ai/audio/...",
  "duration": 120.5,
  "lyrics": "..."
}
```

## Get Music Task Details

### Endpoint
```
GET /task/{task_id}
```

### Response
```json
{
  "task_id": "task_123456",
  "status": "completed",
  "audio_url": "https://cdn.kie.ai/audio/...",
  "duration": 120.5,
  "lyrics": "...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Extend Music

### Endpoint
```
POST /extend
```

### Request
```json
{
  "audio_url": "https://example.com/audio.mp3",
  "prompt": "Continue the song with..."
}
```

## Upload and Cover Audio

### Endpoint
```
POST /upload-and-cover
```

### Request
```json
{
  "audio_file": "base64_encoded_audio_or_url",
  "style": "pop"
}
```

## Get Timestamped Lyrics

### Endpoint
```
POST /get-timestamped-lyrics
```

### Request
```json
{
  "audio_url": "https://example.com/audio.mp3"
}
```

### Response
```json
{
  "lyrics": [
    {
      "text": "Verse 1",
      "start": 0.0,
      "end": 10.5
    },
    {
      "text": "Chorus",
      "start": 10.5,
      "end": 20.5
    }
  ]
}
```

## Callbacks
The API supports webhook callbacks for async operations. Configure callback URLs in your API settings.

## Rate Limits
Check KIE API dashboard for your specific rate limits and quotas.

## References
- Full Documentation: https://docs.kie.ai/suno-api/quickstart
- API Reference: https://docs.kie.ai/suno-api

