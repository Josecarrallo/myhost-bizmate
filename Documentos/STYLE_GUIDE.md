# MY HOST BizMate - Design System & Style Guide

## Para Claude Code: Instrucciones de Implementación

Este documento define el sistema de diseño para MY HOST BizMate. Usa estas especificaciones para actualizar todas las pantallas de la aplicación manteniendo consistencia visual.

---

## 🎨 Paleta de Colores

### Colores Primarios (Marca)
```js
const colors = {
  // Fondo principal - gradiente
  background: 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700',
  
  // Naranjas corporativos
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',  // Principal
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Ámbar (acentos cálidos)
  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f',
  }
}
```

### Colores de Módulos (Gradientes para Cards)
```js
const moduleGradients = {
  dashboard: 'from-blue-500 to-blue-600',
  bookings: 'from-emerald-500 to-teal-600',
  calendar: 'from-violet-500 to-purple-600',
  properties: 'from-amber-500 to-orange-600',
  operations: 'from-slate-500 to-slate-700',
  channelManager: 'from-cyan-500 to-blue-600',
  payments: 'from-green-500 to-emerald-600',
  reports: 'from-rose-500 to-pink-600',
  pricing: 'from-yellow-500 to-amber-600',
  aiAssistant: 'from-fuchsia-500 to-purple-600',
  cultural: 'from-indigo-500 to-blue-600',
  bookingEngine: 'from-teal-500 to-cyan-600',
  checkIn: 'from-sky-500 to-blue-600',
  guestPortal: 'from-violet-500 to-indigo-600',
  reviews: 'from-amber-400 to-yellow-500',
  whatsapp: 'from-green-500 to-emerald-600',
  marketing: 'from-pink-500 to-rose-600',
  social: 'from-blue-500 to-indigo-600',
}
```

---

## 📐 Componentes Base

### Glassmorphism Card
```jsx
// Estilo base para cards con efecto glass
const glassCard = `
  bg-white/10 
  backdrop-blur-sm 
  border border-white/20 
  rounded-2xl
`;

// Hover state
const glassCardHover = `
  hover:bg-white/20 
  hover:scale-105 
  transition-all duration-300
`;
```

### Botón Primario (CTA)
```jsx
const primaryButton = `
  px-10 py-4 
  rounded-full
  bg-gradient-to-r from-orange-700 via-orange-800 to-amber-900
  font-semibold text-white
  shadow-xl shadow-orange-950/40
  border border-orange-600/50
  transition-all duration-300
  hover:scale-105 hover:shadow-2xl
`;
```

### Botón Secundario (Icon Button)
```jsx
const iconButton = `
  w-10 h-10 
  rounded-xl 
  bg-white/10 
  backdrop-blur-sm 
  border border-white/20 
  flex items-center justify-center 
  text-white/80 
  hover:bg-white/20 hover:text-white 
  transition-all duration-200
`;
```

### Input Fields
```jsx
const inputField = `
  w-full
  px-4 py-3
  rounded-xl
  bg-white/10
  backdrop-blur-sm
  border border-white/20
  text-white
  placeholder:text-white/50
  focus:outline-none focus:border-white/40 focus:bg-white/15
  transition-all duration-200
`;
```

---

## 🎭 Tipografía

```jsx
// Títulos principales (MY HOST)
const titlePrimary = 'text-5xl font-black text-white tracking-tight drop-shadow-lg';

// Subtítulos (BizMate)
const titleSecondary = 'text-4xl font-black text-white/90 tracking-tight drop-shadow-lg';

// Sección headers
const sectionTitle = 'text-lg font-semibold text-white tracking-wide';

// Body text
const bodyText = 'text-lg font-medium text-white/90';

// Labels pequeños
const labelText = 'text-sm font-medium text-white/90';

// Micro text (version, status)
const microText = 'text-xs text-white/70';
```

---

## 🌊 Fondos Animados

### Orbs de Gradiente
```jsx
const BackgroundOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Orb superior izquierda */}
    <div 
      className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-yellow-400/25 rounded-full blur-3xl"
      style={{ animation: 'pulse 8s ease-in-out infinite' }}
    />
    {/* Orb inferior derecha */}
    <div 
      className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-3xl"
      style={{ animation: 'pulse 10s ease-in-out infinite reverse' }}
    />
    {/* Orb central */}
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400/15 rounded-full blur-3xl"
      style={{ animation: 'breathe 6s ease-in-out infinite' }}
    />
  </div>
);
```

---

## ✨ Animaciones CSS

```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

@keyframes ringPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 📱 Componentes Reutilizables

### Module Card (para menús)
```jsx
const ModuleCard = ({ icon: Icon, label, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animation: `fadeSlideUp 0.5s ease-out ${delay}ms both` }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-4
        bg-white/10 backdrop-blur-sm border border-white/20
        transition-all duration-300 ease-out
        ${isHovered ? 'bg-white/20 scale-105 shadow-2xl shadow-black/20' : ''}
      `}>
        <div className={`
          relative w-14 h-14 mx-auto mb-3 rounded-xl
          bg-gradient-to-br ${color}
          flex items-center justify-center shadow-lg
          transition-transform duration-300
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
        </div>
        <p className="text-center text-sm font-medium text-white/90">
          {label}
        </p>
      </div>
    </div>
  );
};
```

### Section Title con línea decorativa
```jsx
const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <h2 className="text-lg font-semibold text-white tracking-wide">
      {children}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
  </div>
);
```

### Status Badge
```jsx
const StatusBadge = ({ status, label }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white/70">
    <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
    {label}
  </span>
);
```

### User Info Bar
```jsx
const UserInfoBar = ({ email, role, avatar }) => (
  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
          {avatar}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{email}</p>
          <p className="text-orange-200 text-xs">{role}</p>
        </div>
      </div>
    </div>
  </div>
);
```

---

## 📂 Estructura de Archivos Sugerida

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Badge.jsx
│   │   └── ModuleCard.jsx
│   ├── layout/
│   │   ├── BackgroundOrbs.jsx
│   │   ├── Header.jsx
│   │   ├── SectionTitle.jsx
│   │   └── BottomWave.jsx
│   └── shared/
│       ├── UserInfoBar.jsx
│       └── StatusBadge.jsx
├── styles/
│   └── animations.css
├── pages/
│   ├── Splash.jsx
│   ├── Dashboard.jsx
│   ├── Bookings.jsx
│   └── ...
└── constants/
    └── colors.js
```

---

## 🚀 Instrucciones para Claude Code

1. **Aplica el gradiente de fondo** a todas las pantallas principales
2. **Usa glassmorphism** para cards y contenedores
3. **Mantén la tipografía** consistente (font-black para títulos, font-medium para body)
4. **Añade los orbs animados** como fondo en pantallas principales
5. **Usa los gradientes de módulos** para distinguir cada sección
6. **Implementa hover states** con scale y transiciones suaves
7. **Mobile-first**: Grid de 4 columnas en móvil, adaptable a desktop

---

## 📋 Checklist de Migración

Para cada pantalla existente:

- [ ] Cambiar fondo a gradiente naranja
- [ ] Añadir BackgroundOrbs component
- [ ] Actualizar cards a estilo glassmorphism
- [ ] Cambiar botones al nuevo estilo
- [ ] Actualizar tipografía
- [ ] Añadir animaciones de entrada (fadeSlideUp)
- [ ] Implementar hover states
- [ ] Verificar responsive design
