import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  X,
  Image,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Music,
  Mic,
  Type,
  Layers,
  Download,
  Save,
  Settings,
  Loader2,
  Check,
  AlertCircle,
  Video,
  Wand2,
  RefreshCw,
  GripVertical,
  Plus,
  Trash2,
  FolderOpen,
  Clock
} from 'lucide-react';
import { Player } from '@remotion/player';
import { useAuth } from '../../contexts/AuthContext';
import { contentStudioV2Service } from '../../services/contentStudioV2Service';
import { PropertyPromo, getVideoDimensions } from './remotion/PropertyPromo';

// Royalty-free music tracks (local files in /public/audio/)
const MUSIC_TRACKS = {
  ambient: {
    name: 'Ambient Relaxation',
    url: '/audio/ambient.mp3'
  },
  upbeat: {
    name: 'Upbeat Energy',
    url: '/audio/upbeat.mp3'
  },
  cinematic: {
    name: 'Cinematic Epic',
    url: '/audio/cinematic.mp3'
  },
  tropical: {
    name: 'Tropical Vibes',
    url: '/audio/tropical.mp3'
  },
  lofi: {
    name: 'Lofi Chill',
    url: '/audio/lofi.mp3'
  }
};

/**
 * Content Studio V2 - AI Video Generator
 *
 * Modelo: OpenAI + MuAPI + Remotion
 *
 * Flujo:
 * 1. Upload 2-3 fotos
 * 2. Escribir prompt
 * 3. OpenAI analiza y mejora prompt
 * 4. MuAPI genera 1 clip por foto (4-5 segundos)
 * 5. Remotion une clips con transiciones
 * 6. Editor básico para ajustes
 * 7. Export MP4 final
 */

