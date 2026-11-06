/**
 * Content Studio V2 Service
 *
 * Handles:
 * - Project CRUD (Supabase)
 * - Photo upload to Supabase Storage
 * - OpenAI integration (GPT-4o for image analysis and prompt improvement)
 * - MuAPI integration (Veo 3.1 Fast for video, ElevenLabs TTS Turbo 2.5 for voice)
 * - Remotion render status
 *
 * AI Models Used:
 * - Image Analysis: OpenAI GPT-4o (vision)
 * - Video Generation: MuAPI Veo 3.1 Fast Image-to-Video (8s clips, better water animation)
 * - Voice-over Primary: MuAPI ElevenLabs TTS Turbo 2.5
 * - Voice-over Fallback: OpenAI TTS-1
 * - Rendering: Remotion Lambda
 */

import { supabase } from '../lib/supabase';

// =====================================================
// CONFIGURATION
// =====================================================

// AI Proxy Edge Function URL (handles all external API calls securely)
const AI_PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`;

// Storage bucket name
const STORAGE_BUCKET = 'content-studio';

/**
 * Get authentication headers for ai-proxy calls
 * Requires active Supabase session
 */
async function getAIProxyHeaders() {
  const { data: sessionData, error } = await supabase.auth.getSession();
  if (error || !sessionData?.session?.access_token) {
    throw new Error('Session expired - please login again to use Content Studio.');
  }
  return {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${sessionData.session.access_token}`
  };
}

// =====================================================
// PROJECT CRUD (Supabase)
// =====================================================

/**
 * Create a new video project
 */
