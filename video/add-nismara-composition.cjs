const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, 'src', 'Root.tsx');
let content = fs.readFileSync(rootPath, 'utf8');

// Check if NismaraVilla import exists
if (!content.includes('import { NismaraVilla }')) {
  content = content.replace(
    'import { CompleteOverviewVideo } from "./CompleteOverviewVideo";',
    'import { CompleteOverviewVideo } from "./CompleteOverviewVideo";\nimport { NismaraVilla } from "./NismaraVilla";'
  );
}

// Add composition before closing tags
const compositionCode = `
      {/* Nismara Villa - Complete promotional video with photos */}
      <Composition
        id="NismaraVilla"
        component={NismaraVilla}
        durationInFrames={1590}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          data: {
            metrics: {
              totalBookings: 41,
              totalRevenueM: "139.9",
              avgBookingValueM: "3.4",
              avgLengthOfStay: "3.5",
            },
            performance2025: {
              occupancy: "65",
            },
            performance2026: {
              occupancy: "27",
            },
          },
        }}
      />
`;

if (!content.includes('id="NismaraVilla"')) {
  content = content.replace(
    '    </>\n  );\n};',
    `${compositionCode}    </>\n  );\n};`
  );
}

fs.writeFileSync(rootPath, content);
console.log('✅ NismaraVilla composition added to Root.tsx');