const ContentStudioV2 = ({ onBack, setSidebarCollapsed, sidebarCollapsed }) => {
  const { userData } = useAuth();
  // ========================================
  // STATE
  // ========================================

  // Step wizard: upload -> prompt -> generating -> editor -> export
  const [currentStep, setCurrentStep] = useState('upload');

  // Photos uploaded (2-3 max)
  const [photos, setPhotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Prompt
  const [prompt, setPrompt] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');

  // Scenes/Clips (generated from photos)
  const [scenes, setScenes] = useState([]);

  // Video URL (from export or loaded project)
  const [videoUrl, setVideoUrl] = useState(null);

  // Editor controls
  const [editorSettings, setEditorSettings] = useState({
    text: {
      enabled: true,
      title: '',
      subtitle: '',
      position: 'bottom' // top, center, bottom
    },
    voice: {
      enabled: false,
      script: '',
      voice: 'alloy' // OpenAI voice
    },
    music: {
      enabled: true,
      track: 'ambient', // ambient, upbeat, cinematic
      volume: 0.7
    },
    logo: {
      enabled: false,
      url: '',
      position: 'bottom-right' // top-left, top-right, bottom-left, bottom-right
    },
    subtitles: {
      enabled: false,
      language: 'en'
    },
    format: '9:16' // 9:16, 16:9, 1:1
  });

  // Preview state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportJobId, setExportJobId] = useState(null); // Job ID for download
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track if settings changed after last export

  // Project
  const [projectId, setProjectId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Prevent double-click

  // Saved projects list - initialized empty, loaded from DB
  const [savedProjects, setSavedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true); // Start loading
  const [showProjectsList, setShowProjectsList] = useState(false);

  // API Keys (from env or user settings)
  const [apiKeys, setApiKeys] = useState({
    openaiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    muapiKey: import.meta.env.VITE_MUAPI_API_KEY || ''
  });

  // Remotion Player ref
  const playerRef = useRef(null);

  // Audio ref for background music (separate from Remotion for reliability)
  const audioRef = useRef(null);

  // ========================================
  // AUDIO CONTROL - Simple and Direct
  // ========================================

  // Play/Stop music function
  const playMusic = () => {
    const audio = audioRef.current;
    if (audio && editorSettings.music.enabled) {
      audio.volume = editorSettings.music.volume || 0.7;
      audio.play()
        .then(() => {
          setIsMusicPlaying(true);
          console.log('🎵 Music started');
        })
        .catch(e => console.log('Audio play blocked:', e));
    }
  };

  const stopMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsMusicPlaying(false);
      console.log('🎵 Music stopped');
    }
  };

  const pauseMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsMusicPlaying(false);
      console.log('🎵 Music paused');
    }
  };

  // When track changes, update source and restart if was playing
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && MUSIC_TRACKS[editorSettings.music.track]) {
      const newSrc = MUSIC_TRACKS[editorSettings.music.track].url;
      const wasPlaying = isMusicPlaying; // Use state, not audio.paused

      console.log('🎵 Track changed to:', editorSettings.music.track, 'wasPlaying:', wasPlaying);

      // Update source
      audio.src = newSrc;
      audio.load();

      // If was playing, restart with new track
      if (wasPlaying && editorSettings.music.enabled) {
        setTimeout(() => {
          audio.volume = editorSettings.music.volume || 0.7;
          audio.play()
            .then(() => {
              setIsMusicPlaying(true);
              console.log('🎵 New track playing');
            })
            .catch(e => console.log('Audio autoplay blocked:', e));
        }, 100); // Small delay to let load() complete
      }
    }
  }, [editorSettings.music.track]);

  // Handle music enable/disable
  useEffect(() => {
    if (!editorSettings.music.enabled && isMusicPlaying) {
      pauseMusic();
    }
  }, [editorSettings.music.enabled]);

  // Update volume when changed
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = editorSettings.music.volume || 0.7;
    }
  }, [editorSettings.music.volume]);

  // ========================================
  // LOAD SAVED PROJECTS
  // ========================================

  useEffect(() => {
    if (userData?.id) {
      loadSavedProjects();
    }
  }, [userData?.id]);

  const loadSavedProjects = async () => {
    if (!userData?.id) return;

    setLoadingProjects(true);
    try {
      // In this codebase, userData.id IS the tenant_id
      const projects = await contentStudioV2Service.getProjects(userData.id);
      console.log('📁 Loaded projects from DB:', projects.length, projects);
      setSavedProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setSavedProjects([]); // Reset to empty on error
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await contentStudioV2Service.deleteProject(projectId);
      setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const loadProject = async (project) => {
    setProjectId(project.id);
    setPrompt(project.prompt || '');
    setImprovedPrompt(project.improved_prompt || '');
    setEditorSettings(project.settings || editorSettings);
    setVideoUrl(project.output_url || null);

    const projectScenes = project.scenes || [];
    setScenes(projectScenes);

    // Restore photos from scenes if available
    if (projectScenes.length > 0) {
      const restoredPhotos = projectScenes.map((scene, index) => ({
        id: scene.photoId || `photo-restored-${index}`,
        url: scene.photoUrl,
        name: `Photo ${index + 1}`
      }));
      setPhotos(restoredPhotos);
      setCurrentStep('editor');
    } else if (project.prompt) {
      setCurrentStep('prompt');
    } else {
      setCurrentStep('upload');
    }

    setShowProjectsList(false);
  };

  // ========================================
  // HANDLERS
  // ========================================

  // Drag & Drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [photos]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const remaining = 3 - photos.length;
    const toAdd = imageFiles.slice(0, remaining);

    // Convert files to base64 for persistence (blob URLs expire on page reload)
    const newPhotos = await Promise.all(toAdd.map(async (file) => {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      return {
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        url: base64, // Use base64 instead of blob URL
        name: file.name
      };
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const reorderPhotos = (fromIndex, toIndex) => {
    setPhotos(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  // Generate video clips from photos
  const handleGenerate = async () => {
    if (photos.length < 2) return;
    if (!userData?.id) {
      setGenerationStatus('Error: User not authenticated');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');
    setGenerationProgress(0);

    // Use mock generation directly to avoid Supabase RLS issues
    // This allows testing the preview and music functionality
    console.log('🎬 Starting mock generation (bypassing Supabase to avoid RLS issues)');
    await handleMockGenerate();
    setIsGenerating(false);
  };

  // Mock generation fallback (when API keys not available)
  const handleMockGenerate = async () => {
    setGenerationStatus('Using demo mode...');
    setGenerationProgress(10);
    await mockDelay(1000);

    setGenerationStatus('Analyzing images...');
    setGenerationProgress(30);
    await mockDelay(1500);
    setImprovedPrompt(prompt + ' (Enhanced with cinematic movements and smooth transitions)');

    const newScenes = [];
    for (let i = 0; i < photos.length; i++) {
      setGenerationStatus(`Preparing clip ${i + 1} of ${photos.length}...`);
      setGenerationProgress(40 + (i * 20));
      await mockDelay(1000);

      newScenes.push({
        id: `scene-${i}`,
        photoId: photos[i].id,
        photoUrl: photos[i].url,
        clipUrl: null,
        duration: 4.5,
        status: 'ready'
      });
    }

    setScenes(newScenes);
    setGenerationProgress(100);
    setGenerationStatus('Ready!');
    await mockDelay(500);
    setCurrentStep('editor');
  };

  // Regenerate single clip
  const regenerateClip = async (sceneId) => {
    const sceneIndex = scenes.findIndex(s => s.id === sceneId);
    if (sceneIndex === -1) return;

    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, status: 'generating' } : s
    ));

    await mockDelay(2000);

    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, status: 'ready' } : s
    ));
  };

  // Reorder scenes
  const reorderScenes = (fromIndex, toIndex) => {
    setScenes(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  // Helper: Convert blob URL to File
  const blobUrlToFile = async (blobUrl, filename) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // Export final video using AWS Lambda + Remotion
  const handleExport = async () => {
    if (scenes.length === 0) {
      alert('No scenes to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Get video server URL from env or default
      const videoServerUrl = import.meta.env.VITE_VIDEO_SERVER_URL || 'http://localhost:3001';

      // First check if video server is available
      try {
        const healthCheck = await fetch(`${videoServerUrl}/api/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        if (!healthCheck.ok) {
          throw new Error('Video server not responding');
        }
      } catch (healthError) {
        throw new Error('Video server is not running. Start it with: cd video && node server.cjs');
      }

      setExportProgress(5);

      // Convert blob URLs to base64 for server rendering
      // Blob URLs are browser-local and cannot be accessed by the server
      const uploadedScenes = [];
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        let photoUrl = scene.photoUrl;

        console.log(`Processing scene ${i + 1}: URL type = ${photoUrl?.substring(0, 30)}...`);

        // If it's a blob URL (legacy), convert to base64
        // Note: New uploads are already base64 (data:image)
        if (photoUrl && photoUrl.startsWith('blob:')) {
          setExportProgress(5 + Math.round((i / scenes.length) * 10));

          try {
            console.log(`Converting blob to base64 for scene ${i + 1}...`);
            const response = await fetch(photoUrl);

            if (!response.ok) {
              throw new Error(`Failed to fetch blob: ${response.status}`);
            }

            const blob = await response.blob();
            console.log(`Blob fetched, size: ${blob.size}, type: ${blob.type}`);

            const base64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (reader.result) {
                  resolve(reader.result);
                } else {
                  reject(new Error('FileReader returned empty result'));
                }
              };
              reader.onerror = () => reject(new Error('FileReader error'));
              reader.readAsDataURL(blob);
            });

            console.log(`Base64 conversion successful, length: ${base64.length}`);
            photoUrl = base64;
          } catch (e) {
            console.error(`Failed to convert blob to base64 for scene ${i + 1}:`, e);
            throw new Error(`Failed to process image ${i + 1}: ${e.message}. Please try re-uploading the photos.`);
          }
        }

        uploadedScenes.push({
          photoUrl,
          duration: scene.duration
        });
      }

      console.log(`All ${uploadedScenes.length} scenes processed. First scene URL type: ${uploadedScenes[0]?.photoUrl?.substring(0, 30)}...`);

      setExportProgress(20);

      // Prepare export data with public URLs
      const exportData = {
        scenes: uploadedScenes,
        settings: {
          format: editorSettings.format,
          text: editorSettings.text,
          music: {
            enabled: editorSettings.music.enabled,
            track: editorSettings.music.track,
            volume: editorSettings.music.volume
          }
        },
        totalDuration,
        userId: userData?.id
      };

      setExportProgress(25);

      // Call video server to render with Lambda
      const response = await fetch(`${videoServerUrl}/api/export-slideshow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Poll for progress
      const { jobId } = await response.json();
      setExportJobId(jobId); // Save for download
      setExportProgress(30);

      // Poll progress until complete
      let complete = false;
      let videoUrl = null;

      while (!complete) {
        await mockDelay(2000);

        const progressRes = await fetch(`${videoServerUrl}/api/export-progress/${jobId}`);
        const progressData = await progressRes.json();

        setExportProgress(30 + Math.round(progressData.progress * 60));

        if (progressData.status === 'completed') {
          complete = true;
          videoUrl = progressData.videoUrl;
        } else if (progressData.status === 'failed') {
          throw new Error(progressData.error || 'Export failed');
        }
      }

      setExportProgress(92);

      // Save the video URL
      if (videoUrl) {
        console.log('Video URL generated:', videoUrl);
        setVideoUrl(videoUrl);
        setHasUnsavedChanges(false); // Reset - video now matches current settings
        setExportProgress(100);
      } else {
        setExportProgress(100);
      }

    } catch (error) {
      console.error('Export error:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Save project (with double-click protection)
  const handleSave = async () => {
    // Prevent double-click
    if (isSaving) {
      console.log('⚠️ Save already in progress, ignoring click');
      return;
    }

    if (!userData?.id) {
      alert('You must log in to save projects');
      return;
    }

    setIsSaving(true); // Block further clicks

    try {
      const projectData = {
        prompt,
        improved_prompt: improvedPrompt,
        settings: editorSettings,
        scenes,
        output_url: videoUrl,
        status: videoUrl ? 'exported' : 'draft'
      };

      if (projectId) {
        // Update existing project
        await contentStudioV2Service.updateProject(projectId, projectData);
      } else {
        // Create new project - userData.id IS the tenant_id in this codebase
        const project = await contentStudioV2Service.createProject(userData.id, {
          name: `Video ${new Date().toLocaleDateString()}`,
          ...projectData,
          format: editorSettings.format
        });
        setProjectId(project.id);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);

      // Refresh projects list
      await loadSavedProjects();

    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving: ' + error.message);
    } finally {
      setIsSaving(false); // Re-enable button
    }
  };

  // Mock delay helper
  const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // ========================================
  // RENDER HELPERS
  // ========================================

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  // ========================================
  // RENDER: UPLOAD STEP
  // ========================================
  const renderUploadStep = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Photos</h2>
        <p className="text-gray-400">Select 2-3 property photos to create your AI video</p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all
          ${dragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-gray-600 hover:border-gray-500 bg-[#2a2f3a]/50'
          }
          ${photos.length >= 3 ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={photos.length >= 3}
        />

        <div className="text-center">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-orange-500' : 'text-gray-500'}`} />
          <p className="text-lg font-medium text-white mb-1">
            {photos.length >= 3 ? 'Maximum 3 photos reached' : 'Drop photos here or click to upload'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG up to 10MB each • {3 - photos.length} more photo{3 - photos.length !== 1 ? 's' : ''} allowed
          </p>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">
              Selected Photos ({photos.length}/3)
            </h3>
            <p className="text-xs text-gray-500">Drag to reorder</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-[#1f2937] border border-gray-700"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Order badge */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* Add more placeholder */}
            {photos.length < 3 && (
              <label className="aspect-[9/16] rounded-xl border-2 border-dashed border-gray-600 hover:border-gray-500 bg-[#1f2937]/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Plus className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep('prompt')}
          disabled={photos.length < 2}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
            ${photos.length >= 2
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // ========================================
  // RENDER: PROMPT STEP
  // ========================================
  const renderPromptStep = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Describe Your Video</h2>
        <p className="text-gray-400">Tell us what kind of video you want to create</p>
      </div>

      {/* Photo preview */}
      <div className="flex justify-center gap-3">
        {photos.map((photo, index) => (
          <div key={photo.id} className="w-20 h-32 rounded-lg overflow-hidden border border-gray-700">
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Your Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Create a cinematic tour of this luxury Bali villa, showcasing the pool, bedroom, and tropical garden views..."
          rows={4}
          className="w-full px-4 py-3 bg-[#1f2937] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
        />
        <p className="text-xs text-gray-500">
          Tip: Describe the mood, camera movements, and key features you want to highlight
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-3">
        <p className="text-sm text-gray-400">Quick templates:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Luxury villa tour with smooth transitions',
            'Tropical paradise showcase',
            'Romantic getaway promo',
            'Family vacation highlight'
          ].map((template) => (
            <button
              key={template}
              onClick={() => setPrompt(template)}
              className="px-3 py-1.5 bg-[#2a2f3a] text-gray-300 text-sm rounded-lg hover:bg-[#374151] transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Video Format
        </label>
        <div className="flex gap-3">
          {[
            { value: '9:16', label: 'Vertical (9:16)', desc: 'Reels, TikTok, Shorts' },
            { value: '16:9', label: 'Horizontal (16:9)', desc: 'YouTube, Website' },
            { value: '1:1', label: 'Square (1:1)', desc: 'Instagram Feed' }
          ].map((format) => (
            <button
              key={format.value}
              onClick={() => setEditorSettings(prev => ({ ...prev, format: format.value }))}
              className={`
                flex-1 p-3 rounded-xl border transition-all text-left
                ${editorSettings.format === format.value
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <p className="font-medium text-white text-sm">{format.label}</p>
              <p className="text-xs text-gray-500">{format.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('upload')}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
            ${prompt.trim()
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Wand2 className="w-5 h-5" />
          Generate Video
        </button>
      </div>
    </div>
  );

  // ========================================
  // RENDER: GENERATING STEP
  // ========================================
  const renderGeneratingStep = () => (
    <div className="max-w-xl mx-auto text-center space-y-8 py-12">
      {/* Animated Icon */}
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping"></div>
        <div className="absolute inset-4 bg-orange-500/30 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Video className="w-16 h-16 text-orange-500" />
        </div>
      </div>

      {/* Status */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Creating Your Video</h2>
        <p className="text-gray-400">{generationStatus}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${generationProgress}%` }}
        />
      </div>

      <p className="text-sm text-gray-500">
        This usually takes 30-60 seconds
      </p>
    </div>
  );

  // ========================================
  // RENDER: EDITOR STEP
  // ========================================
  const renderEditorStep = () => (
    <div className="flex gap-6 h-full">
      {/* Left: Preview */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Preview</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {totalDuration.toFixed(1)}s total
            </span>
          </div>
        </div>

        {/* Video Preview - Remotion Player */}
        <div className="flex-1 bg-black rounded-2xl overflow-hidden flex items-center justify-center relative">
          {scenes.length > 0 ? (
            <>
              <Player
                ref={playerRef}
                component={PropertyPromo}
                inputProps={{
                  scenes: scenes,
                  settings: {
                    ...editorSettings,
                    music: { enabled: false } // Audio handled by HTML audio element
                  },
                  format: editorSettings.format
                }}
                durationInFrames={Math.round(totalDuration * 30)} // 30 fps
                fps={30}
                compositionWidth={getVideoDimensions(editorSettings.format).width}
                compositionHeight={getVideoDimensions(editorSettings.format).height}
                style={{
                  width: '100%',
                  maxHeight: '100%',
                  aspectRatio: editorSettings.format === '9:16' ? '9/16' :
                               editorSettings.format === '16:9' ? '16/9' : '1/1'
                }}
                controls
                autoPlay={false}
                loop={false}
                clickToPlay
              />
              {/* Hidden audio element for background music - always rendered */}
              <audio
                ref={audioRef}
                src={MUSIC_TRACKS[editorSettings.music.track]?.url || ''}
                loop
                preload="auto"
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <div className="text-gray-500 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No scenes to preview</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mt-4 bg-[#1f2937] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => {
                if (playerRef.current) {
                  if (isPlaying) {
                    playerRef.current.pause();
                    pauseMusic();
                  } else {
                    playerRef.current.play();
                    playMusic();
                  }
                  setIsPlaying(!isPlaying);
                }
              }}
              className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={() => {
                if (playerRef.current) {
                  playerRef.current.seekTo(0);
                  setCurrentTime(0);
                  stopMusic();
                  setIsPlaying(false);
                }
              }}
              className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">
              {(currentTime).toFixed(1)}s / {totalDuration.toFixed(1)}s
            </span>
          </div>

          {/* Scene Clips */}
          <div className="flex gap-2">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className="relative flex-1 h-16 rounded-lg overflow-hidden border-2 border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group"
              >
                <img src={scene.photoUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => regenerateClip(scene.id)}
                    className="p-1.5 bg-orange-500 rounded-lg"
                    title="Regenerate clip"
                  >
                    <RefreshCw className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-1 right-1 text-xs text-white bg-black/60 px-1 rounded">
                  {scene.duration}s
                </div>
                {scene.status === 'generating' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-80 bg-[#1f2937] rounded-2xl p-5 overflow-y-auto space-y-6 max-h-[calc(100vh-120px)]">
        <h3 className="text-lg font-bold text-white">Customize</h3>

        {/* Text Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-white">Text Overlay</span>
            </div>
            <button
              onClick={() => setEditorSettings(prev => ({
                ...prev,
                text: { ...prev.text, enabled: !prev.text.enabled }
              }))}
              className={`w-10 h-6 rounded-full transition-colors ${
                editorSettings.text.enabled ? 'bg-orange-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                editorSettings.text.enabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {editorSettings.text.enabled && (
            <div className="space-y-2 pl-6">
              <input
                type="text"
                placeholder="Title"
                value={editorSettings.text.title}
                onChange={(e) => setEditorSettings(prev => ({
                  ...prev,
                  text: { ...prev.text, title: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={editorSettings.text.subtitle}
                onChange={(e) => setEditorSettings(prev => ({
                  ...prev,
                  text: { ...prev.text, subtitle: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-white">AI Voice-over</span>
            </div>
            <button
              onClick={() => setEditorSettings(prev => ({
                ...prev,
                voice: { ...prev.voice, enabled: !prev.voice.enabled }
              }))}
              className={`w-10 h-6 rounded-full transition-colors ${
                editorSettings.voice.enabled ? 'bg-orange-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                editorSettings.voice.enabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {editorSettings.voice.enabled && (
            <div className="space-y-2 pl-6">
              <textarea
                placeholder="Voice-over script..."
                value={editorSettings.voice.script}
                onChange={(e) => setEditorSettings(prev => ({
                  ...prev,
                  voice: { ...prev.voice, script: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Music Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-white">Background Music</span>
            </div>
            <button
              onClick={() => setEditorSettings(prev => ({
                ...prev,
                music: { ...prev.music, enabled: !prev.music.enabled }
              }))}
              className={`w-10 h-6 rounded-full transition-colors ${
                editorSettings.music.enabled ? 'bg-orange-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                editorSettings.music.enabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {editorSettings.music.enabled && (
            <div className="space-y-2 pl-6">
              <select
                value={editorSettings.music.track}
                onChange={(e) => {
                  setEditorSettings(prev => ({
                    ...prev,
                    music: { ...prev.music, track: e.target.value }
                  }));
                  // Mark that we have changes that need re-export
                  if (videoUrl || exportJobId) {
                    setHasUnsavedChanges(true);
                  }
                }}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="ambient">Ambient</option>
                <option value="upbeat">Upbeat</option>
                <option value="cinematic">Cinematic</option>
                <option value="tropical">Tropical</option>
                <option value="lofi">Lofi Chill</option>
              </select>
              {/* Test music button */}
              <button
                onClick={() => {
                  if (isMusicPlaying) {
                    stopMusic();
                  } else {
                    playMusic();
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isMusicPlaying
                    ? 'bg-green-500/30 text-green-400 hover:bg-green-500/40'
                    : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                }`}
              >
                {isMusicPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isMusicPlaying ? '⏸ Stop' : '▶️ Play'}: {MUSIC_TRACKS[editorSettings.music.track]?.name || 'None'}
              </button>
            </div>
          )}
        </div>

        {/* Logo Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-white">Logo Watermark</span>
            </div>
            <button
              onClick={() => setEditorSettings(prev => ({
                ...prev,
                logo: { ...prev.logo, enabled: !prev.logo.enabled }
              }))}
              className={`w-10 h-6 rounded-full transition-colors ${
                editorSettings.logo.enabled ? 'bg-orange-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                editorSettings.logo.enabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-700 space-y-3">
          {/* Save Project Button */}
          <button
            onClick={handleSave}
            disabled={isExporting || isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2a2f3a] text-white rounded-xl hover:bg-[#374151] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Project'}
          </button>

          {/* Generate Video Button */}
          {/* Warning if settings changed after export */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Music changed - re-export to apply</span>
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={isExporting || scenes.length === 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-xl transition-colors disabled:opacity-50 ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600'
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Video... {exportProgress}%
              </>
            ) : hasUnsavedChanges ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Re-Export with New Music
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Generate Video MP4
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={async () => {
              // Priority 1: Use exportJobId if available (video just generated in this session)
              if (exportJobId) {
                const videoServerUrl = import.meta.env.VITE_VIDEO_SERVER_URL || 'http://localhost:3001';
                const downloadUrl = `${videoServerUrl}/api/download-video/${exportJobId}`;
                console.log('📥 Downloading via proxy:', downloadUrl);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `property-video-${Date.now()}.mp4`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
              }

              // Priority 2: Use videoUrl if available (from saved project or previous export)
              if (videoUrl) {
                console.log('📥 Downloading from S3:', videoUrl);
                // For S3 URLs, we need to fetch and create blob to force download
                try {
                  const response = await fetch(videoUrl);
                  if (!response.ok) throw new Error('Failed to fetch video');
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = `property-video-${Date.now()}.mp4`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(blobUrl);
                } catch (err) {
                  console.error('Download error:', err);
                  // Fallback: open in new tab
                  window.open(videoUrl, '_blank');
                }
                return;
              }

              // No video available
              alert('First generate the video with the "Generate Video MP4" button');
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
              (videoUrl || exportJobId)
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            <Download className="w-4 h-4" />
            {(videoUrl || exportJobId) ? 'Download Video' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );

  // ========================================
  // MAIN RENDER
  // ========================================
  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-orange-500" />
              Content Studio V2
            </h1>
            <p className="text-sm text-gray-500">AI Video Generator • OpenAI + MuAPI + Remotion</p>
          </div>
        </div>

        {/* Right side: Projects button + Step Indicator */}
        <div className="flex items-center gap-4">
          {/* My Projects Button */}
          <button
            onClick={() => setShowProjectsList(!showProjectsList)}
            className="flex items-center gap-2 px-3 py-2 bg-[#1f2937] hover:bg-[#374151] rounded-xl transition-colors text-sm"
          >
            <FolderOpen className="w-4 h-4 text-orange-500" />
            <span className="text-gray-300">My Projects</span>
            {!loadingProjects && savedProjects.length > 0 && (
              <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">
                {savedProjects.length}
              </span>
            )}
          </button>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {['upload', 'prompt', 'generating', 'editor'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  ${currentStep === step
                    ? 'bg-orange-500 text-white'
                    : ['upload', 'prompt', 'generating', 'editor'].indexOf(currentStep) > index
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-500'
                  }
                `}>
                  {['upload', 'prompt', 'generating', 'editor'].indexOf(currentStep) > index ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  <span className="capitalize">{step}</span>
                </div>
                {index < 3 && <ChevronRight className="w-4 h-4 text-gray-600" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Sidebar */}
      {showProjectsList && (
        <div className="absolute right-0 top-16 w-80 bg-[#1f2937] border-l border-gray-700 h-[calc(100%-4rem)] z-20 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">My Projects</h3>
              <button
                onClick={() => setShowProjectsList(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : savedProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved projects yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {savedProjects.map((project) => (
                <div
                  key={project.id}
                  className="w-full p-3 bg-[#2a2f3a] hover:bg-[#374151] rounded-xl transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => loadProject(project)}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium text-white text-sm truncate">{project.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          project.status === 'exported' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'prompt' && renderPromptStep()}
        {currentStep === 'generating' && renderGeneratingStep()}
        {currentStep === 'editor' && renderEditorStep()}
      </div>
    </div>
  );
};

export default ContentStudioV2;