export async function createProject(tenantId, projectData) {
  const { data, error } = await supabase
    .from('video_projects')
    .insert({
      tenant_id: tenantId,
      name: projectData.name || 'Untitled Project',
      status: projectData.status || 'draft',
      format: projectData.format || '9:16',
      prompt: projectData.prompt || '',
      improved_prompt: projectData.improved_prompt || '',
      settings: projectData.settings || {},
      scenes: projectData.scenes || [],
      output_url: projectData.output_url || null
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return data;
}

/**
 * Get project by ID
 */
export async function getProject(projectId) {
  const { data, error } = await supabase
    .from('video_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) throw new Error(`Failed to get project: ${error.message}`);
  return data;
}

/**
 * Get all projects for a tenant
 */
export async function getProjects(tenantId) {
  const { data, error } = await supabase
    .from('video_projects')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`Failed to get projects: ${error.message}`);
  return data || [];
}

/**
 * Update project
 */
export async function updateProject(projectId, updates) {
  console.log('=== SERVICE: updateProject ===');
  console.log('Project ID:', projectId);
  console.log('Updates being sent to Supabase:', JSON.stringify(updates, null, 2));
  console.log('==============================');

  const { data, error } = await supabase
    .from('video_projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
  console.log('Update successful, returned data:', JSON.stringify(data, null, 2));
  return data;
}

/**
 * Delete project and associated files
 */
export async function deleteProject(projectId) {
  // Get project to find associated files
  const project = await getProject(projectId);

  // Delete files from storage
  if (project.scenes && project.scenes.length > 0) {
    const filePaths = project.scenes
      .filter(s => s.photoPath)
      .map(s => s.photoPath);

    if (filePaths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(filePaths);
    }
  }

  // Delete project record
  const { error } = await supabase
    .from('video_projects')
    .delete()
    .eq('id', projectId);

  if (error) throw new Error(`Failed to delete project: ${error.message}`);
  return true;
}

// =====================================================
// PHOTO UPLOAD (Supabase Storage)
// =====================================================

/**
 * Upload photo to Supabase Storage
 */
export async function uploadPhoto(tenantId, projectId, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tenantId}/${projectId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw new Error(`Failed to upload photo: ${error.message}`);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return {
    path: fileName,
    url: urlData.publicUrl
  };
}

/**
 * Upload base64 image to Supabase Storage and get public URL
 * This is needed because MuAPI requires a public URL, not base64
 */
export async function uploadBase64ToPublicUrl(base64Data, userId) {
  // Validate userId is provided - never use fallback 'temp'
  if (!userId || userId === 'temp') {
    throw new Error('uploadBase64ToPublicUrl requires a valid userId. User must be authenticated.');
  }
  // Check if already a public URL (https://)
  if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
    return base64Data;
  }

  // Extract the actual base64 data and mime type
  const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image format');
  }

  const mimeType = matches[1];
  const base64Content = matches[2];
  const extension = mimeType.split('/')[1] || 'jpg';

  // Convert base64 to blob
  const byteCharacters = atob(base64Content);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  // Generate unique filename
  const fileName = `muapi-temp/${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;

  // Upload to Supabase Storage using user session (RLS policy allows muapi-temp/<user.id>/)
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, blob, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Delete photo from storage
 */
export async function deletePhoto(photoPath) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([photoPath]);

  if (error) throw new Error(`Failed to delete photo: ${error.message}`);
  return true;
}

// =====================================================
// OPENAI INTEGRATION
// =====================================================

// System prompt for BIZMATE AI Video Director
// ChatGPT receives: SYSTEM PROMPT + USER PROMPT + IMAGE
// ChatGPT returns: veoPrompt (ONLY this goes to Veo 3.1)
const BIZMATE_VIDEO_DIRECTOR_PROMPT = `You are BIZMATE AI Video Director.

You receive:
1. The user's request (what they want to achieve)
2. One or more property images (the visual source of truth)

Your job is to act as a professional AI VIDEO DIRECTOR:
- Analyze the uploaded image(s)
- Understand the user's request
- Combine both to create ONE SINGLE OPTIMIZED PROMPT for Veo 3.1

==================================================
PRIORITY OF INSTRUCTIONS
==================================================

1. PRESERVE THE ORIGINAL IMAGE - this is the highest priority
2. RESPECT THE USER'S REQUEST - do not change their intention
3. IMPROVE CINEMATICALLY - enhance with professional techniques
4. AVOID DEFORMATION - protect architecture and geometry

==================================================
IMAGE IS THE SOURCE OF TRUTH
==================================================

The uploaded image is the absolute visual reference.

You must NOT invent:
- rooms, pools, furniture, buildings
- doors, windows, gardens
- people, animals, views, objects

that do NOT appear in the image.

Only mention elements that are VISIBLE in the image.

==================================================
RESPECT USER'S REQUEST
==================================================

If the user says "The main movement is the swimming pool water"
→ Keep water as the primary motion

If the user says "Keep all other elements stable"
→ Respect this completely

If the user says "slow camera push-in"
→ Use slow camera push-in

Do NOT override the user's intention.
You can IMPROVE the request cinematically, but NOT CHANGE it.

==================================================
MOTION RULES
==================================================

Apply MINIMUM NECESSARY MOTION.

Do not try to animate everything.

PRIORITY:
1. Natural motion (water ripples, reflections)
2. Environmental motion (subtle leaf movement)
3. Very subtle camera movement

EXAMPLE FOR POOL:
- PRIMARY: gentle water ripples, small calm waves, moving sunlight reflections
- SECONDARY: very subtle movement of visible leaves/palm fronds
- CAMERA: very slow stabilized cinematic push-in
- EVERYTHING ELSE: STATIC

==================================================
CAMERA RULES
==================================================

Use smooth, controlled movements:
- slow push-in
- gentle dolly
- subtle pan
- almost locked camera

AVOID:
- aggressive zoom
- fast pan
- large orbit
- dramatic drone movement
- large perspective changes

If there is risk of deforming architecture:
→ USE ALMOST STATIC CAMERA

Better to have water/vegetation motion with stable architecture
than spectacular camera that deforms the villa.

==================================================
VEO PROMPT CREATION
==================================================

Create ONE optimized prompt for Veo 3.1 that:

1. Preserves the original image composition
2. Describes what should move and how
3. Describes what must remain static
4. Specifies camera movement (if any)
5. Describes lighting naturally
6. Explicitly states what to avoid

The veoPrompt should be detailed but focused.
Maximum 200 words.
Do NOT include duration or aspect ratio in the prompt text.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON with this exact structure:

{
  "veoPrompt": "The complete prompt for Veo 3.1",
  "durationSeconds": 5,
  "aspectRatio": "16:9",
  "musicPrompt": "Description for background music, or empty string"
}

RULES:
- veoPrompt = visual/motion instructions for Veo 3.1, plus any voice-over/audio the user requested at the end
- durationSeconds = extract from user request, default 5
- aspectRatio = extract from user request, default "16:9"
- musicPrompt = separate music instructions for Remotion (NOT for Veo)

Do NOT include duration/format inside veoPrompt.

==================================================
VOICE-OVER AND AUDIO PRESERVATION
==================================================

If the user's text includes a voice-over, narration, dialogue, spoken line or audio/music description, include it exactly as
written (same words, same language, same voice description) at the END of veoPrompt, after the visual description. Do NOT put
it in any other field - put it directly in veoPrompt so Veo receives it. Never remove, translate or rewrite the spoken words. If
the user does not ask for voice, do not add any voice-over, narration or dialogue.

==================================================
EXAMPLE
==================================================

USER REQUEST:
"Create a short horizontal luxury-villa promotional video from the uploaded swimming pool image. Keep the original composition.
 The main movement is the swimming pool water. Animate the water with gentle ripples. Use a slow camera push-in. Add soft
tropical background music. Duration: 5 seconds. Format: 16:9."

YOUR OUTPUT:
{
  "veoPrompt": "Preserve the uploaded villa composition exactly, maintaining pool geometry, blue tiles, architecture, glass
doors, roof, furniture and vegetation unchanged. Animate the swimming pool as primary motion with continuous gentle natural
ripples and small calm waves, creating realistic moving sunlight reflections across the water surface and mosaic tiles. Add
extremely subtle movement to visible tropical leaves from a light breeze. Use a very slow stabilized cinematic push-in toward
the pool with minimal perspective change. Maintain realistic warm natural daylight. Keep all architectural elements completely
stable. No people, animals, new objects, text, logos, warping, morphing or structural changes.",
  "durationSeconds": 5,
  "aspectRatio": "16:9",
  "musicPrompt": "Soft relaxing cinematic tropical instrumental for luxury Bali villa, elegant, calm, warm, no vocals"
}


EXAMPLE WITH VOICE-OVER

USER REQUEST:
"Slow push-in toward the villa. Voice-over: a warm female narrator in English says: 'Your private escape in Bali.'"

YOUR OUTPUT:
{
  "veoPrompt": "Preserve the uploaded villa composition exactly, keeping architecture, pool and vegetation unchanged. Use a very slow stabilized cinematic push-in toward the villa. Subtle movement of visible leaves and gentle reflections on the water. Keep all architectural elements completely stable. No people, animals, new objects, text, logos, warping, morphing or structural changes. Voice-over: a warm female narrator in English says: 'Your private escape in Bali.'",
  "durationSeconds": 5,
  "aspectRatio": "16:9",
  "musicPrompt": ""
}

Return ONLY valid JSON. No markdown. No explanation.`;

/**
 * Analyze images and generate veoPrompt using OpenAI Vision via ai-proxy
 *
 * FLOW:
 * SYSTEM PROMPT + USER PROMPT + IMAGE → ai-proxy → ChatGPT → veoPrompt → Veo 3.1
 *
 * Returns { veoPrompt, durationSeconds, aspectRatio, musicPrompt }
 */
export async function analyzeAndImprovePrompt(imageUrls, userPrompt) {
  const userMessageText = userPrompt;

  const messages = [
    {
      role: 'system',
      content: BIZMATE_VIDEO_DIRECTOR_PROMPT
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: userMessageText
        },
        ...imageUrls.map((url) => ({
          type: 'image_url',
          image_url: { url, detail: 'high' }
        }))
      ]
    }
  ];

  try {
    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/openai/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'ai-proxy OpenAI error');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return result;
  } catch (error) {
    console.error('OpenAI prompt enhancement error:', error);
    // Fallback - use user's prompt directly if ai-proxy/OpenAI fails
    return {
      veoPrompt: userPrompt,
      durationSeconds: 5,
      aspectRatio: '16:9',
      musicPrompt: ''
    };
  }
}

/**
 * Generate voice-over using ai-proxy -> MuAPI ElevenLabs TTS Turbo 2.5 (PRIMARY)
 * Endpoint: POST /functions/v1/ai-proxy/tts
 * Pricing: $0.05 per 1,000 characters
 */
export async function generateVoiceOverMuAPI(script, options = {}) {
  const {
    voiceId = '21m00Tcm4TlvDq8ikWAM', // Rachel - default ElevenLabs voice
    stability = 0.5,
    similarityBoost = 0.75,
    speed = 1.0,
    languageCode = null // null = auto-detect
  } = options;

  try {
    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/tts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt: script,
        voice_id: voiceId,
        stability,
        similarity_boost: similarityBoost,
        speed,
        language_code: languageCode
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'ai-proxy TTS failed');
    }

    const data = await response.json();
    return {
      requestId: data.request_id,
      status: 'processing'
    };
  } catch (error) {
    console.error('ai-proxy TTS error:', error);
    return null;
  }
}

/**
 * Check TTS generation status via ai-proxy
 * Endpoint: GET /functions/v1/ai-proxy/status/{request_id}
 */
export async function checkTTSStatus(requestId) {
  if (requestId.startsWith('mock-')) {
    return {
      status: 'completed',
      audioUrl: null,
      progress: 100
    };
  }

  try {
    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/status/${requestId}`, {
      headers
    });

    if (!response.ok) {
      throw new Error('TTS status check failed');
    }

    const data = await response.json();
    return {
      status: data.status, // pending, processing, completed, failed
      audioUrl: data.output?.audio_url || data.audio_url,
      progress: data.progress || 0
    };
  } catch (error) {
    console.error('TTS status error:', error);
    throw error;
  }
}

