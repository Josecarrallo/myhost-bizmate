/**
 * Remotion Composition - Property Promo Video
 *
 * This composition creates a video slideshow from property photos
 * with Ken Burns effect (zoom/pan), transitions, text overlays, and music.
 *
 * NEW ARCHITECTURE: OpenAI + MuAPI + Remotion (NOT LTX-2)
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Audio,
  Sequence,
  staticFile,
} from 'remotion';

// =====================================================
// INTERFACES
// =====================================================

interface SceneProps {
  src: string;
  startFrame: number;
  durationFrames: number;
  direction?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp';
}

interface TextOverlayProps {
  title?: string;
  subtitle?: string;
  position?: 'top' | 'center' | 'bottom';
  startFrame: number;
  durationFrames: number;
}

interface Scene {
  id?: string;
  photoUrl: string;
  clipUrl?: string;
  duration?: number;
}

interface TextSettings {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  position?: 'top' | 'center' | 'bottom';
}

interface MusicSettings {
  enabled?: boolean;
  track?: string;
  volume?: number;
}

interface Settings {
  text?: TextSettings;
  music?: MusicSettings;
}

interface PropertyPromoProps {
  scenes?: Scene[];
  settings?: Settings;
  format?: '9:16' | '16:9' | '1:1';
}

// =====================================================
// SCENE COMPONENT - Single photo with Ken Burns effect
// =====================================================

const Scene: React.FC<SceneProps> = ({ src, startFrame, durationFrames, direction = 'zoomIn' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  const progress = relativeFrame / durationFrames;

  // Ken Burns effect - different directions
  let scale: number, translateX: number, translateY: number;

  switch (direction) {
    case 'zoomIn':
      scale = interpolate(progress, [0, 1], [1, 1.15], { extrapolateRight: 'clamp' });
      translateX = 0;
      translateY = 0;
      break;
    case 'zoomOut':
      scale = interpolate(progress, [0, 1], [1.15, 1], { extrapolateRight: 'clamp' });
      translateX = 0;
      translateY = 0;
      break;
    case 'panLeft':
      scale = 1.1;
      translateX = interpolate(progress, [0, 1], [5, -5], { extrapolateRight: 'clamp' });
      translateY = 0;
      break;
    case 'panRight':
      scale = 1.1;
      translateX = interpolate(progress, [0, 1], [-5, 5], { extrapolateRight: 'clamp' });
      translateY = 0;
      break;
    case 'panUp':
      scale = 1.1;
      translateX = 0;
      translateY = interpolate(progress, [0, 1], [5, -5], { extrapolateRight: 'clamp' });
      break;
    default:
      scale = 1;
      translateX = 0;
      translateY = 0;
  }

  // Fade in only (no fade out to avoid black frame between scenes)
  const fadeIn = interpolate(relativeFrame, [0, fps * 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const opacity = fadeIn;

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================
// TEXT OVERLAY COMPONENT
// =====================================================

const TextOverlay: React.FC<TextOverlayProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simple fade in at the start (first 0.5 seconds)
  const opacity = interpolate(
    frame,
    [0, Math.floor(fps * 0.5)],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // FIXED: Always position at TOP of video (60px from top edge)
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 40,
        right: 40,
        opacity,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '24px 48px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          maxWidth: '90%',
        }}
      >
        {title && (
          <h1
            style={{
              color: 'white',
              fontSize: 52,
              fontWeight: 'bold',
              margin: 0,
              textShadow: '2px 2px 10px rgba(0,0,0,0.7)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 28,
              margin: '12px 0 0 0',
              textShadow: '1px 1px 6px rgba(0,0,0,0.6)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// =====================================================
// MUSIC TRACK MAPPING (same as Lambda available files)
// =====================================================

const MUSIC_TRACKS: Record<string, string> = {
  'ambient': 'bali-sunrise.mp3',
  'upbeat': 'bali-sunrise.mp3',
  'cinematic': 'background-music.mp3',
  'tropical': 'bali-sunrise.mp3',
  'lofi': 'background-music.mp3'
};

// =====================================================
// MAIN COMPOSITION
// =====================================================

export const PropertyPromo: React.FC<PropertyPromoProps> = ({
  scenes = [],
  settings = {},
  format = '9:16',
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns directions to cycle through
  const kenBurnsDirections: Array<'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp'> =
    ['zoomIn', 'panRight', 'zoomOut', 'panLeft', 'panUp'];

  // Calculate frames per scene with overlap for crossfade
  const overlapFrames = Math.floor(fps * 0.3); // 0.3 seconds overlap
  const totalOverlap = scenes.length > 1 ? (scenes.length - 1) * overlapFrames : 0;
  const sceneDuration = scenes.length > 0
    ? Math.floor((durationInFrames + totalOverlap) / scenes.length)
    : durationInFrames;

  // Text settings - only show if explicitly enabled
  const textSettings = settings.text || {};
  const showText = textSettings.enabled && (textSettings.title || textSettings.subtitle);

  // Music settings
  const musicSettings = settings.music || {};
  const musicFile = musicSettings.enabled && musicSettings.track
    ? MUSIC_TRACKS[musicSettings.track] || 'bali-sunrise.mp3'
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Render each scene with overlap for smooth crossfade */}
      {scenes.map((scene, index) => {
        // Start each scene earlier to create overlap with previous
        const startFrame = Math.max(0, index * (sceneDuration - overlapFrames));
        const direction = kenBurnsDirections[index % kenBurnsDirections.length];

        return (
          <Sequence
            key={scene.id || index}
            from={startFrame}
            durationInFrames={sceneDuration}
          >
            <Scene
              src={scene.photoUrl || scene.clipUrl || ''}
              startFrame={0}
              durationFrames={sceneDuration}
              direction={direction}
            />
          </Sequence>
        );
      })}

      {/* Text overlay - only if enabled by user */}
      {showText && (
        <Sequence from={Math.floor(fps * 0.5)} durationInFrames={durationInFrames - fps}>
          <TextOverlay
            title={textSettings.title}
            subtitle={textSettings.subtitle}
            position={textSettings.position || 'top'}
            startFrame={0}
            durationFrames={durationInFrames - fps}
          />
        </Sequence>
      )}

      {/* Background music - only if enabled */}
      {musicFile && (
        <Audio
          src={staticFile(musicFile)}
          volume={musicSettings.volume || 0.7}
        />
      )}
    </AbsoluteFill>
  );
};

// =====================================================
// VIDEO DIMENSIONS BY FORMAT
// =====================================================

export const getVideoDimensions = (format: string) => {
  switch (format) {
    case '9:16':
      return { width: 1080, height: 1920 }; // Vertical (Reels/TikTok)
    case '16:9':
      return { width: 1920, height: 1080 }; // Horizontal (YouTube)
    case '1:1':
      return { width: 1080, height: 1080 }; // Square (Instagram)
    default:
      return { width: 1080, height: 1920 };
  }
};

export default PropertyPromo;
