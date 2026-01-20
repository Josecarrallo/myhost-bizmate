import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Loader2 } from 'lucide-react';

const VoiceAssistant = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [callStatus, setCallStatus] = useState('idle');
  const [error, setError] = useState(null);

  const vapiRef = useRef(null);
  const callDataRef = useRef({
    messages: [],
    transcripts: [],
    structuredOutputs: {},
    startTime: null,
    endTime: null
  });

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
    vapi.on('call-start', () => {
      console.log('✅ Llamada iniciada');
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
        assistantId: 'ae9ea22a-fc9a-49ba-b5b8-900ed69b7615',
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
                  '6426dbc9-8b9e-49f7-8f29-faa16683bcda': {
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
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapi.on('message', (message) => {
      // Capturar todos los mensajes para el reporte final
      callDataRef.current.messages.push(message);

      // Transcripción en tiempo real
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript(message.transcript);
        callDataRef.current.transcripts.push({
          text: message.transcript,
          timestamp: new Date().toISOString(),
          role: message.role || 'user'
        });
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
    });

    vapi.on('error', (error) => {
      console.error('❌ Error Vapi completo:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error type:', error?.type);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
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

  const handleStartCall = async () => {
    if (!vapiRef.current) {
      console.error('Vapi no inicializado');
      setError('Vapi no está configurado');
      return;
    }

    setIsLoading(true);
    setCallStatus('connecting');
    setError(null);

    try {
      // Usar Assistant MCP configurado en VAPI Dashboard
      // ID: Izumi Hotel Receptionist (MCP) - ae9ea22a-fc9a-49ba-b5b8-900ed69b7615
      // Con MCP Server: https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel
      // Server URL: https://n8n-production-bb2d.up.railway.app/webhook/kora-post-call-v2
      // NOTA: VAPI Web SDK requiere string directo, no objeto
      await vapiRef.current.start('ae9ea22a-fc9a-49ba-b5b8-900ed69b7615');
    } catch (error) {
      console.error('Error al iniciar llamada:', error);
      setIsLoading(false);
      setCallStatus('idle');
      setError(error.message || 'No se pudo iniciar la llamada');
    }
  };

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
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
      text: 'Talk to LUMINA',
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
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Panel de estado cuando está en llamada */}
        {isCallActive && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-fade-in border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${isSpeaking ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-base font-semibold text-gray-800">
                {isSpeaking ? '🎤 Listening...' : '💬 LUMINA is responding...'}
              </span>
            </div>

            {transcript && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 mt-3 border border-orange-200">
                <p className="text-xs font-medium text-orange-600 mb-2">Transcript:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
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

        {/* Avatar de LUMINA cuando no está en llamada */}
        {!isCallActive && !isLoading && (
          <div className="flex items-center gap-3 bg-white rounded-full shadow-2xl pr-4 border-2 border-orange-200 animate-fade-in">
            <img
              src="/images/lumina-avatar.jpg"
              alt="LUMINA - Sales Assistant"
              className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
            />
            <div className="text-left">
              <p className="text-sm font-black text-[#d85a2a]">
                LUMINA
              </p>
              <p className="text-xs text-gray-600 font-semibold">
                Sales Assistant
              </p>
            </div>
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={isCallActive ? handleEndCall : handleStartCall}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl
            text-white font-bold text-base
            transition-all duration-300 transform
            ${buttonState.color}
            ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-110 hover:shadow-3xl'}
            ${isCallActive ? 'animate-pulse' : ''}
            border-2 border-white
          `}
          title={buttonState.text}
        >
          {buttonState.icon}
          <span>{buttonState.text}</span>
        </button>

        {/* Tooltip cuando no está en llamada */}
        {!isCallActive && !isLoading && (
          <div className="bg-gradient-to-br from-[#1f2937] to-[#374151] backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border-2 border-[#d85a2a]/30">
            <p className="text-xs font-bold text-white">
              🤖 24/7 Voice Assistant
            </p>
            <p className="text-xs text-white/90">
              Click "Talk to LUMINA" to start
            </p>
          </div>
        )}
      </div>

      {/* Overlay oscuro durante la llamada */}
      {isCallActive && (
        <div
          className="fixed inset-0 bg-black/20 z-40 pointer-events-none backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default VoiceAssistant;