/**
 * Generate voice-over audio using OpenAI TTS via ai-proxy (FALLBACK)
 * Use this if MuAPI ElevenLabs fails
 */
export async function generateVoiceOverOpenAI(script, voice = 'alloy') {
  // Uses session auth via ai-proxy (no API key needed)
  try {
    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/openai/speech`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'tts-1',
        input: script.slice(0, 4096), // OpenAI TTS limit
        voice: voice, // alloy, echo, fable, onyx, nova, shimmer
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ai-proxy OpenAI TTS error:', errorData);
      throw new Error(errorData.error || 'OpenAI TTS generation failed');
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('OpenAI TTS error:', error);
    return null;
  }
}

/**
 * Generate voice-over with automatic fallback
 * Tries ai-proxy (MuAPI ElevenLabs) first, falls back to OpenAI TTS via ai-proxy
 */
export async function generateVoiceOver(script, apiKeys = {}, options = {}) {
  // apiKeys param kept for backward compatibility but no longer needed

  // Try ai-proxy (MuAPI ElevenLabs) first (primary)
  try {
    const result = await generateVoiceOverMuAPI(script, options);
    if (result) {
      return { provider: 'muapi', ...result };
    }
  } catch (error) {
    console.warn('ai-proxy TTS failed, trying OpenAI fallback:', error.message);
  }

  // Fallback to OpenAI TTS via ai-proxy
  try {
    const blob = await generateVoiceOverOpenAI(script, options.voice || 'alloy');
    if (blob) {
      return { provider: 'openai', audioBlob: blob, status: 'completed' };
    }
  } catch (error) {
    console.warn('OpenAI TTS fallback also failed:', error.message);
  }

  return null;
}

// =====================================================
// MUAPI INTEGRATION (Veo 3.1 Fast Image-to-Video)
// =====================================================

/**
 * Generate video clip from image using ai-proxy -> MuAPI Veo 3.1 Fast
 * Endpoint: POST /functions/v1/ai-proxy/generate-clip
 * Pricing: $0.60 (720p), $0.78 (1080p), $1.80 (4K) per 8-second clip
 *
 * Veo 3.1 Fast produces better fluid/water animations than Seedance 2.5
 * Fixed 8-second duration per clip
 *
 * IMPORTANT: imageUrl must be a public URL (https://...), NOT base64.
 * If base64 is provided, it will be uploaded to Supabase Storage first.
 *
 * NEW: lastImageUrl (optional) - URL for the end frame. When provided,
 * Veo 3.1 will transition from imageUrl to lastImageUrl.
 */
export async function generateVideoClip(imageUrl, prompt, options = {}) {
  const {
    resolution = '1080p', // 720p, 1080p, 4k
    aspectRatio = '16:9', // 16:9 or 9:16
    userId,
    lastImageUrl = null // NEW: Optional end frame image
  } = options;

  try {
    // CRITICAL: MuAPI requires a public URL, not base64
    // If the image is base64, upload it to Supabase Storage first
    let publicImageUrl = imageUrl;
    let publicLastImageUrl = lastImageUrl;

    if (imageUrl.startsWith('data:')) {
      publicImageUrl = await uploadBase64ToPublicUrl(imageUrl, userId);
    }

    // Upload last image if provided and is base64
    if (lastImageUrl && lastImageUrl.startsWith('data:')) {
      publicLastImageUrl = await uploadBase64ToPublicUrl(lastImageUrl, userId);
    }

    // Build request body
    const requestBody = {
      imageUrl: publicImageUrl,
      prompt,
      resolution,
      aspectRatio
    };

    // Add last_image if provided (for start-to-end frame transition)
    if (publicLastImageUrl) {
      requestBody.lastImageUrl = publicLastImageUrl;
      console.log('📸 Using two images: start frame + end frame transition');
    }

    // Use ai-proxy Edge Function (handles MuAPI key securely)
    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/generate-clip`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `ai-proxy generate-clip failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      requestId: data.request_id,
      status: 'processing',
      estimatedTime: 90 // Veo 3.1 Fast takes ~90 seconds
    };
  } catch (error) {
    console.error('ai-proxy generate-clip error:', error);
    throw error;
  }
}

/**
 * Generate video clip using Kling (FALLBACK when Veo fails)
 * Endpoint: POST /functions/v1/ai-proxy/generate-clip-kling
 * Only for single-image clips (no start→end transitions)
 * Duration: 5 seconds, No audio generation
 */
export async function generateVideoClipKling(imageUrl, prompt, options = {}) {
  const {
    aspectRatio = '16:9',
    userId
  } = options;

  try {
    // Upload base64 if needed
    let publicImageUrl = imageUrl;
    if (imageUrl.startsWith('data:')) {
      publicImageUrl = await uploadBase64ToPublicUrl(imageUrl, userId);
    }

    const requestBody = {
      imageUrl: publicImageUrl,
      prompt,
      aspectRatio,
      duration: 5,        // Kling uses 5 seconds
      generateAudio: false // No audio - voice-over won't work with Kling
    };

    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/generate-clip-kling`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Kling generation failed');
    }

    const data = await response.json();
    console.log('🎬 Kling fallback started, requestId:', data.request_id);

    return {
      requestId: data.request_id,
      status: 'processing',
      estimatedTime: 60, // Kling is usually faster
      model: 'kling'
    };
  } catch (error) {
    console.error('ai-proxy generate-clip-kling error:', error);
    throw error;
  }
}

