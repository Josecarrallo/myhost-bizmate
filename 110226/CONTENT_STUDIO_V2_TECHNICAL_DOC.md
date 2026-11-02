# Content Studio V2 - Technical Documentation

**Date:** November 2, 2026
**Status:** Production Ready
**Last Update:** Commit `5ae6171`

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Current Capabilities](#current-capabilities)
4. [File Structure](#file-structure)
5. [API Flow](#api-flow)
6. [Security](#security)
7. [Video Models Comparison](#video-models-comparison)
8. [Remotion Configuration](#remotion-configuration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Roadmap](#roadmap)
12. [Commands Reference](#commands-reference)

---

## Overview

Content Studio V2 is the AI-powered video generation module for MY HOST BizMate. It allows property owners to create professional promotional videos from photos using:

- **MuAPI** - Access to Google Veo 3.1 for image-to-video generation
- **OpenAI GPT-4o Vision** - Intelligent prompt enhancement
- **Remotion Lambda** - Server-side video rendering and export

### Key Features

- Upload 1-2 photos and get an 8-second cinematic video
- AI analyzes photos and creates optimal movement prompts
- Multiple aspect ratios for different platforms
- Background music library
- Direct MP4 export

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ContentStudioV2.jsx                                         │  │
│  │  - Photo upload UI                                           │  │
│  │  - Aspect ratio selection                                    │  │
│  │  - Music selection                                           │  │
│  │  - Generation progress                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  contentStudioV2Service.js                                   │  │
│  │  - generateVideoClip(imageUrl, prompt, options)              │  │
│  │  - enhancePromptWithVision(photos)                           │  │
│  │  - uploadBase64ToPublicUrl(base64, userId)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                     SUPABASE EDGE FUNCTIONS                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ai-proxy Edge Function                                      │  │
│  │  - /generate-clip → MuAPI (Veo 3.1)                         │  │
│  │  - /enhance-prompt → OpenAI GPT-4o Vision                   │  │
│  │  - Securely stores MUAPI_KEY and OPENAI_API_KEY             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Supabase Storage                                            │  │
│  │  - content-studio bucket (public)                            │  │
│  │  - Stores uploaded photos                                    │  │
│  │  - Uses user.id for path (NOT 'temp')                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                          MuAPI (External)                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Veo 3.1 Image-to-Video                                      │  │
│  │  - image_url: Start frame (required)                        │  │
│  │  - last_image: End frame (optional, for transitions)        │  │
│  │  - prompt: Movement instructions                             │  │
│  │  - Output: 8-second video clip                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                      VIDEO SERVER (Railway)                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  server.cjs (port 3001)                                      │  │
│  │  - POST /api/export-slideshow                                │  │
│  │  - GET /api/export-progress/:jobId                          │  │
│  │  - GET /api/download-video/:jobId                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  export-slideshow.cjs                                        │  │
│  │  - Uploads base64 images to S3                               │  │
│  │  - Calls Remotion Lambda for rendering                       │  │
│  │  - Polls progress and returns video URL                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                        AWS (Remotion Lambda)                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Lambda Function: remotion-render-4-0-424-mem3008mb-...     │  │
│  │  - Renders PropertyPromo composition                         │  │
│  │  - Uses forceDurationInFrames for exact duration            │  │
│  │  - Outputs to S3 bucket                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  S3 Bucket: remotionlambda-useast1-1w04idkkha               │  │
│  │  - /sites/myhost-bizmate-video/ (Remotion bundle)           │  │
│  │  - /renders/{renderId}/out.mp4 (Final videos)               │  │
│  │  - /exports/ (Uploaded images)                               │  │
│  │  - Music files: bali-sunrise.mp3, background-music.mp3      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Current Capabilities

### Working Features

| Feature | Status | Notes |
|---------|--------|-------|
| Single photo upload | ✅ | Generates 8-sec video |
| Two photo upload | ✅ | Start frame → End frame transition |
| Aspect ratio 9:16 | ✅ | Vertical (Instagram/TikTok) |
| Aspect ratio 16:9 | ✅ | Horizontal (YouTube/Website) |
| Aspect ratio 1:1 | ✅ | Square (Instagram Feed) |
| Background music | ✅ | 5 tracks available |
| OpenAI prompt enhancement | ✅ | GPT-4o Vision analyzes photos |
| Remotion Lambda export | ✅ | v4.0.424 |
| Secure API keys | ✅ | Via Supabase Edge Functions |

### Music Tracks Available

| Track ID | File | Style |
|----------|------|-------|
| ambient | bali-sunrise.mp3 | Calm, nature |
| upbeat | bali-sunrise.mp3 | Energetic |
| cinematic | background-music.mp3 | Epic, dramatic |
| tropical | bali-sunrise.mp3 | Beach vibes |
| lofi | background-music.mp3 | Chill, relaxed |

---

## File Structure

```
myhost-bizmate/
├── src/
│   ├── components/
│   │   └── ContentStudioV2/
│   │       └── ContentStudioV2.jsx      # Main UI component (~600 lines)
│   └── services/
│       └── contentStudioV2Service.js    # API service (~700 lines)
│
└── video/                               # Separate Remotion project
    ├── server.cjs                       # Express server for Railway
    ├── export-slideshow.cjs             # Remotion Lambda integration
    ├── package.json                     # @remotion/lambda v4.0.424
    └── src/
        ├── Root.tsx                     # Remotion compositions
        ├── PropertyPromo.tsx            # Main video composition
        ├── index.tsx                    # Entry point
        └── ...                          # Other compositions
```

---

## API Flow

### 1. Photo Upload & Video Generation

```javascript
// ContentStudioV2.jsx
const handleGenerate = async () => {
  // 1. Upload photos to Supabase Storage
  const uploadedUrls = await uploadPhotosToStorage(photos);

  // 2. Enhance prompt with OpenAI Vision
  const enhancedPrompt = await enhancePromptWithVision(uploadedUrls);

  // 3. Generate video with MuAPI (via ai-proxy)
  const result = await generateVideoClip(
    uploadedUrls[0].publicUrl,      // Start frame
    enhancedPrompt,
    {
      aspectRatio: '16:9',
      userId: userData.id,
      lastImageUrl: uploadedUrls[1]?.publicUrl  // End frame (optional)
    }
  );

  // 4. Video URL returned from MuAPI
  setScenes([{ clipUrl: result.videoUrl, duration: 8 }]);
};
```

### 2. Export to MP4

```javascript
// ContentStudioV2.jsx
const handleExport = async () => {
  // 1. Call video server
  const response = await fetch('https://railway-url/api/export-slideshow', {
    method: 'POST',
    body: JSON.stringify({
      scenes: scenes,
      settings: { music: { track: 'ambient', volume: 0.7 } },
      totalDuration: 8
    })
  });

  // 2. Get job ID and poll progress
  const { jobId } = await response.json();

  // 3. Poll until complete
  while (true) {
    const progress = await fetch(`/api/export-progress/${jobId}`);
    if (progress.status === 'completed') {
      setVideoUrl(progress.videoUrl);
      break;
    }
  }
};
```

---

## Security

### API Key Protection

All sensitive API keys are stored in Supabase Edge Functions, NOT in frontend code:

| Key | Location | Used By |
|-----|----------|---------|
| MUAPI_KEY | Supabase Edge Function `ai-proxy` | MuAPI Veo 3.1 |
| OPENAI_API_KEY | Supabase Edge Function `ai-proxy` | GPT-4o Vision |
| AWS credentials | Railway environment | Remotion Lambda |

### Authentication Flow

1. User must be logged in (Supabase Auth)
2. Frontend sends `Authorization: Bearer {access_token}` to ai-proxy
3. ai-proxy validates session before calling external APIs
4. Storage uploads use `user.id` for path (NOT 'temp' fallback)

---

## Video Models Comparison

| Model | Duration | Quality | API | Cost/Video | Notes |
|-------|----------|---------|-----|------------|-------|
| **Veo 3.1** (current) | 8 sec | ⭐⭐⭐⭐⭐ | MuAPI | ~$0.50 | Best for property |
| Runway Gen-3 Alpha | 10 sec | ⭐⭐⭐⭐⭐ | Direct | ~$0.50 | Alternative |
| Kling 2.0 | 5-10 sec | ⭐⭐⭐⭐ | Direct | ~$0.30 | Good value |
| Luma Dream Machine | 5 sec | ⭐⭐⭐⭐ | Direct | ~$0.30 | Fast |
| Minimax Video-01 | 6 sec | ⭐⭐⭐⭐ | Direct | ~$0.25 | Budget |
| Hailuo AI | 6 sec | ⭐⭐⭐⭐ | Direct | ~$0.20 | Budget |
| Pika 2.0 | 5 sec | ⭐⭐⭐ | Direct | ~$0.20 | Basic |

**Note:** TikTok/ByteDance models (Jimeng AI, PixelDance) are NOT publicly available.

**Recommendation:** Keep Veo 3.1 as primary. For longer videos, use multi-clip stitching with Remotion.

---

## Remotion Configuration

### Lambda Function

```
Name: remotion-render-4-0-424-mem3008mb-disk10240mb-300sec
Region: us-east-1
Memory: 3008 MB
Timeout: 300 seconds
Disk: 10240 MB
```

### Compositions

| ID | Dimensions | FPS | Use Case |
|----|------------|-----|----------|
| PropertyPromo | 1080x1920 | 30 | Vertical (9:16) |
| PropertyPromoHorizontal | 1920x1080 | 30 | Horizontal (16:9) |
| PropertyPromoSquare | 1080x1080 | 30 | Square (1:1) |

### Duration Control

```javascript
// export-slideshow.cjs
const { bucketName, renderId } = await renderMediaOnLambda({
  // ...
  forceDurationInFrames: totalFrames,  // v4.0.424 official parameter
  // NOT durationInFrames (deprecated)
});
```

---

## Deployment

### Video Server (Railway)

```bash
# Environment variables required:
REMOTION_AWS_ACCESS_KEY_ID=xxx
REMOTION_AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
PORT=3001

# Start command:
cd video && node server.cjs
```

### Remotion Lambda

```bash
# Deploy new Lambda function
cd video
npx remotion lambda functions deploy \
  --memory=3008 \
  --timeout=300 \
  --disk=10240 \
  --region=us-east-1 \
  --yes

# Deploy/update Remotion site
npx remotion lambda sites create src/index.tsx \
  --site-name=myhost-bizmate-video

# Verify deployment
npx remotion lambda functions ls
npx remotion lambda sites ls
```

### S3 Music Files

Music files must be public:

```bash
aws s3 cp bali-sunrise.mp3 s3://remotionlambda-useast1-1w04idkkha/music/ --acl public-read
aws s3 cp background-music.mp3 s3://remotionlambda-useast1-1w04idkkha/music/ --acl public-read
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Video stuck at 39% | Lambda version mismatch | Deploy matching Lambda version |
| 403 on music files | S3 permissions | Re-upload with `--acl public-read` |
| Second photo "invented" | `last_image` not sent | Pass `lastImageUrl` to MuAPI |
| Video duration wrong | Wrong parameter | Use `forceDurationInFrames` (v4.0.424) |
| Export timeout | Lambda timeout | Increase timeout to 300s |

### Debug Commands

```bash
# Check Lambda functions
cd video && npx remotion lambda functions ls

# Check S3 sites
cd video && npx remotion lambda sites ls

# Test S3 permissions
curl -I https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/music/bali-sunrise.mp3

# Check video server logs
# (Railway dashboard → Logs)
```

---

## Roadmap

### Phase 1 - Current (Complete)

- [x] Basic video generation with Veo 3.1
- [x] Two-image transitions
- [x] Aspect ratio support
- [x] Background music
- [x] Remotion Lambda export
- [x] Security hardening (ai-proxy)

### Phase 2 - Voice Over (Next)

- [ ] Integrate TTS (ElevenLabs or OpenAI TTS)
- [ ] Use Gita's PROMPT LIST OPTION voice scripts
- [ ] Sync voice with video scenes
- [ ] Multiple language support

### Phase 3 - Enhanced Features

- [ ] Additional music from Gita's Google Drive
- [ ] Multi-clip workflow UI for longer videos
- [ ] Text overlay customization
- [ ] Video preview before export

### Phase 4 - Architecture

- [ ] Migrate video server from Railway to S3/Lambda
- [ ] Performance optimizations
- [ ] Cost optimization (caching, CDN)

---

## Commands Reference

```bash
# Development
cd video && node server.cjs          # Start video server locally
npm run dev                          # Start main app

# Remotion
cd video && npx remotion preview     # Preview compositions
cd video && npx remotion render PropertyPromo out.mp4  # Local render

# Lambda
cd video && npx remotion lambda functions deploy --memory=3008 --timeout=300 --disk=10240 --region=us-east-1 --yes
cd video && npx remotion lambda sites create src/index.tsx --site-name=myhost-bizmate-video
cd video && npx remotion lambda functions ls
cd video && npx remotion lambda sites ls

# S3
aws s3 ls s3://remotionlambda-useast1-1w04idkkha/
aws s3 cp file.mp3 s3://remotionlambda-useast1-1w04idkkha/music/ --acl public-read
```

---

## Related Documents

- `110226/GITA_CONTENT_STUDIO_V2_TESTING.md` - Testing instructions for Gita
- `110226/PROMPT LIST OPTION.pdf` - Gita's voice over scripts (17 scenes)
- `CLAUDE.md` - Main project documentation

---

*Last updated: November 2, 2026*
