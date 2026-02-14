const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar el PhotoShowcase component con animaciones variadas
const oldPhotoShowcase = `// Scene 2: Showcase de fotos con transiciones
const PhotoShowcase = ({ photoNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 100,
    },
  });

  const scale = interpolate(frame, [0, 60], [1.3, 1], {
    extrapolateRight: 'clamp',
  });

  // Map de fotos
  const photos = {
    1: 'WhatsApp Image 2026-01-28 at 7.39.11 AM (1).jpeg',
    2: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (3).jpeg',
    3: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (4).jpeg',
    4: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (5).jpeg',
    5: 'WhatsApp Image 2026-02-06 at 3.58.15 PM.jpeg',
    6: 'WhatsApp Image 2026-02-06 at 3.58.30 PM.jpeg',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity,
          transform: \`scale(\${scale})\`,
        }}
      >
        <Img
          src={staticFile(\`nismara/\${photos[photoNumber]}\`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Overlay oscuro sutil */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};`;

const newPhotoShowcase = `// Scene 2: Showcase de fotos con transiciones variadas
const PhotoShowcase = ({ photoNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 100,
    },
  });

  // Map de fotos
  const photos = {
    1: 'WhatsApp Image 2026-01-28 at 7.39.11 AM (1).jpeg',
    2: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (3).jpeg',
    3: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (4).jpeg',
    4: 'WhatsApp Image 2026-01-28 at 7.39.12 AM (5).jpeg',
    5: 'WhatsApp Image 2026-02-06 at 3.58.15 PM.jpeg',
    6: 'WhatsApp Image 2026-02-06 at 3.58.30 PM.jpeg',
  };

  // Diferentes animaciones para cada foto
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (photoNumber) {
    case 1:
      // Zoom out clásico
      scale = interpolate(frame, [0, 60], [1.3, 1], { extrapolateRight: 'clamp' });
      break;
    case 2:
      // Pan de izquierda a derecha
      scale = 1.2;
      translateX = interpolate(frame, [0, 60], [-5, 5], { extrapolateRight: 'clamp' });
      break;
    case 3:
      // Zoom in (inverso)
      scale = interpolate(frame, [0, 60], [1, 1.2], { extrapolateRight: 'clamp' });
      break;
    case 4:
      // Pan de derecha a izquierda
      scale = 1.2;
      translateX = interpolate(frame, [0, 60], [5, -5], { extrapolateRight: 'clamp' });
      break;
    case 5:
      // Diagonal (zoom out + pan diagonal)
      scale = interpolate(frame, [0, 60], [1.3, 1], { extrapolateRight: 'clamp' });
      translateX = interpolate(frame, [0, 60], [3, -3], { extrapolateRight: 'clamp' });
      translateY = interpolate(frame, [0, 60], [3, -3], { extrapolateRight: 'clamp' });
      break;
    case 6:
      // Zoom out lento y suave
      scale = interpolate(frame, [0, 90], [1.4, 1], { extrapolateRight: 'clamp' });
      break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity,
          transform: \`scale(\${scale}) translate(\${translateX}%, \${translateY}%)\`,
        }}
      >
        <Img
          src={staticFile(\`nismara/\${photos[photoNumber]}\`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Overlay oscuro sutil */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};`;

content = content.replace(oldPhotoShowcase, newPhotoShowcase);

fs.writeFileSync(filePath, content);
console.log('✅ Animaciones variadas aplicadas:');
console.log('   Foto 1: Zoom out clásico (1.3x → 1.0x)');
console.log('   Foto 2: Pan izquierda → derecha');
console.log('   Foto 3: Zoom in (1.0x → 1.2x)');
console.log('   Foto 4: Pan derecha → izquierda');
console.log('   Foto 5: Diagonal (zoom + movimiento)');
console.log('   Foto 6: Zoom out lento y suave');
