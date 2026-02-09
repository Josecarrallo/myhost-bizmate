const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Simple approach: replace the specific problematic lines
// Replace the single scale calculation with conditional logic

const oldCode = `  const scale = interpolate(frame, [0, 60], [1.3, 1], {
    extrapolateRight: 'clamp',
  });

  // Map de fotos`;

const newCode = `  // Map de fotos`;

// First, remove the old scale calculation
content = content.replace(oldCode, newCode);

// Now add the new animation logic after the photos map and before the return
const oldReturn = `  };

  return (`;

const newReturn = `  };

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

  return (`;

content = content.replace(oldReturn, newReturn);

// Finally, update the transform line
const oldTransform = `          transform: \`scale(\${scale})\`,`;
const newTransform = `          transform: \`scale(\${scale}) translate(\${translateX}%, \${translateY}%)\`,`;

content = content.replace(oldTransform, newTransform);

fs.writeFileSync(filePath, content);

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
