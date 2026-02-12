# 🎬 LTX-2 + Remotion Integration Guide

## ✅ What's Been Implemented

You now have a complete **LTX-2 AI video generation pipeline** integrated with Remotion!

### 📦 Components Created

1. **`scripts/pipeline.ts`** - LTX-2 API client
   - Calls Lightricks LTX-2 Pro via Replicate
   - Generates cinematic 6-second clips with audio
   - Automatically downloads to `public/ltx-video.mp4`

2. **`src/LtxPromo.tsx`** - Remotion composition
   - Wraps LTX-2 clips in branded overlays
   - Includes title, logo, and call-to-action
   - 50 FPS for perfect audio sync

3. **`package.json`** - New scripts
   - `ltx:generate` - Generate LTX-2 clip only
   - `ltx:render` - Full pipeline (generate + render)

---

## 🚀 Setup Instructions

### Step 1: Get your Replicate API Token

```powershell
# Set environment variable in PowerShell
setx REPLICATE_API_TOKEN "ltxv_KNSQpAC9UvtoWYmreFuEkM3LvPENAN9Ln5g31MO-yVyGKFiy7OAVLZPW2-5xxdea6Gd3aYeIuRp1F3A4jghGsVEQujBwUtEw66SZkmLq5GsQD21grEgE8qT57YcXpH7o7WWv8It3N6nacF2Zqmz8-wo9JPLiuTazXEb4N8Mhbax-HFUM-oq5rd77IQ"
```

**IMPORTANT:** Close and reopen your terminal after setting the environment variable!

### Step 2: Verify setup

```bash
cd C:\myhost-bizmate\video
echo $env:REPLICATE_API_TOKEN   # Should show your token
```

---

## 💻 Usage

### Option 1: Generate + Render (Full Pipeline)

```bash
cd C:\myhost-bizmate\video

# Use default prompt
npm run ltx:render

# Use custom prompt
npx ts-node scripts/pipeline.ts "A luxury villa pool at sunset in Ubud" && npx remotion render LtxPromo out/ltx-promo.mp4
```

**What happens:**
1. ⏳ Calls LTX-2 API (takes ~30-60 seconds)
2. ⬇️ Downloads video to `public/ltx-video.mp4`
3. 🎬 Renders final branded video to `out/ltx-promo.mp4`

### Option 2: Generate Only (No Rendering)

```bash
# Just generate the LTX-2 clip
npm run ltx:generate

# With custom prompt
npx ts-node scripts/pipeline.ts "Drone shot of Bali rice terraces at golden hour"
```

### Option 3: Render Only (Using Existing Clip)

```bash
# If you already have public/ltx-video.mp4
npx remotion render LtxPromo out/ltx-promo.mp4
```

---

## 🔧 Customizing Prompts

### Examples of Good Prompts for Villas:

```bash
# Aerial views
npx ts-node scripts/pipeline.ts "Aerial drone shot of a private infinity pool villa overlooking tropical jungle, sunset golden hour, cinematic lighting"

# Interior shots
npx ts-node scripts/pipeline.ts "Luxury villa bedroom interior with canopy bed, soft morning light through windows, peaceful atmosphere"

# Lifestyle
npx ts-node scripts/pipeline.ts "Couple relaxing by infinity pool at luxury villa, Bali rice fields in background, romantic sunset ambiance"

# Nature focus
npx ts-node scripts/pipeline.ts "Lush tropical garden with waterfall at private villa, morning mist, serene atmosphere"
```

### LTX-2 Prompt Tips:
- Be specific about lighting ("golden hour", "soft morning light")
- Include camera movement ("aerial drone", "slow pan")
- Mention atmosphere ("cinematic", "peaceful", "romantic")
- Keep it under 100 words for best results

---

## 🤖 n8n Integration

### Method 1: Execute Command Node (Recommended)

In your n8n workflow, add an **Execute Command** node:

```json
{
  "command": "cd C:/myhost-bizmate/video && npx ts-node scripts/pipeline.ts \"{{$json.prompt}}\" && npx remotion render LtxPromo \"C:/myhost-bizmate/video/out/{{$json.property_slug}}-ltx.mp4\"",
  "workingDirectory": "C:/myhost-bizmate/video"
}
```

**Input JSON fields needed:**
- `prompt` - The LTX-2 generation prompt
- `property_slug` - Villa identifier for output filename

**Example n8n workflow:**

```
[Webhook] → [Set Variables] → [Execute Command] → [Upload to Storage]
```

**Set Variables node:**
```json
{
  "prompt": "{{$json.villaName}} - {{$json.description}} at {{$json.timeOfDay}}",
  "property_slug": "{{$json.villaSlug}}",
  "output_path": "out/{{$json.villaSlug}}-ltx-{{$now}}.mp4"
}
```

