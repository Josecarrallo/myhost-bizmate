const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Eliminar la línea de statsDuration
content = content.replace(/  const statsDuration = 6 \* fps; \/\/ 6 segundos\r?\n/, '');

// 2. Eliminar toda la sección de Business Stats Scene (líneas 384-388)
const statsSection = `      {/* Scene 8: Business Stats */}
      <Sequence from={currentFrame} durationInFrames={statsDuration}>
        <BusinessStats data={data} />
      </Sequence>
      {currentFrame += statsDuration}

      {/* Scene 9: Call to Action */}`;

const replacement = `      {/* Scene 8: Call to Action */}`;

content = content.replace(statsSection, replacement);

// 3. Eliminar todo el componente BusinessStats (no se necesita)
const businessStatsStart = content.indexOf('// Scene 3: Business Stats');
const businessStatsEnd = content.indexOf('// Scene 4: Call to Action Final');

if (businessStatsStart !== -1 && businessStatsEnd !== -1) {
  const before = content.substring(0, businessStatsStart);
  const after = content.substring(businessStatsEnd);
  content = before + after;
  console.log('✅ Componente BusinessStats eliminado');
}

fs.writeFileSync(filePath, content);

console.log('✅ Escena Business Stats ELIMINADA completamente');
console.log('✅ Duración variable eliminada');
console.log('');
console.log('📹 Estructura del video ahora:');
console.log('   1. Hero (4s)');
console.log('   2-7. Fotos con animaciones variadas (18s total)');
console.log('   8. Call to Action (4s)');
console.log('');
console.log('Total: ~26 segundos');
