/**
 * Content Studio V2 Service
 *
 * Handles:
 * - Project CRUD (Supabase)
 * - Photo upload to Supabase Storage
 * - OpenAI integration (GPT-4o for image analysis and prompt improvement)
 * - MuAPI integration (Seedance 2.5 for video, ElevenLabs TTS Turbo 2.5 for voice)
 * - Remotion render status
 *
 * AI Models Used:
 * - Image Analysis: OpenAI GPT-4o (vision)
 * - Video Generation: MuAPI Seedance 2.5 Image-to-Video
 * - Voice-over Primary: MuAPI ElevenLabs TTS Turbo 2.5
 * - Voice-over Fallback: OpenAI TTS-1
 * - Rendering: Remotion Lambda
 */

import { supabase } from '../lib/supabase';

// =====================================================
// CONFIGURATION
// =====================================================

const MUAPI_BASE_URL = 'https://api.muapi.ai';
const OPENAI_API_URL = 'https://api.openai.com/v1';

// Storage bucket name
const STORAGE_BUCKET = 'content-studio';

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
  const { data, error } = await supabase
    .from('video_projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update project: ${error.message}`);
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

/**
 * Analyze images and improve prompt using OpenAI Vision
 */
export async function analyzeAndImprovePrompt(imageUrls, userPrompt, apiKey) {
  if (!apiKey) {
    // Return mock response if no API key
    return {
      analysis: 'Beautiful property with modern architecture and tropical surroundings.',
      improvedPrompt: `${userPrompt} Cinematic camera movements, smooth transitions between scenes, highlighting luxury amenities and natural beauty.`,
      suggestedVoiceScript: `Welcome to this stunning property. ${userPrompt}`
    };
  }

  const messages = [
    {
      role: 'system',
      content: `You are a professional video director specializing in luxury property marketing videos.
      Analyze the provided images and enhance the user's prompt to create compelling video content.
      Return a JSON object with:
      - analysis: Brief description of what you see in the images
      - improvedPrompt: Enhanced prompt with cinematic directions
      - suggestedVoiceScript: Optional voice-over script (2-3 sentences)`
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `User prompt: "${userPrompt}"\n\nAnalyze these property images and create an improved prompt for video generation:`
        },
        ...imageUrls.map(url => ({
          type: 'image_url',
          image_url: { url }
        }))
      ]
    }
  ];

  try {
    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback to mock
    return {
      analysis: 'Property analysis unavailable',
      improvedPrompt: `${userPrompt} with smooth cinematic transitions.`,
      suggestedVoiceScript: userPrompt
    };
  }
}

/**
 * Generate voice-over using MuAPI ElevenLabs TTS Turbo 2.5 (PRIMARY)
 * Endpoint: POST https://api.muapi.ai/api/v1/elevenlabs-tts-turbo-2-5
 * Pricing: $0.05 per 1,000 characters
 */