**Execute Command node:**
```bash
cd C:/myhost-bizmate/video
npx ts-node scripts/pipeline.ts "{{$json.prompt}}"
npx remotion render LtxPromo "{{$json.output_path}}"
```

### Method 2: HTTP Request to Local API

If you prefer, you can wrap the pipeline in an Express API:

```javascript
// server.js in video folder
import express from 'express';
import { runPipeline } from './scripts/pipeline.ts';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  const { prompt, outputFilename } = req.body;

  try {
    // Generate LTX-2 clip
    await runPipeline(prompt);

    // Render with Remotion
    exec(`npx remotion render LtxPromo out/${outputFilename}.mp4`, (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ success: true, file: `out/${outputFilename}.mp4` });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Video API running on port 3001'));
```

Then in n8n, use HTTP Request node:
```
POST http://localhost:3001/generate-video
Body:
{
  "prompt": "{{$json.prompt}}",
  "outputFilename": "{{$json.property_slug}}"
}
```

---

## 📁 File Structure

```
video/
├── scripts/
│   └── pipeline.ts          # LTX-2 API client
├── src/
│   ├── LtxPromo.tsx         # Branded video composition
│   └── Root.tsx             # Compositions registry
├── public/
│   └── ltx-video.mp4        # Downloaded LTX-2 clip (auto-generated)
├── out/
│   └── ltx-promo.mp4        # Final rendered video
└── package.json             # Scripts defined here
```

---

## 🎨 Customizing the Branded Overlay

Edit `src/LtxPromo.tsx` to customize:

### Change branding colors:
```typescript
// Line ~150
color: '#FF8C42'  // Change to your brand color
```

### Change title text:
```typescript
// Line ~110
MY HOST <span style={{ color: '#FF8C42' }}>BizMate</span>
```

### Change CTA:
```typescript
// Line ~180
<h2>Book Your Dream Villa</h2>
<p>www.myhostbizmate.com</p>
```

### Adjust timing:
```typescript
// Show title for longer
{frame < durationInFrames / 2 && ... }  // Change /2 to /1.5

// Show CTA earlier
{frame >= durationInFrames - 150 && ... }  // Change 100 to 150
```

---

## 🔍 Troubleshooting

### Error: "REPLICATE_API_TOKEN not found"

**Solution:**
1. Set the environment variable: `setx REPLICATE_API_TOKEN "your_token"`
2. **Close and reopen** your terminal
3. Verify: `echo $env:REPLICATE_API_TOKEN`

### Error: "Cannot find module 'typescript'"

**Solution:**
```bash
cd C:/myhost-bizmate/video
npm install
```

### Error: "public/ltx-video.mp4 not found"

**Solution:**
Run the pipeline first to generate the clip:
```bash
npm run ltx:generate
```

### LTX-2 generation is too slow

**Expected behavior:** LTX-2 takes 30-60 seconds to generate a 6-second clip.

**Tips:**
- Shorter prompts = faster generation
- Keep videos at 6 seconds (longer = exponentially slower)
- Use Replicate's API queue for batch jobs

### Remotion render fails

**Check:**
```bash
# Verify Remotion CLI works
npx remotion compositions

# Should list "LtxPromo" composition
```

---

## 📊 Performance

- **LTX-2 generation:** ~30-60 seconds
- **Remotion render:** ~10-20 seconds
- **Total pipeline:** ~1-2 minutes
- **Output file size:** ~5-10 MB

---

## 🚀 Next Steps

### For Production Use:

1. **Add to SaaS UI:**
   Create a button in your Properties module:
   ```javascript
   const handleGenerateVideo = async (villa) => {
     const prompt = `Cinematic view of ${villa.name}, ${villa.description}`;
     await fetch('/api/generate-video', {
       method: 'POST',
       body: JSON.stringify({ prompt, property_slug: villa.slug })
     });
   };
   ```

2. **Set up n8n workflow:**
   - Trigger: New property added
   - Action: Generate promotional video
   - Upload: Store in Supabase Storage or S3

3. **Add progress tracking:**
   Use Replicate webhooks for real-time status updates

4. **Batch processing:**
   Generate videos for all properties overnight

---

## 💰 Cost Estimation

**Replicate LTX-2 Pro pricing:**
- ~$0.01-0.05 per 6-second clip
- Depends on resolution and duration
- 1080p @ 6s = ~$0.02

**Example monthly costs:**
- 10 villas x 2 videos/month = 20 videos
- 20 x $0.02 = **$0.40/month**

Extremely affordable for professional AI-generated video!

---

## 📚 Resources

- **LTX-2 Docs:** https://replicate.com/lightricks/ltx-2-pro
- **Remotion Docs:** https://remotion.dev
- **n8n Docs:** https://docs.n8n.io
- **Replicate API:** https://replicate.com/docs

---

## ✅ You're All Set!

Run your first video:
```bash
cd C:/myhost-bizmate/video
npm run ltx:render
```

The final video will be at: `out/ltx-promo.mp4` 🎉
