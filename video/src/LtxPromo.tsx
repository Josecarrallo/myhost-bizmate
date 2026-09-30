import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
  Img,
  continueRender,
  delayRender,
} from 'remotion';

// Scene interface for slideshow mode
interface Scene {
  photoUrl: string;
  duration?: number;
}

interface LtxPromoProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ltxVideoUrl?: string;
  musicFile?: string;
  // NEW: Support for multiple scenes (slideshow mode)
  scenes?: Scene[];
}

export const LtxPromo: React.FC<LtxPromoProps> = ({
  title = 'Property Video',
  subtitle = '',
  imageUrl,
  ltxVideoUrl,
  musicFile = 'background-music.mp3',
  scenes = []
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Determine if we're in slideshow mode (multiple scenes)
  const isSlideshowMode = scenes && scenes.length > 0;

  // Calculate which scene to show in slideshow mode
  const framesPerScene = isSlideshowMode ? Math.floor(durationInFrames / scenes.length) : durationInFrames;
  const currentSceneIndex = isSlideshowMode ? Math.min(Math.floor(frame / framesPerScene), scenes.length - 1) : 0;
  const currentScene = isSlideshowMode ? scenes[currentSceneIndex] : null;
  const frameInScene = frame - (currentSceneIndex * framesPerScene);

  // Ken Burns effect for slideshow
  const kenBurnsScale = isSlideshowMode ? interpolate(
    frameInScene,
    [0, framesPerScene],
    [1, 1.15],
    { extrapolateRight: 'clamp' }
  ) : 1;

  const fadeInOpacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  const fadeOutOpacity = interpolate(
    frame,
    [durationInFrames - 50, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  const titleY = interpolate(
    frame,
    [0, 50, durationInFrames - 100, durationInFrames - 50],
    [-100, 0, 0, -100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease),
    }
  );

  const ctaOpacity = interpolate(
    frame,
    [durationInFrames - 100, durationInFrames - 80],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const ctaScale = interpolate(
    frame,
    [durationInFrames - 100, durationInFrames - 80],
    [0.8, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.5)),
    }
  );

  const overallOpacity = Math.min(fadeInOpacity, fadeOutOpacity);

  // Crossfade opacity for slideshow transitions
  const crossfadeOpacity = isSlideshowMode ? interpolate(
    frameInScene,
    [0, 15, framesPerScene - 15, framesPerScene],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BASE LAYER: Slideshow mode (multiple scenes) OR single image/video mode */}
      {isSlideshowMode ? (
        // SLIDESHOW MODE: Render current scene with Ken Burns effect
        <Img
          src={currentScene?.photoUrl || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: overallOpacity * crossfadeOpacity,
            transform: `scale(${kenBurnsScale})`,
          }}
        />
      ) : ltxVideoUrl ? (
        // LTX VIDEO MODE: Use provided video URL
        <OffthreadVideo
          src={ltxVideoUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: overallOpacity,
          }}
          muted
        />
      ) : imageUrl ? (
        // SINGLE IMAGE MODE: Use provided image URL
        <Img
          src={imageUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: overallOpacity,
          }}
        />
      ) : (
        // FALLBACK: Black screen with error message (NO MORE OLD VIDEO!)
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: 24, textAlign: 'center' }}>
            No image or video provided
          </div>
        </AbsoluteFill>
      )}

      {/* BACKGROUND MUSIC */}
      <Audio
        src={staticFile(musicFile)}
        volume={0.3}
        startFrom={0}
      />

      {/* OVERLAY: Gradient Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          opacity: 0.6,
        }}
      />

      {/* OVERLAY: Top Title */}
      {frame < durationInFrames / 2 && (
        <Sequence from={0} durationInFrames={durationInFrames / 2}>
          <AbsoluteFill
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 60,
            }}
          >
            <div
              style={{
                transform: `translateY(${titleY}px)`,
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                padding: '20px 40px',
                borderRadius: 20,
                border: '2px solid rgba(255, 140, 66, 0.5)',
              }}
            >
              <h1
                style={{
                  fontSize: 80,
                  fontWeight: 'bold',
                  margin: 0,
                  color: '#D4AF37',
                  textShadow: '0 4px 30px rgba(212,175,55,0.6), 0 2px 10px rgba(0,0,0,0.9)',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '4px',
                }}
              >
                {title}
              </h1>
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* OVERLAY: Call-to-Action */}
      {frame >= durationInFrames - 100 && (
        <Sequence from={durationInFrames - 100} durationInFrames={100}>
          <AbsoluteFill
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 100,
            }}
          >
            <div
              style={{
                transform: `scale(${ctaScale})`,
                opacity: ctaOpacity,
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(15px)',
                padding: '30px 50px',
                borderRadius: 20,
                border: '2px solid #FF8C42',
                boxShadow: '0 10px 50px rgba(255, 140, 66, 0.4)',
              }}
            >
              <h2
                style={{
                  fontSize: 36,
                  fontWeight: 'normal',
                  margin: 0,
                  color: '#D4AF37',
                  fontFamily: 'Georgia, serif',
                  marginBottom: 15,
                  letterSpacing: '2px',
                  textShadow: '0 4px 20px rgba(212,175,55,0.5)',
                }}
              >
                {subtitle}
              </h2>
              <p
                style={{
                  fontSize: 26,
                  margin: 0,
                  color: '#fff',
                  fontFamily: 'Georgia, serif',
                  fontWeight: 'normal',
                  textShadow: '0 2px 15px rgba(0,0,0,0.8)',
                }}
              >
                www.myhostbizmate.com
              </p>
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* OVERLAY: Bottom Logo */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          padding: 40,
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            padding: '15px 30px',
            borderRadius: 15,
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            opacity: overallOpacity,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(212,175,55,0.4)',
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 'bold', color: '#000' }}>N</span>
          </div>
          <span
            style={{
              fontSize: 24,
              fontWeight: 'normal',
              color: '#D4AF37',
              fontFamily: 'Georgia, serif',
              letterSpacing: '1px',
            }}
          >
            {title}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
