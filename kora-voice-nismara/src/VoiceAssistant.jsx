import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Loader2, MessageCircle } from 'lucide-react';

const VoiceAssistant = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [callStatus, setCallStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  // WhatsApp handoff state
  const [callId, setCallId] = useState(null);
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');

  const vapiRef = useRef(null);
  const callDataRef = useRef({
    messages: [],
    transcripts: [],
    structuredOutputs: {},
    startTime: null,
    endTime: null
  });

  // Función para añadir logs al debug
  const addDebugLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-20), { type, message, timestamp }]); // Máximo 20 logs
  };

  useEffect(() => {
    // Inicializar Vapi con Public Key
    const publicKey = '3716bc62-40e8-4f3b-bfa2-9e934db6b51d';

    if (!publicKey) {
      console.warn('⚠️ VAPI_PUBLIC_KEY no configurada. El botón de voz no funcionará.');
      setError('Vapi no configurado');
      return;
    }

    vapiRef.current = new Vapi(publicKey);
    const vapi = vapiRef.current;

    // Event listeners
    vapi.on('call-start', (callData) => {
      console.log('✅ Llamada iniciada - callData completo:', JSON.stringify(callData, null, 2));
      addDebugLog('success', 'Call started successfully');

      // Capturar call_id para el handoff a WhatsApp
      // VAPI puede pasar el id en diferentes lugares
      const extractedCallId = callData?.id || callData?.callId || callData?.call?.id;
      if (extractedCallId) {
        setCallId(extractedCallId);
        console.log('📞 Call ID capturado:', extractedCallId);
      } else {
        console.warn('⚠️ No se encontró call_id en callData:', callData);
      }

      callDataRef.current = {
        messages: [],
        transcripts: [],
        structuredOutputs: {},
        startTime: new Date().toISOString(),
        endTime: null
      };

      setIsCallActive(true);
      setIsLoading(false);
      setCallStatus('connected');
      setError(null);
    });

    vapi.on('call-end', async (callData) => {
      console.log('📞 Llamada terminada');

      // Guardar endTime
      callDataRef.current.endTime = new Date().toISOString();

      // Calcular duración
      const startTime = new Date(callDataRef.current.startTime);
      const endTime = new Date(callDataRef.current.endTime);
      const durationMs = endTime - startTime;

      // Capturar structured outputs de callData si existen
      if (callData?.artifact?.structuredOutputs) {
        console.log('📦 Structured outputs en callData:', callData.artifact.structuredOutputs);
        callDataRef.current.structuredOutputs = {
          ...callDataRef.current.structuredOutputs,
          ...callData.artifact.structuredOutputs
        };
      }

      // Construir payload con datos acumulados
      const accumulatedData = {
        squadId: '03ec6ffc-2fcc-4898-b69a-8b0f26c81683',
        startedAt: callDataRef.current.startTime,
        endedAt: callDataRef.current.endTime,
        durationMs: durationMs,
        messages: callDataRef.current.messages,
        transcripts: callDataRef.current.transcripts,
        transcript: callDataRef.current.transcripts.map(t => `${t.role}: ${t.text}`).join('\n'),
        structuredOutputs: callDataRef.current.structuredOutputs,
        // Incluir callData de VAPI si existe
        ...(callData || {})
      };

      console.log('📊 Datos acumulados de la llamada:', accumulatedData);
      console.log('📦 Structured Outputs capturados:', callDataRef.current.structuredOutputs);

      setIsCallActive(false);
      setIsLoading(false);
      setIsSpeaking(false);
      setTranscript('');
      setInterimTranscript('');
      setCallStatus('ended');
      setTimeout(() => setCallStatus('idle'), 2000);

      // VAPI no envía webhooks desde llamadas web/browser
      // Enviamos manualmente los datos al webhook de n8n
      try {
        console.log('📤 Enviando call report a n8n...');
        const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/kora-post-call-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: {
              type: 'end-of-call-report',
              call: accumulatedData,
              artifact: {
                structuredOutputs: callDataRef.current.structuredOutputs || {
                  '5d27326f-3f5b-4eb2-b30d-e63b1f15b056': {
                    name: 'callResult',
                    result: accumulatedData
                  }
                }
              }
            }
          })
        });

        if (response.ok) {
          console.log('✅ Call report enviado correctamente a n8n');
          const responseData = await response.json();
          console.log('📥 Respuesta de n8n:', responseData);
        } else {
          console.error('❌ Error al enviar call report:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error enviando call report a n8n:', error);
      }
    });

    vapi.on('speech-start', () => {
      setIsSpeaking(true);
      // Clear interim transcript when speech starts
      setInterimTranscript('');
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
      // Clear interim transcript when speech ends
      setInterimTranscript('');
    });

    vapi.on('message', (message) => {
      // Capturar todos los mensajes para el reporte final
      callDataRef.current.messages.push(message);

      // Transcripción en tiempo real - mostrar parciales Y finales
      if (message.type === 'transcript') {
        if (message.transcriptType === 'partial') {
          // Mostrar transcript parcial inmediatamente (en tiempo real)
          setInterimTranscript(message.transcript);
        } else if (message.transcriptType === 'final') {
          // Transcript final - actualizar el transcript principal
          setTranscript(message.transcript);
          setInterimTranscript(''); // Limpiar el parcial
          callDataRef.current.transcripts.push({
            text: message.transcript,
            timestamp: new Date().toISOString(),
            role: message.role || 'user'
          });
        }
      }

      // Capturar structured outputs / artifacts
      if (message.type === 'structured-data' || message.structuredData) {
        console.log('📦 Structured data recibido:', message.structuredData || message);
        callDataRef.current.structuredOutputs = {
          ...callDataRef.current.structuredOutputs,
          ...(message.structuredData || {})
        };
      }

      // Log de function calls (para debug)
      if (message.type === 'function-call') {
        console.log('🔧 Tool llamado:', message.functionCall);
      }

      // Detectar idioma del transcript del asistente
      if (message.type === 'transcript' && message.role === 'assistant' && message.transcriptType === 'final') {
        const text = message.transcript?.toLowerCase() || '';
        // Detectar español por palabras comunes
        if (text.includes('hola') || text.includes('buenos') || text.includes('gracias') ||
            text.includes('reserva') || text.includes('habitación') || text.includes('dólares') ||
            text.includes('gustaría') || text.includes('puedo') || text.includes('ayudar')) {
          setDetectedLanguage('es');
          console.log('🌐 Idioma detectado: español');
        }
        // Detectar indonesio por palabras comunes
        else if (text.includes('selamat') || text.includes('terima kasih') || text.includes('kamar') ||
                 text.includes('malam') || text.includes('pagi') || text.includes('siang')) {
          setDetectedLanguage('id');
          console.log('🌐 Idioma detectado: indonesio');
        }
      }
    });

    vapi.on('error', (error) => {
      console.error('❌ Error Vapi completo:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error type:', error?.type);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      addDebugLog('error', `VAPI Error: ${error?.message || JSON.stringify(error)}`);
      setIsLoading(false);
      setIsCallActive(false);
      setCallStatus('idle');
      setError(error?.message || error?.error || JSON.stringify(error) || 'Error al conectar');
    });

    // Cleanup
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const MAX_RETRIES = 5;

  const handleStartCall = async (attempt = 1) => {
    if (!vapiRef.current) {
      console.error('Vapi no inicializado');
      setError('Vapi no está configurado');
      return;
    }

    // Solo setear estos estados en el primer intento
    if (attempt === 1) {
      addDebugLog('info', 'Starting VAPI call...');
      setIsLoading(true);
      setCallStatus('connecting');
      setError(null);
    }

    try {
      // Usar ZEN_KORA Squad configurado en VAPI Dashboard
      // Squad ID: 03ec6ffc-2fcc-4898-b69a-8b0f26c81683
      // Squad name: ZEN_KORA Squad - Zentara Living
      // Miembros: ZEN_KORA Greeter + ZEN_KORA_ES (por ahora, EN/ID se añaden después)
      // Server URL: https://n8n-production-bb2d.up.railway.app/webhook/kora-post-call-v2
      // NOTA: VAPI Web SDK requiere squadId como tercer parámetro: start(null, null, squadId)
      const call = await vapiRef.current.start(null, null, '03ec6ffc-2fcc-4898-b69a-8b0f26c81683');

      // Capturar call_id que devuelve vapi.start()
      if (call?.id) {
        setCallId(call.id);
        console.log('📞 Call ID capturado de vapi.start():', call.id);
      } else {
        console.log('📞 Respuesta de vapi.start():', JSON.stringify(call, null, 2));
      }

      // Si llega aquí, la conexión fue exitosa
      console.log(`✅ Conexión exitosa en intento ${attempt}`);

    } catch (err) {
      console.error(`❌ Intento ${attempt} fallido:`, err);

      if (attempt < MAX_RETRIES) {
        console.log(`🔄 Reintentando... (${attempt + 1}/${MAX_RETRIES})`);
        // 3s delay para dar más tiempo entre reintentos
        await new Promise(res => setTimeout(res, 3000));
        // Reintentar recursivamente
        return handleStartCall(attempt + 1);
      }

      // Si llegamos aquí, fallaron todos los intentos
      console.error(`❌ Fallaron ${MAX_RETRIES} intentos de conexión`);
      setIsLoading(false);
      setCallStatus('idle');
      setError('Could not connect. Please check your connection and try again.');
    }
  };

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  // Textos del botón WhatsApp según idioma
  const getWhatsAppButtonText = () => {
    switch (detectedLanguage) {
      case 'es': return 'Continuar por WhatsApp';
      case 'id': return 'Lanjutkan lewat WhatsApp';
      default: return 'Continue on WhatsApp';
    }
  };

  const getWhatsAppSubtext = () => {
    switch (detectedLanguage) {
      case 'es': return '¿Prefieres escribir?';
      case 'id': return 'Lebih suka mengetik?';
      default: return 'Prefer texting?';
    }
  };

  const getLoadingText = () => {
    switch (detectedLanguage) {
      case 'es': return 'Preparando tu mensaje…';
      case 'id': return 'Menyiapkan pesan Anda…';
      default: return 'Preparing your message…';
    }
  };

  // Mensajes genéricos de respaldo
  const getGenericMessage = () => {
    switch (detectedLanguage) {
      case 'es': return 'Hola, acabo de hablar con KORA y me gustaría continuar mi reserva por aquí.';
      case 'id': return 'Halo, saya baru saja berbicara dengan KORA dan ingin melanjutkan pemesanan di sini.';
      default: return "Hi, I've just spoken with KORA and I'd like to continue my booking here.";
    }
  };

  // Número de Izumi (para pruebas)
  const FALLBACK_PHONE = '6285119342160';

  // Handler del botón WhatsApp - Acción encadenada: colgar + esperar análisis + abrir WhatsApp
  const handleWhatsAppHandoff = async () => {
    if (!callId) {
      // Sin call_id, abrir enlace genérico
      const msg = encodeURIComponent(getGenericMessage());
      window.location.href = `https://wa.me/${FALLBACK_PHONE}?text=${msg}`;
      return;
    }

    // 1. Deshabilitar el botón
    setIsWhatsAppLoading(true);

    // 2. Colgar la llamada si está activa
    if (isCallActive && vapiRef.current) {
      vapiRef.current.stop();
    }

    // 3. Esperar para que VAPI procese el fin de la llamada
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // 4. POST al endpoint con call_ended: true, timeout 15 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/kora-handoff-whatsapp-v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ call_id: callId, language: detectedLanguage, call_ended: true }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const result = Array.isArray(data) ? data[0] : data;

        // 5. Si ok === true → abrir wa_url, si no → enlace genérico
        if (result.ok && result.wa_url) {
          window.location.href = result.wa_url;
        } else {
          const msg = encodeURIComponent(getGenericMessage());
          window.location.href = `https://wa.me/${FALLBACK_PHONE}?text=${msg}`;
        }
      } else {
        // Error HTTP - abrir enlace genérico
        const msg = encodeURIComponent(getGenericMessage());
        window.location.href = `https://wa.me/${FALLBACK_PHONE}?text=${msg}`;
      }
    } catch (err) {
      // Error de red o timeout - abrir enlace genérico
      console.error('WhatsApp handoff error:', err);
      const msg = encodeURIComponent(getGenericMessage());
      window.location.href = `https://wa.me/${FALLBACK_PHONE}?text=${msg}`;
    } finally {
      setIsWhatsAppLoading(false);
      setCallId(null); // Limpiar callId después de usar
    }
  };

  // Determinar estado del botón
  const getButtonState = () => {
    if (isLoading) return {
      text: 'Connecting...',
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      color: 'bg-yellow-500 hover:bg-yellow-600'
    };
    if (isCallActive) return {
      text: 'End Call',
      icon: <PhoneOff className="w-5 h-5" />,
      color: 'bg-red-500 hover:bg-red-600'
    };
    return {
      text: 'Talk to KORA',
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74d1f] hover:to-[#e09518]'
    };
  };

  const buttonState = getButtonState();

  // Si hay error de configuración, no mostrar el botón
  if (error === 'Vapi no configurado') {
    return null;
  }

  return (
    <>
      {/* Botón flotante - centro, más abajo para no tapar el nombre del hotel */}
      <div className="fixed bottom-4 left-0 right-0 px-2 md:left-1/2 md:right-auto md:-translate-x-1/2 md:px-0 z-40 flex flex-col items-center gap-2">

        {/* Panel de estado cuando está en llamada */}
        {isCallActive && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-fade-in border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${isSpeaking ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-base font-semibold text-gray-800">
                {isSpeaking ? '🎤 Listening...' : '💬 KORA is responding...'}
              </span>
            </div>

            {(transcript || interimTranscript) && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 mt-3 border border-orange-200">
                <p className="text-xs font-medium text-orange-600 mb-2">Transcript:</p>
                {transcript && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{transcript}</p>
                )}
                {interimTranscript && (
                  <p className="text-sm text-gray-500 italic leading-relaxed">
                    {interimTranscript}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mensaje de error */}
        {error && error !== 'Vapi no configurado' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 max-w-xs">
            <p className="text-sm text-red-700">
              {typeof error === 'string' ? error : 'Error connecting to VAPI'}
            </p>
          </div>
        )}

        {/* Botón grande clickeable - Todo el cuadro naranja inicia la llamada */}
        {!isCallActive && (
          <button
            onClick={() => handleStartCall()}
            disabled={isLoading}
            className={`flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-[#FF8C42] via-[#d85a2a] to-[#FF8C42] border-2 border-white shadow-2xl rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${isLoading ? 'animate-pulse' : 'animate-pulse-glow'}`}
            title="Click to talk with KORA"
          >
            <img
              src="/images/lumina-avatar.jpg"
              alt="KORA - Voice Assistant"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
            />
            <div className="text-left">
              <p className="text-white font-bold text-sm md:text-base tracking-wide drop-shadow-lg">
                {isLoading ? '🔄 Connecting...' : 'KORA Voice Assistant'}
              </p>
              <p className="text-white/90 text-xs md:text-sm drop-shadow-md">
                {isLoading ? 'Please wait...' : 'Click here to start talking'}
              </p>
            </div>
            <Phone className={`w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0 ${isLoading ? 'animate-bounce' : 'animate-pulse'}`} style={isLoading ? { animation: 'bounce 0.5s infinite' } : {}} />
          </button>
        )}

        {/* Botón para colgar cuando está en llamada - compacto */}
        {isCallActive && (
          <button
            onClick={handleEndCall}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full shadow-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-all hover:scale-105 border border-white"
            title="End Call"
          >
            <PhoneOff className="w-3 h-3" />
            <span>End Call</span>
          </button>
        )}

        {/* Botón de WhatsApp - compacto */}
        {(isCallActive || callId) && (
          <button
            onClick={handleWhatsAppHandoff}
            disabled={isWhatsAppLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] border border-white shadow-lg rounded-full transition-all duration-300 hover:scale-105 cursor-pointer ${isWhatsAppLoading ? 'opacity-70' : ''}`}
            title="Continue on WhatsApp"
          >
            {isWhatsAppLoading ? (
              <Loader2 className="w-4 h-4 text-white flex-shrink-0 animate-spin" />
            ) : (
              <MessageCircle className="w-4 h-4 text-white flex-shrink-0" />
            )}
            <span className="text-white font-semibold text-xs">
              {isWhatsAppLoading ? getLoadingText() : getWhatsAppButtonText()}
            </span>
          </button>
        )}
      </div>

      {/* Overlay oscuro durante la llamada */}
      {isCallActive && (
        <div
          className="fixed inset-0 bg-black/10 z-30 pointer-events-none"
          aria-hidden="true"
        />
      )}

    </>
  );
};

export default VoiceAssistant;