/**
 * Check video generation status via ai-proxy
 * Endpoint: GET /functions/v1/ai-proxy/status/{request_id}
 * Response: { status: "completed", outputs: { video: "url" } }
 */
export async function checkVideoStatus(requestId) {
  if (requestId.startsWith('mock-')) {
    // Mock completed response
    return {
      status: 'completed',
      videoUrl: null, // Will be replaced with Remotion preview
      progress: 100
    };
  }

  try {
    // Use ai-proxy Edge Function
    const headers = await getAIProxyHeaders();
    const response = await fetch(`${AI_PROXY_URL}/status/${requestId}`, {
      headers
    });

    // Read body even on 4xx to detect status: "failed"
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If MuAPI says "failed", return that instead of throwing
      if (data.status === 'failed' || data.detail?.status === 'failed') {
        return {
          status: 'failed',
          videoUrl: null,
          error: data.error || data.message || 'Video generation failed'
        };
      }
      throw new Error(data.error || data.message || 'Video status check failed');
    }

    // MuAPI returns video URL in different formats depending on version:
    // - outputs: ["https://..."] (array with URL)
    // - outputs: { video: "https://..." } (object)
    // - output: { video_url: "https://..." }
    let videoUrl = null;

    if (Array.isArray(data.outputs) && data.outputs.length > 0) {
      // outputs is array - take first element
      videoUrl = data.outputs[0];
    } else if (data.outputs?.video) {
      // outputs is object with video property
      videoUrl = data.outputs.video;
    } else if (data.output?.video_url) {
      videoUrl = data.output.video_url;
    } else if (data.video_url) {
      videoUrl = data.video_url;
    }

    return {
      status: data.status, // pending, processing, completed, failed
      videoUrl,
      progress: data.progress || (data.status === 'completed' ? 100 : 50)
    };
  } catch (error) {
    console.error('Video status check error:', error);
    throw error;
  }
}

