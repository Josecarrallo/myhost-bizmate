import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Upload,
  Film,
  Settings,
  Sparkles,
  Music,
  Type,
  Download,
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  History,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Backend API URL - uses environment variable or defaults to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ContentStudio = ({ onBack }) => {
  const { userData } = useAuth();
  const videoResultRef = useRef(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Customize, 3: Generate, 4: Result, 5: History
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoHistory, setVideoHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: 'NISMARA UMA VILLA',
    subtitle: 'Discover Your Balinese Sanctuary',
    cameraPrompt: 'slow zoom in, cinematic',
    music: 'background-music.mp3'
  });

  // Camera movement presets
  const cameraPresets = [
    { id: 'zoom-in', label: '🎬 Cinematic Zoom', prompt: 'slow zoom in, cinematic' },
    { id: 'pan-left', label: '🌊 Ocean Breeze', prompt: 'gentle pan left to right, tropical ambiance' },
    { id: 'zoom-out', label: '🌅 Sunset Reveal', prompt: 'dramatic zoom out, luxury villa reveal' },
    { id: 'custom', label: '✏️ Custom Prompt', prompt: '' }
  ];

  // Music options
  const musicOptions = [
    {
      id: 'tropical',
      label: 'Tropical Luxury',
      file: 'background-music.mp3',
      description: 'Relaxing ambient music with tropical vibes',
      icon: '🎵',
      mood: 'Relaxing'
    },
    {
      id: 'bali',
      label: 'Bali Sunrise',
      file: 'bali-sunrise.mp3',
      description: 'Uplifting Indonesian-inspired melody',
      icon: '🌴',
      mood: 'Uplifting'
    }
  ];

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setStep(2);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setStep(2);
    }
  };

  // Load video history from Supabase
  const loadVideoHistory = async () => {
    if (!userData?.id) {
      console.log('⚠️ No userData.id, cannot load videos');
      return;
    }

    console.log('📂 Loading video history for user:', userData.id);
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('generated_videos')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Videos loaded from Supabase:', data?.length || 0, 'videos');
      console.log('📹 Videos:', data);
      setVideoHistory(data || []);
    } catch (error) {
      console.error('Error loading video history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load videos on mount
  useEffect(() => {
    loadVideoHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  // Auto-scroll to video when generation completes
  useEffect(() => {
    if (step === 4 && videoResultRef.current) {
      setTimeout(() => {
        videoResultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [step]);

  // Generate video
  const handleGenerateVideo = async () => {
    setStep(3);
    setGenerating(true);
    setProgress(0);

    try {
      // Get user auth token
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('image', uploadedImage);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('cameraPrompt', formData.cameraPrompt);
      formDataToSend.append('music', formData.music);
      formDataToSend.append('userId', userData?.id || '');
      formDataToSend.append('authToken', authToken || ''); // Send auth token for RLS

      // Simulate progress while waiting for backend
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 3;
        });
      }, 1000);

      console.log('🚀 Sending video generation request to backend...');

      // Call backend API
      const response = await fetch(`${API_URL}/api/generate-video`, {
        method: 'POST',
        body: formDataToSend
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Video generation failed');
      }

      const result = await response.json();

      setProgress(100);
      setGenerating(false);
      setGeneratedVideo({
        url: result.videoUrl.startsWith('http') ? result.videoUrl : `${API_URL}${result.videoUrl}`,
        thumbnail: imagePreview,
        title: formData.title,
        filename: result.filename
      });
      setStep(4);

      console.log('✅ Video generated successfully:', result);

      // Reload video history to show the new video
      await loadVideoHistory();

    } catch (error) {
      console.error('❌ Error generating video:', error);
      setGenerating(false);
      setProgress(0);
      alert(`Error generating video: ${error.message}\n\nMake sure the backend server is running on port 3001.`);
      setStep(2); // Go back to customize step
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-[#d85a2a]/20 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#FF8C42] hover:text-[#d85a2a] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Marketing</span>
          </button>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2 justify-center">
              <Film className="w-8 h-8 text-[#FF8C42]" />
              AI Video Generator
            </h2>
            <p className="text-sm text-[#FF8C42] mt-1">Create cinematic videos from your photos</p>
          </div>
          <button
            onClick={() => setStep(step === 5 ? 1 : 5)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF8C42]/10 text-[#FF8C42] rounded-xl hover:bg-[#FF8C42]/20 transition-all border border-[#FF8C42]/30"
          >
            <History className="w-5 h-5" />
            <span className="font-semibold">{step === 5 ? 'New Video' : 'My Videos'}</span>
            {videoHistory.length > 0 && step !== 5 && (
              <span className="bg-[#FF8C42] text-white text-xs px-2 py-0.5 rounded-full">{videoHistory.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/5 border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {[
            { num: 1, label: 'Upload Photo', icon: Upload },
            { num: 2, label: 'Customize', icon: Settings },
            { num: 3, label: 'Generate', icon: Sparkles },
            { num: 4, label: 'Download', icon: Download }
          ].map((s, idx) => {
            const Icon = s.icon;
            const isActive = step >= s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? 'bg-[#d85a2a] border-[#FF8C42] text-white'
                      : 'bg-white/5 border-white/20 text-white/40'
                  } ${isCurrent ? 'ring-4 ring-[#FF8C42]/30' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 ${isActive ? 'bg-[#FF8C42]' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">

          {/* STEP 1: Upload Photo */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-4 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-[#FF8C42] transition-all bg-white/5"
              >
                <Upload className="w-16 h-16 text-[#FF8C42] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Upload Your Villa Photo</h3>
                <p className="text-white/60 mb-6">Drag & drop or click to browse</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-xl font-semibold cursor-pointer hover:shadow-lg transition-all inline-block">
                    Choose Photo
                  </span>
                </label>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4">💡 Tips for Best Results:</h4>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Use high-resolution photos (1920x1080 or larger)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Choose photos with clear focal points (pool, entrance, bedroom)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Best results with landscape orientation</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: Customize */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">📸 Your Photo</h3>
                <img src={imagePreview} alt="Preview" className="w-full rounded-xl" />
              </div>

              {/* Customization Form */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#FF8C42]" />
                  Customize Your Video
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    <Type className="w-4 h-4 inline mr-2" />
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#FF8C42] focus:outline-none"
                    placeholder="e.g., VILLA SUNSET PARADISE"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    <Type className="w-4 h-4 inline mr-2" />
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#FF8C42] focus:outline-none"
                    placeholder="e.g., Your Dream Bali Escape"
                  />
                </div>

                {/* Camera Movement */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-3">
                    <Film className="w-4 h-4 inline mr-2" />
                    Camera Movement
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {cameraPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setFormData({ ...formData, cameraPrompt: preset.prompt })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.cameraPrompt === preset.prompt
                            ? 'bg-[#d85a2a]/20 border-[#FF8C42]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className="text-white font-semibold">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                  {formData.cameraPrompt !== cameraPresets.find(p => p.id === 'custom')?.prompt && (
                    <input
                      type="text"
                      value={formData.cameraPrompt}
                      onChange={(e) => setFormData({ ...formData, cameraPrompt: e.target.value })}
                      className="w-full mt-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#FF8C42] focus:outline-none"
                      placeholder="Custom camera movement prompt..."
                    />
                  )}
                </div>

                {/* Music Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-3">
                    <Music className="w-4 h-4 inline mr-2" />
                    Background Music Library
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {musicOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData({ ...formData, music: option.file })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.music === option.file
                            ? 'bg-[#d85a2a]/20 border-[#FF8C42] shadow-lg'
                            : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{option.icon}</div>
                          <div className="flex-1">
                            <div className="text-white font-bold mb-1">{option.label}</div>
                            <div className="text-white/60 text-xs mb-2">{option.description}</div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-white/10 text-white/80 text-xs rounded-full">
                                {option.mood}
                              </span>
                              {formData.music === option.file && (
                                <CheckCircle className="w-4 h-4 text-[#FF8C42]" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateVideo}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Video ($0.60)
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Generating */}
          {step === 3 && (
            <div className="bg-white/5 rounded-2xl p-12 border border-white/10 text-center">
              <Loader2 className="w-16 h-16 text-[#FF8C42] mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-bold text-white mb-4">Generating Your Video...</h3>
              <p className="text-white/60 mb-6">This will take about 2-3 minutes</p>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white/80 font-semibold">{progress}%</p>

              {/* Status Messages */}
              <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
                <div className={`flex items-center gap-3 ${progress >= 20 ? 'text-green-400' : 'text-white/40'}`}>
                  {progress >= 20 ? <CheckCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Uploading photo to server...</span>
                </div>
                <div className={`flex items-center gap-3 ${progress >= 40 ? 'text-green-400' : 'text-white/40'}`}>
                  {progress >= 40 ? <CheckCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Generating cinematic video with LTX-2 AI...</span>
                </div>
                <div className={`flex items-center gap-3 ${progress >= 80 ? 'text-green-400' : 'text-white/40'}`}>
                  {progress >= 80 ? <CheckCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Adding branding and music with Remotion...</span>
                </div>
                <div className={`flex items-center gap-3 ${progress >= 100 ? 'text-green-400' : 'text-white/40'}`}>
                  {progress >= 100 ? <CheckCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Finalizing your video...</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Result */}
          {step === 4 && generatedVideo && (
            <div ref={videoResultRef} className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Your Video is Ready!
                </h3>

                {/* Video Player */}
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    key={generatedVideo.url}
                    controls
                    className="w-full rounded-xl"
                    poster={generatedVideo.thumbnail}
                    onError={(e) => console.error('❌ Video load error:', e, 'URL:', generatedVideo.url)}
                    onLoadStart={() => console.log('🎬 Video loading from:', generatedVideo.url)}
                  >
                    <source src={generatedVideo.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

              </div>

              {/* Video Info */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#FF8C42]">10s</div>
                    <div className="text-sm text-white/60">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#FF8C42]">1920x1080</div>
                    <div className="text-sm text-white/60">Resolution</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#FF8C42]">~18 MB</div>
                    <div className="text-sm text-white/60">File Size</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setUploadedImage(null);
                    setImagePreview(null);
                    setGeneratedVideo(null);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create Another Video
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-white/60 text-sm">
                  💡 Tip: Click the 3 dots (⋮) on the video player to download
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Video History */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <History className="w-7 h-7 text-[#FF8C42]" />
                  My Generated Videos
                </h3>

                {loadingHistory ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-[#FF8C42] animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading your videos...</p>
                  </div>
                ) : videoHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Film className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">No videos generated yet</p>
                    <p className="text-white/40 text-sm mt-2">Create your first video to see it here</p>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Create First Video
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Title</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Subtitle</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Size</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Resolution</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">File</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {videoHistory.map((video) => (
                          <tr key={video.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-white font-medium">{video.title}</td>
                            <td className="px-6 py-4 text-white/60 text-sm">{video.subtitle || '-'}</td>
                            <td className="px-6 py-4 text-white/60 text-sm">
                              {new Date(video.created_at).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 text-white/60 text-sm">{video.file_size_mb} MB</td>
                            <td className="px-6 py-4 text-white/60 text-sm">{video.resolution}</td>
                            <td className="px-6 py-4 text-white/60 text-sm font-mono text-xs">{video.filename}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ContentStudio;
