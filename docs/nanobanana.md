# Nano Banana Pro API Documentation

## Overview
Nano Banana Pro (Nano Banana 2) is Google's state-of-the-art image generation and editing model available through fal.ai.

## API Endpoint
- **Model**: `fal-ai/nano-banana-pro`
- **Base URL**: `https://fal.run/fal-ai/nano-banana-pro`

## Authentication
Requires fal.ai API key in the `Authorization` header:
```
Authorization: Key YOUR_FAL_API_KEY
```

## Text to Image Generation

### Request
```json
POST https://fal.run/fal-ai/nano-banana-pro
Content-Type: application/json
Authorization: Key YOUR_FAL_API_KEY

{
  "prompt": "Your image description here",
  "aspect_ratio": "9:16",
  "num_images": 1,
  "seed": 42
}
```

### Parameters
- `prompt` (string, required): Text description of the image to generate
- `aspect_ratio` (string, optional): Image aspect ratio. Options: "1:1", "16:9", "9:16", "4:3", "3:4"
- `num_images` (integer, optional): Number of images to generate (default: 1)
- `seed` (integer, optional): Random seed for reproducibility
- `resolution` (string, optional): Image resolution. Options: "1K", "2K"

### Response
```json
{
  "images": [
    {
      "url": "https://fal.ai/files/...",
      "width": 1080,
      "height": 1920
    }
  ]
}
```

## Image Editing
The model also supports image editing capabilities. See fal.ai documentation for details.

## Rate Limits
Check fal.ai dashboard for your specific rate limits and quotas.

## References
- API Documentation: https://fal.ai/models/fal-ai/nano-banana-pro/api
- Playground: https://fal.ai/models/fal-ai/nano-banana-pro/playground