export async function generateVoiceOverMuAPI(script, apiKey, options = {}) {
  if (!apiKey) {
    return null;
  }

  const {
    voiceId = '21m00Tcm4TlvDq8ikWAM', // Rachel - default ElevenLabs voice
    stability = 0.5,
    similarityBoost = 0.75,
    speed = 1.0,
    languageCode = null // null = auto-detect
  } = options;

  try {
    const response = await fetch(`${MUAPI_BASE_URL}/api/v1/elevenlabs-tts-turbo-2-5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
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
      throw new Error(error.message || 'MuAPI ElevenLabs TTS failed');
    }

    const data = await response.json();
    return {
      requestId: data.request_id,
      status: 'processing'
    };
  } catch (error) {
    console.error('MuAPI ElevenLabs TTS error:', error);
    return null;
  }
}

/**
 * Check TTS generation status from MuAPI
 * Endpoint: GET https://api.muapi.ai/api/v1/predictions/{request_id}/result
 */
export async function checkTTSStatus(requestId, apiKey) {
  if (!apiKey || requestId.startsWith('mock-')) {
    return {
      status: 'completed',
      audioUrl: null,
      progress: 100
    };
  }

  try {
    const response = await fetch(`${MUAPI_BASE_URL}/api/v1/predictions/${requestId}/result`, {
      headers: {
        'x-api-key': apiKey
      }
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
 * Generate voice-over audio using OpenAI TTS (FALLBACK)
 * Use this if MuAPI ElevenLabs fails
 */
export async function generateVoiceOverOpenAI(script, voice = 'alloy', apiKey) {
  if (!apiKey) {
    return null; // No voice without API key
  }

  try {
    const response = await fetch(`${OPENAI_API_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: script,
        voice: voice, // alloy, echo, fable, onyx, nova, shimmer
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI TTS generation failed');
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
 * Tries MuAPI ElevenLabs first, falls back to OpenAI TTS
 */
export async function generateVoiceOver(script, apiKeys = {}, options = {}) {
  const { muapiKey, openaiKey } = apiKeys;

  // Try MuAPI ElevenLabs first (primary)
  if (muapiKey) {
    const result = await generateVoiceOverMuAPI(script, muapiKey, options);
    if (result) {
      return { provider: 'muapi', ...result };
    }
  }

  // Fallback to OpenAI TTS
  if (openaiKey) {
    const blob = await generateVoiceOverOpenAI(script, options.voice || 'alloy', openaiKey);
    if (blob) {
      return { provider: 'openai', audioBlob: blob, status: 'completed' };
    }
  }

  return null;
}

// =====================================================
// MUAPI INTEGRATION (Seedance 2.5 Image-to-Video)
// =====================================================

/**
 * Generate video clip from image using MuAPI Seedance 2.5
 * Endpoint: POST https://api.muapi.ai/api/v1/seedance-2.5-image-to-video
 * Pricing: $0.34/sec (720p), $0.17/sec (480p), $0.85/sec (1080p)
 */
export async function generateVideoClip(imageUrl, prompt, apiKey, options = {}) {
  if (!apiKey) {
    // Return mock response
    return {
      requestId: `mock-${Date.now()}`,
      status: 'pending',
      estimatedTime: 30
    };
  }

  const {
    resolution = '720p', // 480p, 720p, 1080p, 4k
    duration = 5,
    seed = -1,
    highBitrate = false
  } = options;

  try {
    const response = await fetch(`${MUAPI_BASE_URL}/api/v1/seedance-2.5-image-to-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        prompt,
        image_url: imageUrl,
        resolution,
        duration,
        seed,
        high_bitrate: highBitrate
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'MuAPI Seedance 2.5 generation failed');
    }

    const data = await response.json();
    return {
      requestId: data.request_id,
      status: 'processing',
      estimatedTime: duration * 12 // Estimate ~12 seconds processing per second of video
    };
  } catch (error) {
    console.error('MuAPI Seedance 2.5 error:', error);
    throw error;
  }
}

/**
 * Check video generation status from MuAPI
 * Endpoint: GET https://api.muapi.ai/api/v1/predictions/{request_id}/result
 */
export async function checkVideoStatus(requestId, apiKey) {
  if (!apiKey || requestId.startsWith('mock-')) {
    // Mock completed response
    return {
      status: 'completed',
      videoUrl: null, // Will be replaced with Remotion preview
      progress: 100
    };
  }

  try {
    const response = await fetch(`${MUAPI_BASE_URL}/api/v1/predictions/${requestId}/result`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Status check failed');
    }

    const data = await response.json();
    return {
      status: data.status, // pending, processing, completed, failed
      videoUrl: data.output?.video_url || data.video_url,
      progress: data.progress || 0
    };
  } catch (error) {
    console.error('Status check error:', error);
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
  const { openaiKey, muapiKey } = apiKeys;

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
    const analysis = await analyzeAndImprovePrompt(imageUrls, prompt, openaiKey);

    // Update project with improved prompt
    await updateProject(project.id, {
      improved_prompt: analysis.improvedPrompt
    });

    // Step 4: Generate clips with MuAPI
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
        analysis.improvedPrompt,
        muapiKey,
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
  deletePhoto,

  // OpenAI (GPT-4o Vision)
  analyzeAndImprovePrompt,

  // Voice-over (MuAPI ElevenLabs primary, OpenAI fallback)
  generateVoiceOver,           // Auto-fallback wrapper
  generateVoiceOverMuAPI,      // MuAPI ElevenLabs TTS Turbo 2.5 (primary)
  generateVoiceOverOpenAI,     // OpenAI TTS-1 (fallback)
  checkTTSStatus,              // MuAPI TTS status polling

  // MuAPI (Seedance 2.5 Image-to-Video)
  generateVideoClip,
  checkVideoStatus,

  // Remotion
  triggerRemotionRender,
  checkRenderStatus,

  // Full workflow
  generateVideo
};

export default contentStudioV2Service;
