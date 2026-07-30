import React from 'react';

// Official Instagram logo - gradient background with white camera icon
const InstagramLogo = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
  >
    <defs>
      <radialGradient id="ig-bg" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    {/* Rounded rectangle background with gradient */}
    <rect x="0" y="0" width="24" height="24" rx="6" ry="6" fill="url(#ig-bg)" />
    {/* White camera icon */}
    <g fill="none" stroke="#FFFFFF" strokeWidth="1.5">
      {/* Outer rounded square */}
      <rect x="4" y="4" width="16" height="16" rx="4" ry="4" />
      {/* Center circle */}
      <circle cx="12" cy="12" r="4" />
      {/* Flash dot */}
      <circle cx="17" cy="7" r="1.2" fill="#FFFFFF" stroke="none" />
    </g>
  </svg>
);

export default InstagramLogo;
