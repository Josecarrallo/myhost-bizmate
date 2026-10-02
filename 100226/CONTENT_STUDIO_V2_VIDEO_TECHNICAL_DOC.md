# Content Studio V2 - Video Generation System
## Technical Documentation - October 2, 2026

---

## 1. PROJECT OVERVIEW

Content Studio V2 is a video generation system that creates promotional videos for vacation rental properties. It combines AI-generated video clips (with motion effects like water movement) with static photos to produce professional MP4 videos.

### Core Technologies
- **Frontend:** React 18.2 + Vite (ContentStudioV2.jsx)
- **Video Server:** Node.js + Express (video/server.cjs)
- **AI Video Generation:** MuAPI Veo 3.1 (Seedance 2.5 model)
- **Video Rendering:** Remotion Lambda (AWS)
- **Storage:** AWS S3 + Supabase
- **Database:** Supabase PostgreSQL (video_projects table)

---

## 2. ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  src/components/ContentStudioV2/ContentStudioV2.jsx             │
│  - Photo upload                                                  │
│  - AI video generation (MuAPI)                                   │
│  - Preview with Remotion Player                                  │
│  - Export to MP4                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VIDEO SERVER                                │
│  video/server.cjs (localhost:3001)                              │
│  - /api/generate-video-veo → MuAPI Veo 3.1                      │
│  - /api/export-slideshow → Remotion Lambda                      │
│  - /api/export-progress/:jobId → Polling                        │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│       MuAPI             │     │    Remotion Lambda      │
│  (AI Video Generation)  │     │   (Video Rendering)     │
│  - Seedance 2.5 model   │     │   - PropertyPromo.tsx   │
│  - ~7 min processing    │     │   - AWS Lambda          │
│  - 8 sec video clips    │     │   - S3 output           │
│  - Water/motion effects │     │   - Music overlay       │
└─────────────────────────┘     └─────────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS S3 STORAGE                              │
│  remotionlambda-useast1-1w04idkkha                              │
│  - /exports/ → Generated images                                  │
│  - /renders/ → Final MP4 videos                                  │
│  - /sites/myhost-bizmate-video/ → Music files (ambient, etc)    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE                                    │
│  Table: video_projects                                           │
│  - id, name, tenant_id                                           │
│  - scenes (JSON with photoUrl, clipUrl, duration)                │
│  - settings (music, text overlay)                                │
│  - output_url (final MP4 URL)                                    │
│  - status (draft/exported)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. KEY FILES

### Frontend
| File | Description |
|------|-------------|
| `src/components/ContentStudioV2/ContentStudioV2.jsx` | Main component - photo upload, AI generation, export |
| `src/components/ContentStudioV2/VideoExporter.jsx` | Standalone export component (alternative) |
| `src/components/ContentStudioV2/remotion/PropertyPromo.jsx` | Remotion preview player |
| `src/services/contentStudioV2Service.js` | Supabase CRUD for video_projects |

### Video Server
| File | Description |
|------|-------------|
| `video/server.cjs` | Main server (port 3001) |
| `video/export-slideshow.cjs` | Remotion Lambda export logic |
| `video/src/PropertyPromo.tsx` | Remotion composition for rendering |
| `video/src/Root.tsx` | Remotion composition registry |

