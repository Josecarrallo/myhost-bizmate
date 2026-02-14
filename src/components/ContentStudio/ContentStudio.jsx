import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video, Wand2, Sparkles, CheckCircle, Clock, AlertCircle, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * Content Studio - AI Video Generation
 */
const ContentStudio = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('video-generator');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadGeneratedVideos();
  }, []);

  const loadGeneratedVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setGeneratedVideos(data || []);
    } catch (err) {
      console.error('Error loading videos:', err);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      setError('Please enter a video description');
      return;
    }

    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const result = await response.json();

      setSuccess('Video generation started! It will appear in your library when ready.');
      setVideoPrompt('');

      // Reload videos after a short delay
      setTimeout(() => {
        loadGeneratedVideos();
      }, 2000);

    } catch (err) {
      console.error('Error generating video:', err);
      setError('Error generating video: ' + err.message + '. Make sure the backend server is running on port 3001.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 p-4 md:p-6 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 mb-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onBack}
              className="p-2 md:p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 md:gap-3">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                Content Studio
              </h1>
              <p className="text-white/80 text-xs md:text-sm mt-1">AI-Powered Video Generation for Your Properties</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 md:mt-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('video-generator')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
              activeTab === 'video-generator'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Wand2 className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
            AI Video Generator
          </button>
          <button
            onClick={() => setActiveTab('my-videos')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
              activeTab === 'my-videos'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Video className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
            My Videos ({generatedVideos.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'video-generator' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <Wand2 className="w-6 h-6 md:w-7 md:h-7" />
              Generate AI Video
            </h2>

            {/* Video Prompt Input */}
            <div className="mb-4 md:mb-6">
              <label className="block text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">
                Describe the video you want to create:
              </label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Example: A serene video of a luxury villa in Bali with a beautiful infinity pool overlooking lush rice terraces at sunset..."
                className="w-full h-24 md:h-32 px-3 md:px-4 py-2 md:py-3 rounded-2xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50 resize-none text-sm md:text-base"
                disabled={generating}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/20 border-2 border-red-500/50 rounded-2xl flex items-start gap-2 md:gap-3">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-200 flex-shrink-0 mt-0.5" />
                <p className="text-red-100 text-sm md:text-base">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-500/20 border-2 border-green-500/50 rounded-2xl flex items-start gap-2 md:gap-3">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-200 flex-shrink-0 mt-0.5" />
                <p className="text-green-100 text-sm md:text-base">{success}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={generating || !videoPrompt.trim()}
              className={`w-full py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all shadow-lg ${
                generating || !videoPrompt.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              {generating ? (
                <>
                  <Clock className="w-5 h-5 md:w-6 md:h-6 inline mr-2 animate-spin" />
                  Generating Video... (This may take 1-2 minutes)
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 md:w-6 md:h-6 inline mr-2" />
                  Generate Video with LTX-2 Pro
                </>
              )}
            </button>

            {/* Info */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-500/20 border-2 border-blue-500/50 rounded-2xl">
              <p className="text-blue-100 text-xs md:text-sm">
                <strong>💡 How it works:</strong> Our AI uses LTX-2 Pro to generate stunning property videos based on your description. Videos are automatically branded with your Remotion template and saved to your library.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'my-videos' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <Video className="w-6 h-6 md:w-7 md:h-7" />
              My Generated Videos
            </h2>

            {generatedVideos.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Video className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-white/60" />
                <p className="text-white/80 text-base md:text-lg">No videos generated yet</p>
                <p className="text-white/60 text-xs md:text-sm mt-2">Create your first video using the AI Video Generator</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {generatedVideos.map((video) => (
                  <div key={video.id} className="bg-white/10 rounded-2xl p-3 md:p-4 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="aspect-video bg-gray-900/50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                      {video.video_url ? (
                        <video
                          src={video.video_url}
                          controls
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Clock className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 text-white/60 animate-spin" />
                          <p className="text-white/60 text-xs md:text-sm">Generating...</p>
                        </div>
                      )}
                    </div>
                    <p className="text-white font-semibold mb-2 line-clamp-2 text-sm md:text-base">{video.prompt}</p>
                    <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm">
                      {video.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                          <span>Completed</span>
                        </>
                      ) : video.status === 'processing' ? (
                        <>
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                          <span>Failed</span>
                        </>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-2">
                      {new Date(video.created_at).toLocaleDateString()} at {new Date(video.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStudio;
