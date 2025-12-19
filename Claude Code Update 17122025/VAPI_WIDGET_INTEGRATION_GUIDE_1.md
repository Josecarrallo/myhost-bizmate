# INTEGRACIÓN WIDGET VAPI - MY HOST BIZMATE
## Guía para Claude Code
### 16 Diciembre 2024

---

## OBJETIVO

Integrar un botón de llamada de voz en la aplicación React que permita a los clientes hablar con Ayu (la recepcionista virtual de Izumi Hotel) directamente desde el navegador.

---

## DATOS DE CONFIGURACIÓN

```
Assistant ID: 1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61
Assistant Name: Ayu - Izumi Hotel
Vapi Public Key: [OBTENER DE VAPI DASHBOARD → Settings → API Keys]
```

**IMPORTANTE:** José debe obtener el Public Key de https://dashboard.vapi.ai → Settings → API Keys y guardarlo como variable de entorno.

---

## PASO 1: INSTALAR DEPENDENCIA

```bash
npm install @vapi-ai/web
```

---

## PASO 2: VARIABLE DE ENTORNO

Añadir en `.env` o `.env.local`:

```env
VITE_VAPI_PUBLIC_KEY=pk_xxxxxxxxxxxxxxxx
# o si usa Create React App:
REACT_APP_VAPI_PUBLIC_KEY=pk_xxxxxxxxxxxxxxxx
```

---

## PASO 3: CREAR COMPONENTE

Crear archivo `src/components/VoiceAssistant.jsx`:

```jsx
import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const VoiceAssistant = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, connected, ended
  
  const vapiRef = useRef(null);

  useEffect(() => {
    // Inicializar Vapi
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || process.env.REACT_APP_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      console.error('VAPI_PUBLIC_KEY no configurada');
      return;
    }

    vapiRef.current = new Vapi(publicKey);
    const vapi = vapiRef.current;

    // Event listeners
    vapi.on('call-start', () => {
      console.log('Llamada iniciada');
      setIsCallActive(true);
      setIsLoading(false);
      setCallStatus('connected');
    });

    vapi.on('call-end', () => {
      console.log('Llamada terminada');
      setIsCallActive(false);
      setIsLoading(false);
      setIsSpeaking(false);
      setTranscript('');
      setCallStatus('ended');
      // Reset status después de 2 segundos
      setTimeout(() => setCallStatus('idle'), 2000);
    });

    vapi.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapi.on('message', (message) => {
      // Transcripción en tiempo real
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript(message.transcript);
      }
      
      // Log de function calls (para debug)
      if (message.type === 'function-call') {
        console.log('Tool llamado:', message.functionCall);
      }
    });

    vapi.on('error', (error) => {
      console.error('Error Vapi:', error);
      setIsLoading(false);
      setIsCallActive(false);
      setCallStatus('idle');
    });

    // Cleanup
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const handleStartCall = async () => {
    if (!vapiRef.current) {
      console.error('Vapi no inicializado');
      return;
    }

    setIsLoading(true);
    setCallStatus('connecting');
    
    try {
      await vapiRef.current.start({
        assistantId: '1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61'
      });
    } catch (error) {
      console.error('Error al iniciar llamada:', error);
      setIsLoading(false);
      setCallStatus('idle');
    }
  };

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  // Determinar estado del botón
  const getButtonState = () => {
    if (isLoading) return { text: 'Conectando...', icon: '⏳', color: 'bg-yellow-500' };
    if (isCallActive) return { text: 'Terminar', icon: '📞', color: 'bg-red-500 hover:bg-red-600' };
    return { text: 'Hablar con Ayu', icon: '🎤', color: 'bg-green-500 hover:bg-green-600' };
  };

  const buttonState = getButtonState();

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        
        {/* Panel de estado cuando está en llamada */}
        {isCallActive && (
          <div className="bg-white rounded-lg shadow-xl p-4 w-72 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm font-medium text-gray-700">
                {isSpeaking ? 'Escuchando...' : 'Ayu está respondiendo...'}
              </span>
            </div>
            
            {transcript && (
              <div className="bg-gray-50 rounded p-2 mt-2">
                <p className="text-xs text-gray-500 mb-1">Transcripción:</p>
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={isCallActive ? handleEndCall : handleStartCall}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full shadow-lg
            text-white font-medium
            transition-all duration-300 transform
            ${buttonState.color}
            ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-105'}
            ${isCallActive ? 'animate-pulse' : ''}
          `}
        >
          <span className="text-xl">{buttonState.icon}</span>
          <span>{buttonState.text}</span>
        </button>

        {/* Tooltip cuando no está en llamada */}
        {!isCallActive && !isLoading && (
          <p className="text-xs text-gray-500 text-right">
            Asistente de voz 24/7
          </p>
        )}
      </div>

      {/* Overlay oscuro durante la llamada (opcional) */}
      {isCallActive && (
        <div 
          className="fixed inset-0 bg-black/10 z-40 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default VoiceAssistant;
```

---

## PASO 4: INTEGRAR EN LA APP

En el layout principal o App.jsx:

```jsx
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  return (
    <div>
      {/* ... resto de la app ... */}
      
      {/* Widget de voz - siempre visible */}
      <VoiceAssistant />
    </div>
  );
}

export default App;
```

---

## PASO 5: ESTILOS ADICIONALES (Tailwind)

Si no tienes la animación `animate-fade-in`, añadir en `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  // ...
}
```

---

## VERSIÓN MINIMALISTA (Alternativa)

Si prefieres algo más simple, solo el botón:

```jsx
import { useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const VoiceButton = () => {
  const [active, setActive] = useState(false);
  const vapi = useRef(new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY));

  const toggle = async () => {
    if (active) {
      vapi.current.stop();
      setActive(false);
    } else {
      await vapi.current.start({ assistantId: '1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61' });
      setActive(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full text-white text-2xl shadow-lg
        ${active ? 'bg-red-500' : 'bg-green-500'}`}
    >
      {active ? '✕' : '🎤'}
    </button>
  );
};

export default VoiceButton;
```

---

## VERIFICACIÓN

Después de implementar, verificar:

1. [ ] El botón aparece en la esquina inferior derecha
2. [ ] Al pulsar, pide permiso de micrófono
3. [ ] La llamada se conecta (estado "Conectando..." → "Conectado")
4. [ ] Puedes hablar y Ayu responde
5. [ ] La transcripción aparece (si usas versión completa)
6. [ ] Al pulsar "Terminar", la llamada se cierra
7. [ ] En consola no hay errores

---

## TROUBLESHOOTING

**Error: "VAPI_PUBLIC_KEY no configurada"**
→ Verificar que la variable de entorno está en .env y reiniciar el servidor

**Error: "Permission denied" al iniciar llamada**
→ El usuario debe permitir acceso al micrófono en el navegador

**La llamada no conecta**
→ Verificar que el Assistant ID es correcto
→ Verificar que el workflow IX de n8n está activo

**No hay respuesta de Ayu**
→ Verificar en n8n que el workflow `3sU4RgV892az8nLZ` está activo
→ Revisar ejecuciones en n8n para ver errores

---

## PRÓXIMOS PASOS (FUTURO)

1. **Property ID dinámico:** Pasar el property_id según el hotel que esté viendo el usuario
2. **Múltiples idiomas:** Configurar transcriber multilingüe en Vapi
3. **Analytics:** Trackear llamadas iniciadas/completadas
4. **Número telefónico:** Configurar número para llamadas tradicionales

---

*Documento creado: 16 Diciembre 2024*
*MY HOST BizMate - Integración Vapi Widget*
