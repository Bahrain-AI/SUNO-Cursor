# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `Bahrain-AI/SUNO-Cursor`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `FAL_API_KEY` - Your fal.ai API key
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `KIE_API_KEY` - Your KIE API key (for SUNO)
   - `OPENAI_API_KEY` - Your OpenAI API key (for Whisper)
   - `SERVER_URL` - Your Vercel deployment URL (will be provided after first deploy)
   - `NODE_ENV` - `production`

6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd /Users/mohamed/SUNO
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? suno-cursor (or your choice)
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add FAL_API_KEY
vercel env add GEMINI_API_KEY
vercel env add KIE_API_KEY
vercel env add OPENAI_API_KEY
vercel env add NODE_ENV production

# Deploy to production
vercel --prod
```

## Important Notes

### Backend API Routes
The Express backend is configured to work with Vercel's serverless functions. The `vercel.json` file routes all `/api/*` requests to the Express server.

### File Storage
- **Local Development**: Files are stored in `server/uploads/`
- **Vercel**: Vercel serverless functions are stateless. For production, consider:
  - Using cloud storage (AWS S3, Cloudinary, etc.) for uploaded files
  - Using Vercel Blob Storage for temporary files
  - Or keeping files in memory for processing

### Environment Variables
After deployment, update `SERVER_URL` in Vercel dashboard to your actual deployment URL:
```
SERVER_URL=https://your-project.vercel.app
```

### API Endpoints
Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/image/generate`
- `https://your-project.vercel.app/api/lyrics/generate`
- `https://your-project.vercel.app/api/music/generate`
- `https://your-project.vercel.app/api/chorus/extract`
- `https://your-project.vercel.app/api/video/create`

### Frontend Configuration
Update `client/src/components/*.js` files to use the production API URL if needed. The current setup uses relative paths which should work with Vercel's routing.

## Troubleshooting

### Build Errors
- Ensure all dependencies are listed in `package.json`
- Check that `client/package.json` has the `vercel-build` script
- Verify Node.js version compatibility (Vercel uses Node 18.x by default)

### API Route Issues
- Check Vercel function logs in the dashboard
- Verify environment variables are set correctly
- Ensure API keys have proper permissions

### File Upload Issues
- Consider implementing cloud storage for production
- Check file size limits (Vercel has limits on request/response sizes)
- Use streaming for large files

## Next Steps

1. Deploy to Vercel using one of the methods above
2. Test all API endpoints
3. Update `SERVER_URL` environment variable with your deployment URL
4. Configure custom domain (optional)
5. Set up monitoring and error tracking

