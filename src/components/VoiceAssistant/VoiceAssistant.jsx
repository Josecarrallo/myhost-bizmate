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
      setIsCallActive(true);
      setIsLoading(false);
      setCallStatus('connected');
      setError(null);
    });

    vapi.on('call-end', () => {
      console.log('📞 Llamada terminada');
      setIsCallActive(false);
      setIsLoading(false);
      setIsSpeaking(false);
      setTranscript('');
      setCallStatus('ended');
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
      // Usar Transient Assistant (configuración inline)
      await vapiRef.current.start({
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "es"
        },
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Eres Ayu, la recepcionista virtual de Izumi Hotel en Ubud, Bali. Eres amable, profesional y ayudas a los huéspedes con sus consultas sobre reservas, servicios del hotel y recomendaciones locales."
            }
          ]
        },
        voice: {
          provider: "11labs",
          voiceId: "paula"
        },
        firstMessage: "Hola, soy Ayu, la recepcionista virtual de Izumi Hotel. ¿En qué puedo ayudarte hoy?"
      });
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
      text: 'Conectando...',
      icon: <Loader2 className="w-6 h-6 animate-spin" />,
      color: 'bg-yellow-500 hover:bg-yellow-600'
    };
    if (isCallActive) return {
      text: 'Terminar Llamada',
      icon: <PhoneOff className="w-6 h-6" />,
      color: 'bg-red-500 hover:bg-red-600'
    };
    return {
      text: 'Hablar con Ayu',
      icon: <Phone className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600'
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
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-fade-in border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-base font-semibold text-gray-800">
                {isSpeaking ? '🎤 Escuchando...' : '💬 Ayu está respondiendo...'}
              </span>
            </div>

            {transcript && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mt-3 border border-green-100">
                <p className="text-xs font-medium text-green-600 mb-2">Transcripción:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {/* Mensaje de error */}
        {error && error !== 'Vapi no configurado' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 max-w-xs">
            <p className="text-sm text-red-700">
              {typeof error === 'string' ? error : 'Error al conectar con VAPI'}
            </p>
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={isCallActive ? handleEndCall : handleStartCall}
          disabled={isLoading}
          className={`
            flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl
            text-white font-bold text-lg
            transition-all duration-300 transform
            ${buttonState.color}
            ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-110 hover:shadow-3xl'}
            ${isCallActive ? 'animate-pulse' : ''}
            border-4 border-white
          `}
          title={buttonState.text}
        >
          {buttonState.icon}
          <span>{buttonState.text}</span>
        </button>

        {/* Tooltip cuando no está en llamada */}
        {!isCallActive && !isLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-gray-600">
              🤖 Asistente de voz 24/7
            </p>
            <p className="text-xs text-gray-500">
              Ayu - Recepcionista Izumi Hotel
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
