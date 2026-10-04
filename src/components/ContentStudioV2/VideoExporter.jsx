/**
 * VideoExporter - Componente limpio para generar y descargar videos MP4
 *
 * Este componente reemplaza la lógica rota del ContentStudioV2.
 * Funciona de forma independiente y guarda el video en Supabase.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const VIDEO_SERVER_URL = import.meta.env.VITE_VIDEO_SERVER_URL || 'http://localhost:3001';

export default function VideoExporter({
  projectId,
  scenes,
  settings,
  existingVideoUrl,  // URL del video ya generado (si existe)
  onVideoGenerated
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(existingVideoUrl ? 'completed' : 'idle');
  const [videoUrl, setVideoUrl] = useState(existingVideoUrl || null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sincronizar cuando cambia el video existente (al cargar otro proyecto)
  useEffect(() => {
    if (existingVideoUrl) {
      setVideoUrl(existingVideoUrl);
      setStatus('completed');
    } else {
      setVideoUrl(null);
      setStatus('idle');
    }
  }, [existingVideoUrl]);

  // Generar video MP4
  const handleGenerateVideo = async () => {
    if (!scenes || scenes.length === 0) {
      alert('No hay fotos para generar el video');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setStatus('exporting');
    setErrorMessage(null);

    try {
      console.log('🎬 Iniciando export...');
      console.log('📸 Scenes:', scenes.length);
      console.log('🎵 Music:', settings?.music?.track);

      // 1. Llamar al servidor para iniciar el export
      const response = await fetch(`${VIDEO_SERVER_URL}/api/export-slideshow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: scenes,
          settings: settings,
          totalDuration: scenes.reduce((sum, s) => sum + (s.duration || 4.5), 0)
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { jobId } = await response.json();
      console.log('📋 Job ID:', jobId);
      setProgress(10);

      // 2. Polling hasta completar
      let complete = false;
      let attempts = 0;
      const maxAttempts = 150; // 5 minutos máximo (150 * 2 segundos)

      while (!complete && attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        attempts++;

        const progressRes = await fetch(`${VIDEO_SERVER_URL}/api/export-progress/${jobId}`);

        if (!progressRes.ok) {
          console.log('⚠️ Progress check failed, retrying...');
          continue;
        }

        const progressData = await progressRes.json();
        console.log('📊 Progress:', progressData);

        // Actualizar progreso visual (10% a 90%)
        const visualProgress = 10 + Math.round(progressData.progress * 80);
        setProgress(visualProgress);

        if (progressData.status === 'completed' && progressData.videoUrl) {
          complete = true;
          setVideoUrl(progressData.videoUrl);
          setProgress(100);
          setStatus('completed');
          console.log('✅ Video generado:', progressData.videoUrl);

          // 3. Guardar en Supabase si tenemos projectId
          if (projectId) {
            const { error } = await supabase
              .from('video_projects')
              .update({
                output_url: progressData.videoUrl,
                status: 'exported',
                updated_at: new Date().toISOString()
              })
              .eq('id', projectId);

            if (error) {
              console.error('Error guardando en Supabase:', error);
            } else {
              console.log('💾 Guardado en Supabase');
            }
          }

          // Notificar al componente padre
          if (onVideoGenerated) {
            onVideoGenerated(progressData.videoUrl);
          }

        } else if (progressData.status === 'failed') {
          throw new Error(progressData.error || 'Export failed');
        }
      }

      if (!complete) {
        throw new Error('Timeout: El video tardó demasiado en generarse');
      }

    } catch (error) {
      console.error('❌ Error:', error);
      setStatus('error');
      setErrorMessage(error.message);
      setProgress(0);
    } finally {
      setIsExporting(false);
    }
  };

  // Descargar video
  const handleDownload = async () => {
    if (!videoUrl) {
      alert('No hay video para descargar. Genera uno primero.');
      return;
    }

    console.log('📥 Descargando:', videoUrl);

    try {
      // Descargar el video y forzar descarga
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Failed to fetch video');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      console.log('✅ Descarga iniciada');
    } catch (error) {
      console.error('Error descargando:', error);
      // Fallback: abrir en nueva pestaña
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      {/* Botón Generate */}
      <button
        onClick={handleGenerateVideo}
        disabled={isExporting || !scenes || scenes.length === 0}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          isExporting
            ? 'bg-orange-600 text-white cursor-wait'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generando... {progress}%
          </>
        ) : (
          <>
            <Video className="w-5 h-5" />
            Generate Video MP4
          </>
        )}
      </button>

      {/* Barra de progreso */}
      {isExporting && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Estado: Completado */}
      {status === 'completed' && videoUrl && (
        <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/50 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Video generado correctamente</span>
        </div>
      )}

      {/* Estado: Error */}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{errorMessage || 'Error generando video'}</span>
        </div>
      )}

      {/* Botón Download */}
      <button
        onClick={handleDownload}
        disabled={!videoUrl}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          videoUrl
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Download className="w-5 h-5" />
        {videoUrl ? 'Download Video' : 'Download (genera el video primero)'}
      </button>

      {/* Debug info (solo en desarrollo) */}
      {import.meta.env.DEV && videoUrl && (
        <div className="p-2 bg-gray-800 rounded text-xs text-gray-400 break-all">
          <strong>Video URL:</strong> {videoUrl}
        </div>
      )}
    </div>
  );
}
