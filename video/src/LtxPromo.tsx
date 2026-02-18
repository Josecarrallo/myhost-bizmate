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

interface LtxPromoProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ltxVideoUrl?: string;
  musicFile?: string;
}

export const LtxPromo: React.FC<LtxPromoProps> = ({
  title = 'NISMARA UMA VILLA',
  subtitle = 'Discover Your Balinese Sanctuary',
  imageUrl,
  ltxVideoUrl,
  musicFile = 'background-music.mp3'
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BASE LAYER: LTX-2 cinematic video (URL publica S3) > imagen estatica > fallback local */}
      {ltxVideoUrl ? (
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
        <OffthreadVideo
          src={staticFile('ltx-video.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: overallOpacity,
          }}
          muted
        />
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
