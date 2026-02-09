const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Eliminar las líneas 234-238 (Business Stats Scene)
const lines = content.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  // Saltar las líneas 233-237 (0-indexed sería 233-237)
  if (i >= 233 && i <= 237) {
    continue; // Skip these lines
  }
  newLines.push(lines[i]);
}

content = newLines.join('\n');

fs.writeFileSync(filePath, content);

console.log('✅ Business Stats Scene ELIMINADA (líneas 234-238)');
console.log('✅ Archivo listo para renderizar');