### Configuration
| File | Description |
|------|-------------|
| `video/.env` | API keys (MUAPI_TOKEN, AWS credentials) |
| `video/remotion.config.mjs` | Remotion configuration |
| `video/package.json` | Dependencies (@remotion/*, express) |

---

## 4. DATA FLOW

### 4.1 AI Video Generation (MuAPI)
```
User clicks "Generate AI Video"
        │
        ▼
ContentStudioV2.jsx → handleGenerate()
        │
        ▼
POST /api/generate-video-veo
{
  imageUrl: "https://...",  // Photo URL
  prompt: "water gently moving..." // AI prompt
}
        │
        ▼
MuAPI Veo 3.1 (Seedance 2.5)
        │ (~7 minutes)
        ▼
Returns: clipUrl (8-second video)
"https://cdn.muapi.ai/outputs/generated/xxx.mp4"
        │
        ▼
Scene updated with clipUrl
scenes[i].clipUrl = "https://cdn.muapi.ai/..."
```

### 4.2 Save to Supabase
```
User clicks "Save Project"
        │
        ▼
ContentStudioV2.jsx → handleSave()
        │
        ▼
contentStudioV2Service.updateProject({
  scenes: [
    {
      photoUrl: "https://...",
      clipUrl: "https://cdn.muapi.ai/...",  // MuAPI video
      duration: 4.5
    }
  ],
  settings: { music: {...}, text: {...} }
})
        │
        ▼
Supabase: video_projects table updated
```

### 4.3 Export to MP4 (Remotion Lambda)
```
User clicks "Generate Video MP4"
        │
        ▼
ContentStudioV2.jsx → handleExportVideo()
        │
        ▼
POST /api/export-slideshow
{
  scenes: [
    { photoUrl, clipUrl, duration }  // ← CRITICAL: clipUrl included
  ],
  settings: { music, text, format }
}
        │
        ▼
video/export-slideshow.cjs
  - Upload base64 images to S3
  - Pass scenes WITH clipUrl to Remotion Lambda
        │
        ▼
Remotion Lambda (AWS)
  - PropertyPromo.tsx renders video
  - If clipUrl exists → uses AI video (motion)
  - If no clipUrl → uses static photo + Ken Burns
        │
        ▼
Output: S3 URL
"https://remotionlambda-useast1-xxx.s3.us-east-1.amazonaws.com/renders/xxx/out.mp4"
```

---

## 5. CRITICAL FIX APPLIED (October 2, 2026)

### Problem
The exported MP4 video was showing static photos instead of the AI-generated video clips with motion (water movement).

### Root Cause
In `video/export-slideshow.cjs`, the code was NOT passing `clipUrl` to Remotion Lambda:

```javascript
// BEFORE (broken)
uploadedScenes.push({
  photoUrl: photoUrl,
  duration: scenes[i].duration || 4.5
  // ❌ Missing clipUrl!
});
```

### Fix Applied
```javascript
// AFTER (fixed) - video/export-slideshow.cjs:86-89
uploadedScenes.push({
  photoUrl: photoUrl,
  clipUrl: scenes[i].clipUrl || null,  // ✅ Include MuAPI video
  duration: scenes[i].duration || 4.5
});
```

### Commit
- **Hash:** `70767da`
- **Message:** fix(ContentStudioV2): Pass MuAPI clipUrl to Remotion for video export
- **Files:** ContentStudioV2.jsx, export-slideshow.cjs

---

## 6. CURRENT STATE (October 2, 2026)

### What Works
| Feature | Status |
|---------|--------|
| Photo upload | ✅ Working |
| AI video generation (MuAPI Veo 3.1) | ✅ Working (~7 min) |
| Save project to Supabase | ✅ Working |
| Preview with Remotion Player | ✅ Working |
| Export to MP4 (static photos) | ✅ Working |
| Export to MP4 (AI video clips) | 🔄 Just fixed, needs testing |
| Download video | ✅ Working |
| Music overlay | ✅ Working |

### What Needs Testing
1. **Export with MuAPI video clip** - Just fixed, user needs to test
2. **Verify clipUrl is passed through entire pipeline**

### Known Limitations
- MuAPI takes ~7 minutes per video clip
- Minimum 1 photo required (changed from 2)
- Video clips are 8 seconds maximum

---

## 7. HOW TO TEST

### Prerequisites
1. Frontend running: `npm run dev` (localhost:5176)
2. Video server running: `cd video && node server.cjs` (localhost:3001)
3. MuAPI account with balance

### Test Steps
1. Go to Content Studio V2
2. Upload 1 photo
3. Click "Generate AI Video" (wait ~7 minutes)
4. Verify clipUrl appears in scene
5. Click "Save" to save to Supabase
6. Click "Generate Video MP4"
7. Check server console for: `Scene 1: HAS VIDEO (https://cdn.muapi.ai/...)`
8. Wait for export to complete
9. Download video and verify it has motion (not static photo)

---

## 8. ENVIRONMENT VARIABLES

### video/.env
```
MUAPI_TOKEN=your_muapi_token
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
```

### Root .env (for frontend)
```
VITE_VIDEO_SERVER_URL=http://localhost:3001
VITE_SUPABASE_URL=https://jjpscimtxrudtepzwhag.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 9. SUPABASE TABLE SCHEMA

### video_projects
```sql
CREATE TABLE video_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  scenes JSONB,  -- Array of {photoUrl, clipUrl, duration}
  settings JSONB,  -- {music: {enabled, track, volume}, text: {...}}
  output_url TEXT,  -- Final MP4 URL from Remotion
  status TEXT DEFAULT 'draft',  -- draft | exported
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Scene JSON Structure
```json
{
  "id": "scene-1",
  "photoUrl": "https://storage.supabase.co/...",
  "clipUrl": "https://cdn.muapi.ai/outputs/generated/xxx.mp4",
  "duration": 4.5
}
```

---

## 10. TROUBLESHOOTING

### Export shows static photo instead of video
- Check server console for `Scene X: HAS VIDEO` or `PHOTO ONLY`
- Verify clipUrl is saved in Supabase (video_projects.scenes)
- Restart video server after code changes

### MuAPI generation fails
- Check balance at muapi.ai
- Verify MUAPI_TOKEN in video/.env
- Check server logs for error messages

### Remotion Lambda errors
- Check AWS credentials in video/.env
- Verify Lambda function exists: `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec`
- Check S3 bucket permissions

---

## 11. NEXT STEPS

1. ✅ Commit and push clipUrl fix
2. 🔄 Test export with MuAPI video
3. 📝 Consider adding TTS (ElevenLabs) for narration
4. 📝 Add more video formats (horizontal, square)
5. 📝 Implement video editor for trimming clips

---

*Document created: October 2, 2026*
*Last commit: 70767da*
*Author: Claude Code*
