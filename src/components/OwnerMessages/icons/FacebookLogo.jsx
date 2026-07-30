import React from 'react';

// Official Facebook/Meta logo - blue circle with white F
const FacebookLogo = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      fill="#FFFFFF"
      d="M16.671 15.469l.532-3.47H13.87v-2.25c0-.949.465-1.874 1.956-1.874h1.514V5.094s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.544H7.078v3.47h3.047v8.385a12.13 12.13 0 003.75 0v-8.385h2.796z"
    />
  </svg>
);

export default FacebookLogo;
