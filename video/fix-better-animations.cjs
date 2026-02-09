const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Encontrar y reemplazar la sección de switch con animaciones mejoradas
const oldSwitch = /switch \(photoNumber\) \{[\s\S]*?\n  \}/;

const newSwitch = `switch (photoNumber) {
    case 1:
    case 2:
      // Zoom out clásico (fotos 1 y 2)
      scale = interpolate(frame, [0, 60], [1.3, 1], { extrapolateRight: 'clamp' });
      break;
    case 3:
      // Pan de derecha a izquierda
      scale = 1.15;
      translateX = interpolate(frame, [0, 60], [8, -8], { extrapolateRight: 'clamp' });
      break;
    case 4:
      // Pan de izquierda a derecha (opuesto a foto 3)
      scale = 1.15;
      translateX = interpolate(frame, [0, 60], [-8, 8], { extrapolateRight: 'clamp' });
      break;
    case 5:
      // Zoom in suave (inverso)
      scale = interpolate(frame, [0, 60], [1, 1.25], { extrapolateRight: 'clamp' });
      break;
    case 6:
      // Diagonal zoom out (movimiento complejo)
      scale = interpolate(frame, [0, 60], [1.35, 1], { extrapolateRight: 'clamp' });
      translateX = interpolate(frame, [0, 60], [4, -4], { extrapolateRight: 'clamp' });
      translateY = interpolate(frame, [0, 60], [4, -4], { extrapolateRight: 'clamp' });
      break;
  }`;

content = content.replace(oldSwitch, newSwitch);

fs.writeFileSync(filePath, content);
console.log('✅ Animaciones mejoradas aplicadas:');
console.log('   Fotos 1-2: Zoom out clásico (iguales)');
console.log('   Foto 3: Pan derecha → izquierda');
console.log('   Foto 4: Pan izquierda → derecha');
console.log('   Foto 5: Zoom in suave');
console.log('   Foto 6: Diagonal zoom out (complejo)');
console.log('');
console.log('Patrón: 2 iguales, luego 4 diferentes');
