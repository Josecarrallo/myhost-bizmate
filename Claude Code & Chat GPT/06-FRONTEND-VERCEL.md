# MY HOST BizMate - Frontend y Despliegue Vercel
## Dashboard para propietarios de hoteles

---

## 1. VISIÓN DEL PRODUCTO

### Dashboard para propietarios
Un panel web donde los propietarios pueden:
- Ver conversaciones de WhatsApp
- Gestionar reservas
- Ver métricas y estadísticas
- Configurar su hotel
- Gestionar disponibilidad

---

## 2. STACK TECNOLÓGICO

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| UI Components | Shadcn/ui |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| API | Supabase Edge Functions |

---

## 3. ESTRUCTURA DEL PROYECTO

```
myhost-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   │   ├── StatsCards.jsx
│   │   │   ├── RecentBookings.jsx
│   │   │   └── ConversationsList.jsx
│   │   ├── bookings/
│   │   │   ├── BookingTable.jsx
│   │   │   ├── BookingDetail.jsx
│   │   │   └── BookingForm.jsx
│   │   └── settings/
│   │       ├── HotelSettings.jsx
│   │       ├── RoomTypes.jsx
│   │       └── Availability.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Bookings.jsx
│   │   ├── Conversations.jsx
│   │   ├── Settings.jsx
│   │   └── Login.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBookings.js
│   │   └── useConversations.js
│   ├── lib/
│   │   ├── supabase.js
│   │   └── utils.js
│   ├── App.jsx
│   └── main.jsx
├── .env.local
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

---

## 4. CONFIGURACIÓN INICIAL

### Crear proyecto
```bash
npm create vite@latest myhost-dashboard -- --template react
cd myhost-dashboard
npm install
```

### Instalar dependencias
```bash
# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Supabase
npm install @supabase/supabase-js

# Router
npm install react-router-dom

# UI
npm install @radix-ui/react-icons
npm install class-variance-authority clsx tailwind-merge

# Date handling
npm install date-fns

# Charts
npm install recharts
```

### Archivo .env.local
```
VITE_SUPABASE_URL=https://jjpscimtxrudtepzwhag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. COMPONENTES PRINCIPALES

### Layout.jsx
```jsx
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Dashboard.jsx
```jsx
import { StatsCards } from '../components/dashboard/StatsCards';
import { RecentBookings } from '../components/dashboard/RecentBookings';
import { ConversationsList } from '../components/dashboard/ConversationsList';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings />
        <ConversationsList />
      </div>
    </div>
  );
}
```

### useBookings.js
```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useBookings(propertyId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [propertyId]);

  return { bookings, loading, error };
}
```

---

## 6. DESPLIEGUE EN VERCEL

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Pasos para deploy

1. **Conectar repositorio**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/myhost-dashboard.git
   git push -u origin main
   ```

2. **En Vercel**
   - Import project desde GitHub
   - Configurar variables de entorno:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy

3. **Dominio personalizado**
   - Settings → Domains
   - Añadir: dashboard.myhostbizmate.com

---

## 7. AUTENTICACIÓN

### supabase.js
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### useAuth.js
```javascript
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 8. PÁGINAS PRINCIPALES

### Rutas
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Resumen general |
| `/bookings` | Bookings | Lista de reservas |
| `/bookings/:id` | BookingDetail | Detalle de reserva |
| `/conversations` | Conversations | Chat de WhatsApp |
| `/settings` | Settings | Configuración del hotel |
| `/login` | Login | Inicio de sesión |

### App.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { Conversations } from './pages/Conversations';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/bookings" element={
            <PrivateRoute><Bookings /></PrivateRoute>
          } />
          <Route path="/conversations" element={
            <PrivateRoute><Conversations /></PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute><Settings /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 9. DISEÑO UI/UX

### Paleta de colores
```css
:root {
  --primary: #2563eb;      /* Azul */
  --secondary: #64748b;    /* Gris */
  --success: #22c55e;      /* Verde */
  --warning: #f59e0b;      /* Amarillo */
  --danger: #ef4444;       /* Rojo */
  --background: #f8fafc;   /* Fondo claro */
}
```

### Principios de diseño
- Mobile-first
- Glassmorphism sutil
- Espaciado consistente
- Accesibilidad (WCAG 2.1)

---

## 10. ROADMAP FRONTEND

| Fase | Funcionalidad | Estado |
|------|---------------|--------|
| 1 | Setup proyecto + Auth | 🔄 Pendiente |
| 2 | Dashboard básico | 🔄 Pendiente |
| 3 | Gestión de reservas | 🔄 Pendiente |
| 4 | Vista de conversaciones | 🔄 Pendiente |
| 5 | Configuración hotel | 🔄 Pendiente |
| 6 | Métricas y reportes | 🔄 Pendiente |

---

**Última actualización:** 13 Diciembre 2025
