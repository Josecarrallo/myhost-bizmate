# KORA Voice Assistant - Standalone App

Standalone voice assistant interface for Izumi Hotel guests.

## 🎯 Purpose

This is a **separate, independent project** from the main MY HOST BizMate app.
It provides a public-facing voice interface for guests to speak with KORA AI receptionist.

## 📁 Project Structure

```
voice-app/
├── src/
│   ├── App.jsx            # Main voice page component
│   ├── VoiceAssistant.jsx # VAPI integration (copied from main app)
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind + custom styles
├── public/
│   └── images/
│       └── lumina-avatar.jpg
├── index.html             # Vite entry point
├── package.json           # Dependencies (@vapi-ai/web, react, vite)
├── vite.config.js         # Vite configuration
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🛠️ Technology Stack

**Same as main app:**
- React 18.2
- Vite 4.3.9
- @vapi-ai/web 2.5.2
- Tailwind CSS 3.3.2
- Lucide React icons

## 🚀 Deployment to Vercel

### Option 1: Deploy from this folder (CLI)

1. Open terminal in `voice-app/` folder
2. Run:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import this `voice-app/` folder as a new project
3. Vercel will auto-detect Vite:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy

## 🔧 Local Development

```bash
cd voice-app

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Open browser: http://localhost:3000

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 🌐 Expected URLs

After deployment, you'll get a URL like:
- `kora-voice.vercel.app` (free Vercel subdomain)
- Or connect your custom domain: `voice.yourdomain.com`

## 📝 Features

- ✅ Full React + Vite stack (same as main app)
- ✅ VAPI SDK via npm (@vapi-ai/web)
- ✅ Tailwind CSS with custom animations
- ✅ Works on mobile (HTTPS required for microphone)
- ✅ Multilingual support (English, Spanish, Indonesian)

## 🔑 Configuration

VAPI credentials are in `src/VoiceAssistant.jsx`:
- Public Key: `3716bc62-40e8-4f3b-bfa2-9e934db6b51d`
- Squad ID: `56ca0b34-a9d3-43f6-a0ec-f0f4a49cf0ee`

To update, edit line 25 (publicKey) and line 219 (squadId) in `src/VoiceAssistant.jsx`.

## ⚠️ Important

- This project is **completely independent** from main app
- Uses **exact same code** as localhost:5174/voice (VoiceAssistant component)
- Changes here do NOT affect main app
- Deploy separately to Vercel as new project
