# AI Music Video Generator

An AI-powered application that generates music videos using Nano Banana Pro (image generation), Gemini 3 (lyrics), SUNO API (music), and OmniHuman v1.5 (video generation).

## Features

- **Step 1**: Generate image using Nano Banana Pro (fal.ai) with optional artist/instrument prompts
- **Step 2**: Generate lyrics using Gemini 3 and music using SUNO API (KIE)
- **Step 3**: Extract 10-second chorus using Wispr (OpenAI Whisper) + ffmpeg, then create video using OmniHuman v1.5
- **Step 4**: Download the complete music video

## Workflow

1. **Image Generation**: User provides a prompt with optional artist and instrument specifications
   - If instrument is "piano", uses first prompt style
   - If other instrument, uses second prompt style with instrument in prompt
   - Artist name can be prepended to the prompt

2. **Lyrics & Music Generation**: 
   - User describes the song (e.g., "piano song ballad about love")
   - Gemini 3 generates creative lyrics
   - SUNO API generates full song with lyrics

3. **Chorus Extraction**:
   - Uses OpenAI Whisper API (Wispr) to transcribe the song with timestamps
   - Identifies chorus section (typically middle of song)
   - Extracts 10-second clip using ffmpeg

4. **Video Generation**:
   - OmniHuman v1.5 combines the generated image with 10-second audio
   - Creates synchronized video where character movements match audio

5. **Download**: User downloads the final 10-second music video

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- FFmpeg installed on your system
- API keys for:
  - fal.ai (for Nano Banana Pro and OmniHuman v1.5)
  - Google Gemini API
  - KIE API (for SUNO)
  - OpenAI API (for Whisper transcription)

## Installation

1. Clone the repository:
```bash
cd SUNO
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
SERVER_URL=http://localhost:5000

# fal.ai API Configuration (for Nano Banana and OmniHuman)
FAL_API_KEY=your_fal_api_key_here

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# KIE API Configuration (for SUNO)
KIE_API_KEY=your_kie_api_key_here
KIE_API_BASE=https://api.kie.ai/v1/suno

# OpenAI API Configuration (for Wispr/Whisper transcription)
OPENAI_API_KEY=your_openai_api_key_here
```

4. Install FFmpeg:
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt-get install ffmpeg` or `sudo yum install ffmpeg`
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
SUNO/
├── docs/                    # API documentation
│   ├── nanobanana.md       # Nano Banana Pro API docs
│   ├── omnihuman.md        # OmniHuman v1.5 API docs
│   ├── suno_api.md         # SUNO API docs
│   └── gemini3.md          # Gemini 3 API docs
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Step components
│   │   │   ├── Step1Image.js
│   │   │   ├── Step1.js
│   │   │   ├── Step2.js
│   │   │   └── Step3.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                  # Express backend
│   ├── routes/             # API routes
│   │   ├── image.js        # Nano Banana image generation
│   │   ├── lyrics.js       # Gemini lyrics generation
│   │   ├── music.js        # SUNO music generation
│   │   ├── chorus.js       # Chorus extraction
│   │   └── video.js        # OmniHuman video creation
│   ├── uploads/            # Generated files
│   └── index.js            # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### POST /api/image/generate
Generate image using Nano Banana Pro
- Body: `{ prompt, artist?, instrument?, aspectRatio? }`

### POST /api/lyrics/generate
Generate lyrics using Gemini 3
- Body: `{ songDescription, style? }`

### POST /api/music/generate
Generate music using SUNO API (KIE)
- Body: `{ lyrics, title?, style?, vocals? }`

### POST /api/chorus/extract
Extract 10-second chorus from audio
- Body: `{ audioPath }`
- Uses OpenAI Whisper for transcription, then ffmpeg for extraction

### POST /api/video/create
Create video using OmniHuman v1.5
- Body: `{ imagePath, audioPath }`

### GET /api/video/download/:filename
Download the generated video

## Usage

1. **Generate Image**: 
   - Enter a prompt (e.g., "A person in a golden dress standing in a sunlit garden")
   - Optionally specify an artist (e.g., "Taylor Swift")
   - Optionally select an instrument (piano, guitar, etc.)
   - Click "Generate Image"

2. **Generate Lyrics & Music**: 
   - Enter song description (e.g., "piano song ballad about love")
   - Select style (pop, rock, ballad, etc.)
   - Optionally describe vocals
   - Generate lyrics, then generate music

3. **Extract Chorus & Create Video**: 
   - Click "Extract 10-Second Chorus" (uses Whisper to find chorus)
   - Click "Create Music Video" (uses OmniHuman to generate video)

4. **Download**: Download your completed 10-second music video

## API Documentation

See the `docs/` folder for detailed API documentation:
- `docs/nanobanana.md` - Nano Banana Pro API
- `docs/omnihuman.md` - OmniHuman v1.5 API
- `docs/suno_api.md` - SUNO API (KIE)
- `docs/gemini3.md` - Gemini 3 API

## Notes

- The chorus extraction uses OpenAI Whisper API to identify the chorus section
- OmniHuman v1.5 works best with 10-second audio clips
- Generated files are stored in `server/uploads/`
- Image generation supports 9:16 aspect ratio (mobile format) by default
- All API calls are async and may take time to complete

## Troubleshooting

### FFmpeg not found
Make sure FFmpeg is installed and available in your system PATH:
```bash
ffmpeg -version
```

### API Errors
- Check that all API keys are correctly set in the `.env` file
- Verify API endpoints match the documentation in `docs/`
- Check the server console for detailed error messages
- Ensure you have sufficient API credits/quota

### Chorus Extraction Issues
- Ensure OpenAI API key is set for Whisper transcription
- If transcription fails, the system falls back to using the middle 10 seconds of the song
- Check that audio files are in supported formats (mp3, wav, etc.)

### Video Generation Issues
- OmniHuman requires images with clear human figures
- Ensure image and audio files are accessible (may need to upload to CDN in production)
- Check fal.ai dashboard for rate limits and quotas

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Set `PORT` in `.env`
- Frontend: Set `PORT` environment variable before running `npm start`

## License

MIT