// =====================================================
// REMOTION RENDER
// =====================================================

/**
 * Trigger Remotion Lambda render
 */
export async function triggerRemotionRender(projectId, scenes, settings) {
  // This will call your Remotion Lambda endpoint
  const REMOTION_ENDPOINT = import.meta.env.VITE_REMOTION_RENDER_URL;

  if (!REMOTION_ENDPOINT) {
    console.warn('Remotion endpoint not configured');
    return {
      renderId: `mock-render-${Date.now()}`,
      status: 'rendering'
    };
  }

  try {
    const response = await fetch(REMOTION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectId,
        composition: 'PropertyPromo',
        inputProps: {
          scenes,
          settings,
          format: settings.format || '9:16'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Render trigger failed');
    }

    const data = await response.json();
    return {
      renderId: data.renderId,
      status: 'rendering'
    };
  } catch (error) {
    console.error('Remotion render error:', error);
    throw error;
  }
}

/**
 * Check Remotion render status
 */
export async function checkRenderStatus(renderId) {
  const REMOTION_STATUS_URL = import.meta.env.VITE_REMOTION_STATUS_URL;

  if (!REMOTION_STATUS_URL || renderId.startsWith('mock-')) {
    // Mock completed
    return {
      status: 'completed',
      outputUrl: null,
      progress: 100
    };
  }

  try {
    const response = await fetch(`${REMOTION_STATUS_URL}?renderId=${renderId}`);
    const data = await response.json();

    return {
      status: data.status,
      outputUrl: data.outputUrl,
      progress: data.progress || 0
    };
  } catch (error) {
    console.error('Render status error:', error);
    throw error;
  }
}

// =====================================================
// COMBINED WORKFLOW
// =====================================================

/**
 * Full video generation workflow
 * 1. Upload photos
 * 2. Analyze with OpenAI
 * 3. Generate clips with MuAPI
 * 4. Render with Remotion
 */
export async function generateVideo(
  tenantId,
  photos, // Array of File objects
  prompt,
  settings,
  apiKeys = {},
  onProgress = () => {}
) {
  // apiKeys param is deprecated - all API calls now use ai-proxy with session auth

  try {
    // Step 1: Create project
    onProgress({ step: 'creating', progress: 5, message: 'Creating project...' });
    const project = await createProject(tenantId, {
      name: `Video ${new Date().toLocaleDateString()}`,
      format: settings.format,
      prompt,
      settings
    });

    // Step 2: Upload photos
    onProgress({ step: 'uploading', progress: 15, message: 'Uploading photos...' });
    const uploadedPhotos = [];
    for (let i = 0; i < photos.length; i++) {
      const uploaded = await uploadPhoto(tenantId, project.id, photos[i].file);
      uploadedPhotos.push({
        ...photos[i],
        ...uploaded
      });
      onProgress({
        step: 'uploading',
        progress: 15 + (i + 1) * 5,
        message: `Uploaded photo ${i + 1}/${photos.length}`
      });
    }

    // Step 3: Analyze with OpenAI
    onProgress({ step: 'analyzing', progress: 35, message: 'Analyzing images with AI...' });
    const imageUrls = uploadedPhotos.map(p => p.url);
    const analysis = await analyzeAndImprovePrompt(imageUrls, prompt);

    // Update project with improved prompt
    await updateProject(project.id, {
      improved_prompt: analysis.veoPrompt
    });

    // Step 4: Generate clips with ai-proxy (MuAPI)
    onProgress({ step: 'generating', progress: 45, message: 'Generating video clips...' });
    const scenes = [];
    for (let i = 0; i < uploadedPhotos.length; i++) {
      const photo = uploadedPhotos[i];

      onProgress({
        step: 'generating',
        progress: 45 + (i * 15),
        message: `Generating clip ${i + 1}/${uploadedPhotos.length}...`
      });

      const clipResult = await generateVideoClip(
        photo.url,
        analysis.veoPrompt,
        {
          aspectRatio: settings.format,
          duration: 5
        }
      );

      scenes.push({
        id: `scene-${i}`,
        photoId: photo.id,
        photoUrl: photo.url,
        photoPath: photo.path,
        clipTaskId: clipResult.taskId,
        clipUrl: null, // Will be filled when clip is ready
        duration: 5,
        status: 'processing'
      });
    }

    // Update project with scenes
    await updateProject(project.id, {
      scenes,
      status: 'processing'
    });

    onProgress({ step: 'ready', progress: 100, message: 'Ready for editing!' });

    return {
      projectId: project.id,
      scenes,
      analysis
    };

  } catch (error) {
    console.error('Video generation error:', error);
    throw error;
  }
}

// =====================================================
// EXPORT
// =====================================================

export const contentStudioV2Service = {
  // Projects
  createProject,
  getProject,
  getProjects,
  updateProject,
  deleteProject,

  // Photos
  uploadPhoto,
  uploadBase64ToPublicUrl,
  deletePhoto,

  // OpenAI (GPT-4o Vision)
  analyzeAndImprovePrompt,

  // Voice-over (MuAPI ElevenLabs primary, OpenAI fallback)
  generateVoiceOver,           // Auto-fallback wrapper
  generateVoiceOverMuAPI,      // MuAPI ElevenLabs TTS Turbo 2.5 (primary)
  generateVoiceOverOpenAI,     // OpenAI TTS-1 (fallback)
  checkTTSStatus,              // MuAPI TTS status polling

  // MuAPI (Veo 3.1 Fast Image-to-Video)
  generateVideoClip,
  generateVideoClipKling, // Kling fallback
  checkVideoStatus,

  // Remotion
  triggerRemotionRender,
  checkRenderStatus,

  // Full workflow
  generateVideo
};

export default contentStudioV2Service;
