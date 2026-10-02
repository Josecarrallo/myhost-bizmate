# Content Studio V2 - AI Video Generator

## Overview

Content Studio V2 is a new video generation module following Gita's definitive product model:
**OpenAI + MuAPI + Remotion**

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT STUDIO V2                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. UPLOAD (2-3 photos)                                          │
│     └── Drag & drop / file picker                                │
│     └── Preview grid with reordering                             │
│                                                                   │
│  2. PROMPT                                                        │
│     └── User writes description                                  │
│     └── Quick templates available                                │
│     └── Format selection (9:16, 16:9, 1:1)                       │
│                                                                   │
│  3. GENERATION                                                    │
│     ├── OpenAI Vision → Analyze images                           │
│     ├── OpenAI → Improve prompt                                  │
│     └── MuAPI → Generate video clips (Kling/Wan 2.1)            │
│                                                                   │
│  4. EDITOR                                                        │
│     ├── Remotion Player preview                                  │
│     ├── Timeline with clips                                      │
│     ├── Controls:                                                │
│     │   ├── Text overlay (title, subtitle)                       │
│     │   ├── AI Voice-over (OpenAI TTS)                          │
│     │   ├── Background music                                     │
│     │   └── Logo watermark                                       │
│     └── Clip regeneration                                        │
│                                                                   │
│  5. EXPORT                                                        │
│     └── Remotion Lambda → MP4                                    │
│     └── Save to Supabase Storage                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Files

- `ContentStudioV2.jsx` - Main React component (~1100 lines)
- `contentStudioV2Service.js` - Service layer for API calls
- `create_video_projects_table.sql` - Supabase schema

## API Keys Required

Add to `.env`:

```env
VITE_OPENAI_API_KEY=sk-...        # OpenAI API key
VITE_MUAPI_API_KEY=mu-...         # MuAPI API key
VITE_REMOTION_RENDER_URL=https://...  # Remotion Lambda endpoint
VITE_REMOTION_STATUS_URL=https://...  # Remotion status endpoint
```

## Supabase Setup

1. Run `create_video_projects_table.sql` in Supabase SQL Editor
2. Create storage bucket `content-studio` (public)
3. Configure storage policies per the SQL file

## Data Model

```json
{
  "id": "uuid",
  "tenant_id": "uuid",
  "name": "string",
  "status": "draft | processing | ready | exported | failed",
  "format": "9:16 | 16:9 | 1:1",
  "prompt": "string",
  "improved_prompt": "string",
  "settings": {
    "text": { "enabled": true, "title": "", "subtitle": "", "position": "bottom" },
    "voice": { "enabled": false, "script": "", "voice": "alloy" },
    "music": { "enabled": true, "track": "ambient", "volume": 0.7 },
    "logo": { "enabled": false, "url": "", "position": "bottom-right" },
    "subtitles": { "enabled": false, "language": "en" }
  },
  "scenes": [
    {
      "id": "scene-0",
      "photoId": "string",
      "photoUrl": "string",
      "photoPath": "string",
      "clipTaskId": "string",
      "clipUrl": "string",
      "duration": 5,
      "status": "processing | ready | failed"
    }
  ],
  "render_id": "string",
  "render_status": "string",
  "output_url": "string"
}
```

## Development Order (per Gita)

1. ✅ Upload screen for 2-3 photos
2. ✅ Prompt field
3. ✅ Basic editor UI with mock clips
4. ⏳ Remotion Player preview (next)
5. ✅ Clip reordering and regeneration controls
6. ✅ Text, voice, music, logo controls
7. ⏳ Remotion server-side MP4 export
8. ✅ Supabase project storage
9. ✅ Connect OpenAI (service ready)
10. ✅ Connect MuAPI (service ready)

## Usage

Access via Autopilot menu → "Content Studio (AI Video) II"

The module works in demo mode without API keys (mock generation).
With API keys, it uses real OpenAI and MuAPI services.

## Cost Estimates

- **MuAPI (Kling Pro)**: ~$0.35 per 5-second clip
- **OpenAI Vision**: ~$0.01 per image analysis
- **OpenAI TTS**: ~$0.015 per minute of audio
- **Remotion Lambda**: ~$0.05 per render

Total per video (3 clips, voice-over): ~$1.20

## Next Steps

1. Add Remotion Player component for real preview
2. Connect to Remotion Lambda for MP4 export
3. Add clip reordering drag-and-drop
4. Add music library selection
5. Add logo upload functionality
