# OmniHuman v1.5 API Documentation

## Overview
OmniHuman v1.5 is Bytedance's image-to-video model that generates videos using an image of a human figure paired with an audio file. It produces vivid, high-quality videos where the character's emotions and movements sync with the audio.

## API Endpoint
- **Model**: `fal-ai/bytedance/omnihuman/v1.5`
- **Base URL**: `https://fal.run/fal-ai/bytedance/omnihuman/v1.5`

## Authentication
Requires fal.ai API key in the `Authorization` header:
```
Authorization: Key YOUR_FAL_API_KEY
```

## Image + Audio to Video Generation

### Request
```json
POST https://fal.run/fal-ai/bytedance/omnihuman/v1.5
Content-Type: application/json
Authorization: Key YOUR_FAL_API_KEY

{
  "image_url": "https://example.com/image.jpg",
  "audio_url": "https://example.com/audio.mp3"
}
```

### Parameters
- `image_url` (string, required): URL of the image file (must be a human figure)
  - Accepted formats: jpg, jpeg, png, webp, gif, avif
  - Can also be a direct file upload
- `audio_url` (string, required): URL of the audio file
  - Accepted formats: mp3, ogg, wav, m4a, aac
  - Recommended: 10-second audio clips for best results
  - Can also be a direct file upload

### Response
```json
{
  "video": {
    "url": "https://fal.ai/files/...",
    "width": 1080,
    "height": 1920,
    "duration": 10.0
  }
}
```

## Best Practices
1. Use high-quality images with clear human figures
2. Audio clips should be 10 seconds or less for optimal results
3. Ensure the image aspect ratio matches your desired video output (9:16 recommended)
4. The model works best with clear, well-lit images

## Rate Limits
Check fal.ai dashboard for your specific rate limits and quotas.

## References
- API Documentation: https://fal.ai/models/fal-ai/bytedance/omnihuman/v1.5/api
- Playground: https://fal.ai/models/fal-ai/bytedance/omnihuman/v1.5/playground

