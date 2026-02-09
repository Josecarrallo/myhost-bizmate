const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Aumentar zoom de 1.1 a 1.3
content = content.replace(
  'const scale = interpolate(frame, [0, 60], [1.1, 1], {',
  'const scale = interpolate(frame, [0, 60], [1.3, 1], {'
);

// 2. Eliminar la línea de statsDuration
content = content.replace(
  /const statsDuration = 6 \* fps; \/\/ 6 segundos\n/,
  ''
);

// 3. Eliminar la sección de Business Stats (Scene 8)
content = content.replace(
  /\/\* Scene 8: Business Stats \*\/\n      <Sequence from=\{currentFrame\} durationInFrames=\{statsDuration\}>\n        <BusinessStats data=\{data\} \/>\n      <\/Sequence>\n      \{currentFrame \+= statsDuration\}\n\n      \/\* Scene 9: Call to Action \*\//,
  '/* Scene 8: Call to Action */'
);

fs.writeFileSync(filePath, content);
console.log('✅ Cambios aplicados:');
console.log('   - Zoom aumentado de 1.1 a 1.3');
console.log('   - Escena Business Stats eliminada');
console.log('   - Video será más corto (~26 segundos)');
