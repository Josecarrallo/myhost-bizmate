const fs = require('fs');

const newContent = `import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, staticFile } from 'remotion';

const HeroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps, from: 0.8, to: 1, config: { damping: 100 } });
  const lineWidth = spring({ frame: frame - 15, fps, from: 0, to: 100, config: { damping: 80 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity, transform: \`scale(\${scale})\` }}>
        <div style={{ width: \`\${lineWidth}%\`, maxWidth: 600, height: 2, background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', marginBottom: 40 }} />
        <h1 style={{ fontSize: 140, fontWeight: '300', color: '#fff', textAlign: 'center', margin: 0, marginBottom: 10, textShadow: '0 8px 32px rgba(0,0,0,0.8)', fontFamily: 'Georgia, serif', letterSpacing: 8 }}>NISMARA UMA</h1>
        <div style={{ fontSize: 32, color: '#d4af37', textAlign: 'center', fontFamily: 'Arial, sans-serif', letterSpacing: 12, textTransform: 'uppercase', marginBottom: 30, fontWeight: '300' }}>VILLA</div>
        <p style={{ fontSize: 42, color: '#e0e0e0', textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: '300', maxWidth: 700 }}>Your Private Paradise in Bali</p>
        <div style={{ width: \`\${lineWidth}%\`, maxWidth: 600, height: 2, background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', marginTop: 40 }} />
      </div>
    </AbsoluteFill>
  );
};

const PhotoShowcase = ({ photoNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 100 } });
  const photos = {
    1: 'WhatsApp Image 2026-01-28 at 7.39.11 AM (1).jpeg',
    2: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (3).jpeg',
    3: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (4).jpeg',
    4: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (5).jpeg',
    5: 'WhatsApp Image 2026-02-06 at 3.58.15 PM.jpeg',
    6: 'WhatsApp Image 2026-02-06 at 3.58.30 PM.jpeg',
  };

  let scale = 1, translateX = 0, translateY = 0;
  if (photoNumber === 1 || photoNumber === 2) {
    scale = interpolate(frame, [0, 90], [1.4, 1], { extrapolateRight: 'clamp' });
  } else if (photoNumber === 3) {
    scale = 1.2;
    translateX = interpolate(frame, [0, 90], [10, -10], { extrapolateRight: 'clamp' });
  } else if (photoNumber === 4) {
    scale = 1.2;
    translateX = interpolate(frame, [0, 90], [-10, 10], { extrapolateRight: 'clamp' });
  } else if (photoNumber === 5) {
    scale = interpolate(frame, [0, 90], [1, 1.3], { extrapolateRight: 'clamp' });
  } else if (photoNumber === 6) {
    scale = interpolate(frame, [0, 90], [1.5, 1], { extrapolateRight: 'clamp' });
    translateX = interpolate(frame, [0, 90], [6, -6], { extrapolateRight: 'clamp' });
    translateY = interpolate(frame, [0, 90], [6, -6], { extrapolateRight: 'clamp' });
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, opacity, transform: \`scale(\${scale}) translate(\${translateX}%, \${translateY}%)\` }}>
        <Img src={staticFile(\`nismara/\${photos[photoNumber]}\`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))' }} />
      </div>
    </AbsoluteFill>
  );
};

const CallToAction = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 100 } });
  const slideUp = interpolate(frame, [0, 40], [100, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity, transform: \`translateY(\${slideUp}px)\` }}>
        <h2 style={{ fontSize: 96, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40, fontFamily: 'Arial, sans-serif' }}>Book Your Stay Today</h2>
        <p style={{ fontSize: 48, color: '#d4af37', textAlign: 'center', marginBottom: 60, fontFamily: 'Arial, sans-serif' }}>Experience luxury in the heart of Bali</p>
        <div style={{ fontSize: 36, color: '#fff', background: '#d4af37', padding: '30px 80px', borderRadius: 60, fontWeight: 'bold', fontFamily: 'Arial, sans-serif', boxShadow: '0 10px 40px rgba(212, 175, 55, 0.4)' }}>Contact Us Now</div>
      </div>
    </AbsoluteFill>
  );
};

export const NismaraVilla = ({ data }) => {
  const { fps } = useVideoConfig();
  const heroDuration = 4 * fps, photoDuration = 3 * fps, ctaDuration = 4 * fps;
  let currentFrame = 0;

  return (
    <AbsoluteFill>
      <Sequence from={currentFrame} durationInFrames={heroDuration}><HeroScene /></Sequence>
      {currentFrame += heroDuration}
      {[1, 2, 3, 4, 5, 6].map((photoNum) => {
        const startFrame = currentFrame;
        currentFrame += photoDuration;
        return <Sequence key={photoNum} from={startFrame} durationInFrames={photoDuration}><PhotoShowcase photoNumber={photoNum} /></Sequence>;
      })}
      <Sequence from={currentFrame} durationInFrames={ctaDuration}><CallToAction /></Sequence>
    </AbsoluteFill>
  );
};
`;

fs.writeFileSync('src/NismaraVilla.tsx', newContent);
console.log('✅ Archivo reemplazado');
