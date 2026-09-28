/**
 * Remotion Composition - Property Promo Video
 *
 * This composition creates a video slideshow from property photos
 * with Ken Burns effect (zoom/pan), transitions, text overlays, and music.
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  Sequence,
} from 'remotion';

// =====================================================
// SCENE COMPONENT - Single photo with Ken Burns effect
// =====================================================

const Scene = ({ src, startFrame, durationFrames, direction = 'zoomIn' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  const progress = relativeFrame / durationFrames;

  // Ken Burns effect - different directions
  let scale, translateX, translateY;

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

  // Fade in/out
  const fadeIn = interpolate(relativeFrame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(
    relativeFrame,
    [durationFrames - fps * 0.5, durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const opacity = Math.min(fadeIn, fadeOut);

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

const TextOverlay = ({ title, subtitle, position = 'bottom', startFrame, durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;

  // Animate in with spring
  const animateIn = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Fade out
  const fadeOut = interpolate(
    relativeFrame,
    [durationFrames - fps, durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  const positionStyles = {
    top: { top: 60, bottom: 'auto' },
    center: { top: '50%', transform: 'translateY(-50%)' },
    bottom: { bottom: 80, top: 'auto' },
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === 'center' ? 'center' : 'flex-start',
        alignItems: 'center',
        ...positionStyles[position],
        opacity: fadeOut,
        transform: `translateY(${interpolate(animateIn, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '20px 40px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
        }}
      >
        {title && (
          <h1
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: 'bold',
              margin: 0,
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 24,
              margin: '8px 0 0 0',
              textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================
// MAIN COMPOSITION
// =====================================================

export const PropertyPromo = ({
  scenes = [],
  settings = {},
  format = '9:16',
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns directions to cycle through
  const kenBurnsDirections = ['zoomIn', 'panRight', 'zoomOut', 'panLeft', 'panUp'];

  // Calculate frames per scene
  const sceneDuration = scenes.length > 0
    ? Math.floor(durationInFrames / scenes.length)
    : durationInFrames;

  // Text settings
  const textSettings = settings.text || {};
  const showText = textSettings.enabled && (textSettings.title || textSettings.subtitle);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Render each scene */}
      {scenes.map((scene, index) => {
        const startFrame = index * sceneDuration;
        const direction = kenBurnsDirections[index % kenBurnsDirections.length];

        return (
          <Sequence
            key={scene.id || index}
            from={startFrame}
            durationInFrames={sceneDuration}
          >
            <Scene
              src={scene.photoUrl || scene.clipUrl}
              startFrame={0}
              durationFrames={sceneDuration}
              direction={direction}
            />
          </Sequence>
        );
      })}

      {/* Text overlay - show throughout */}
      {showText && (
        <Sequence from={Math.floor(fps * 0.5)} durationInFrames={durationInFrames - fps}>
          <TextOverlay
            title={textSettings.title}
            subtitle={textSettings.subtitle}
            position={textSettings.position || 'bottom'}
            startFrame={0}
            durationFrames={durationInFrames - fps}
          />
        </Sequence>
      )}

      {/* Background music placeholder - would use actual audio file */}
      {settings.music?.enabled && settings.music?.audioUrl && (
        <Audio
          src={settings.music.audioUrl}
          volume={settings.music.volume || 0.7}
        />
      )}
    </AbsoluteFill>
  );
};

// =====================================================
// VIDEO DIMENSIONS BY FORMAT
// =====================================================

export const getVideoDimensions = (format) => {
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
