const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the entire PhotoShowcase component
const startMarker = '// Scene 2: Showcase de fotos con transiciones';
const endMarker = '// Scene 3: Business Stats';

const startIndex = content.indexOf(startMarker);
let endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ No se encontraron los marcadores esperados');
  console.error('startIndex:', startIndex);
  console.error('endIndex:', endIndex);
  process.exit(1);
}

// Move back to find the closing }; before Scene 3
while (endIndex > startIndex && content[endIndex - 1] !== '}') {
  endIndex--;
}
endIndex -= 2; // Move past };
endIndex += 2; // Move to the line break position

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

  // Fotos 1-2: Mismo movimiento (zoom out clásico)
  if (photoNumber === 1 || photoNumber === 2) {
    scale = interpolate(frame, [0, 60], [1.3, 1], { extrapolateRight: 'clamp' });
  }
  // Foto 3: Pan derecha → izquierda
  else if (photoNumber === 3) {
    scale = 1.15;
    translateX = interpolate(frame, [0, 60], [8, -8], { extrapolateRight: 'clamp' });
  }
  // Foto 4: Pan izquierda → derecha (opuesto)
  else if (photoNumber === 4) {
    scale = 1.15;
    translateX = interpolate(frame, [0, 60], [-8, 8], { extrapolateRight: 'clamp' });
  }
  // Foto 5: Zoom in suave (inverso)
  else if (photoNumber === 5) {
    scale = interpolate(frame, [0, 60], [1, 1.25], { extrapolateRight: 'clamp' });
  }
  // Foto 6: Diagonal zoom out (movimiento complejo)
  else if (photoNumber === 6) {
    scale = interpolate(frame, [0, 60], [1.35, 1], { extrapolateRight: 'clamp' });
    translateX = interpolate(frame, [0, 60], [4, -4], { extrapolateRight: 'clamp' });
    translateY = interpolate(frame, [0, 60], [4, -4], { extrapolateRight: 'clamp' });
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
};

`;

// Replace the section
const before = content.substring(0, startIndex);
const after = content.substring(endIndex);
const newContent = before + newPhotoShowcase + after;

fs.writeFileSync(filePath, newContent);

console.log('✅ Animaciones variadas aplicadas correctamente!');
console.log('');
console.log('📊 Patrón de animaciones:');
console.log('   Fotos 1-2: Zoom out clásico (IGUALES)');
console.log('   Foto 3: Pan derecha → izquierda');
console.log('   Foto 4: Pan izquierda → derecha');
console.log('   Foto 5: Zoom in suave');
console.log('   Foto 6: Diagonal zoom out (complejo)');
console.log('');
console.log('🎬 Ahora genera el video con:');
console.log('   npx remotion render NismaraVilla out/nismara-uma-villa-VARIED-FINAL-2026-02-09.mp4');
