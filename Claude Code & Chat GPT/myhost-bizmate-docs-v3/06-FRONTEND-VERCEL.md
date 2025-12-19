# MY HOST BIZMATE - FRONTEND VERCEL
## Guía de Desarrollo React
### Versión 3.0 - 15 Diciembre 2024

---

## ESTADO ACTUAL

- **Framework:** React + Tailwind CSS
- **Hosting:** Vercel
- **Módulos:** 19 desplegados
- **Auth:** Supabase Auth

---

## TAREAS PENDIENTES

### 1. Widget Vapi Voice (PRIORITARIO)

#### Instalación
```bash
npm install @vapi-ai/web
```

#### Componente Base
```jsx
// components/VoiceAssistant.jsx
import { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

const VoiceAssistant = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const vapi = new Vapi(process.env.REACT_APP_VAPI_PUBLIC_KEY);

  useEffect(() => {
    vapi.on('call-start', () => {
      setIsCallActive(true);
      setIsLoading(false);
    });

    vapi.on('call-end', () => {
      setIsCallActive(false);
      setTranscript('');
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript(message.transcript);
      }
    });

    vapi.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsLoading(false);
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const handleStartCall = async () => {
    setIsLoading(true);
    try {
      await vapi.start({
        assistantId: '1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61'
      });
    } catch (error) {
      console.error('Error starting call:', error);
      setIsLoading(false);
    }
  };

  const handleEndCall = () => {
    vapi.stop();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón principal */}
      <button
        onClick={isCallActive ? handleEndCall : handleStartCall}
        disabled={isLoading}
        className={`
          w-16 h-16 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300
          ${isCallActive 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-green-500 hover:bg-green-600'}
          ${isLoading ? 'opacity-50 cursor-wait' : ''}
          text-white text-2xl
        `}
      >
        {isLoading ? '⏳' : isCallActive ? '📞' : '🎤'}
      </button>

      {/* Transcripción */}
      {isCallActive && transcript && (
        <div className="absolute bottom-20 right-0 w-64 p-3 bg-white rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{transcript}</p>
        </div>
      )}

      {/* Tooltip */}
      {!isCallActive && !isLoading && (
        <div className="absolute bottom-20 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
          Hablar con Ayu
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
```

#### Variables de Entorno
```env
REACT_APP_VAPI_PUBLIC_KEY=pk_xxxxxxxx
REACT_APP_SUPABASE_URL=https://jjpscimtxrudtepzwhag.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. Dashboard de Propiedades

#### Estructura de páginas
```
/dashboard
  /properties
    /[id]
      /bookings
      /analytics
      /settings
```

#### Componente PropertyCard
```jsx
const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold">{property.name}</h3>
      <p className="text-gray-500">{property.location}</p>
      
      <div className="mt-4 flex gap-2">
        <span className={`px-2 py-1 rounded text-xs ${
          property.whatsapp_active ? 'bg-green-100 text-green-800' : 'bg-gray-100'
        }`}>
          WhatsApp {property.whatsapp_active ? '✓' : '○'}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${
          property.vapi_active ? 'bg-green-100 text-green-800' : 'bg-gray-100'
        }`}>
          Voice {property.vapi_active ? '✓' : '○'}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Reservas hoy</span>
          <p className="text-2xl font-bold">{property.bookings_today}</p>
        </div>
        <div>
          <span className="text-gray-500">Pendientes</span>
          <p className="text-2xl font-bold">{property.pending_inquiries}</p>
        </div>
      </div>
    </div>
  );
};
```

---

### 3. Panel de Reservas

#### Lista con filtros
```jsx
const BookingsList = ({ propertyId }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
    dateFrom: null,
    dateTo: null
  });

  const { data: bookings, isLoading } = useQuery(
    ['bookings', propertyId, filters],
    () => fetchBookings(propertyId, filters)
  );

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <select 
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todos los estados</option>
          <option value="inquiry">Consulta</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
        
        <select
          value={filters.channel}
          onChange={(e) => setFilters({...filters, channel: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todos los canales</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="vapi">Voz</option>
          <option value="direct">Directo</option>
        </select>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {bookings?.map(booking => (
          <BookingRow key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};
```

---

### 4. Conexión con Supabase

#### Cliente
```jsx
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
```

#### Hooks personalizados
```jsx
// hooks/useBookings.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';

export const useBookings = (propertyId) => {
  return useQuery(['bookings', propertyId], async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ bookingId, status }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings');
      }
    }
  );
};
```

---

## ESTRUCTURA DE CARPETAS SUGERIDA

```
src/
├── components/
│   ├── VoiceAssistant.jsx
│   ├── PropertyCard.jsx
│   ├── BookingRow.jsx
│   └── ...
├── pages/
│   ├── Dashboard.jsx
│   ├── Properties.jsx
│   ├── PropertyDetail.jsx
│   ├── Bookings.jsx
│   └── Analytics.jsx
├── hooks/
│   ├── useBookings.js
│   ├── useProperties.js
│   └── useAnalytics.js
├── lib/
│   ├── supabase.js
│   └── vapi.js
└── styles/
    └── globals.css
```

---

*Última actualización: 15 Diciembre 2024*
