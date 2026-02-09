const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'NismaraVilla.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix HeroScene - it should only have scale, not translateX/translateY
const oldHeroTransform = `          transform: \`scale(\${scale}) translate(\${translateX}%, \${translateY}%)\`,`;
const newHeroTransform = `          transform: \`scale(\${scale})\`,`;

// Only replace the FIRST occurrence (which is in HeroScene)
const firstIndex = content.indexOf(oldHeroTransform);
if (firstIndex !== -1) {
  content = content.substring(0, firstIndex) +
            newHeroTransform +
            content.substring(firstIndex + oldHeroTransform.length);
  console.log('✅ HeroScene arreglado - solo usa scale');
} else {
  console.log('⚠️  No se encontró el transform en HeroScene');
}

fs.writeFileSync(filePath, content);

console.log('');
console.log('Ahora el archivo debería estar correcto.');
console.log('- HeroScene: solo scale');
console.log('- PhotoShowcase: scale + translate');
