import React, { useState } from 'react';
import {
  ChevronLeft,
  MessageCircle,
  Phone,
  Send,
  Loader2,
  Bot,
  User,
  Play,
  Square
} from 'lucide-react';

const WorkflowTester = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' or 'vapi'

  // WhatsApp Chat State
  const [whatsappMessages, setWhatsappMessages] = useState([]);
  const [whatsappInput, setWhatsappInput] = useState('');
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // Vapi State
  const [vapiMessages, setVapiMessages] = useState([]);
  const [vapiInput, setVapiInput] = useState('');
  const [vapiLoading, setVapiLoading] = useState(false);
  const [vapiActive, setVapiActive] = useState(false);

  // Workflow VIII - WhatsApp AI Agent
  const sendWhatsAppMessage = async () => {
    if (!whatsappInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: whatsappInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setWhatsappMessages(prev => [...prev, userMessage]);
    setWhatsappInput('');
    setWhatsappLoading(true);

    try {
      // Enviar en formato WhatsApp completo (como lo hace WhatsApp Business)
      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: {
            entry: [
              {
                changes: [
                  {
                    value: {
                      messages: [
                        {
                          from: "34619794604", // Simula tu número
                          text: {
                            body: userMessage.text
                          },
                          type: "text"
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        })
      });

      // El workflow no retorna respuesta directa, solo procesa el mensaje
      // En producción, la respuesta va a WhatsApp vía ChakraHQ

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          text: '✅ Mensaje procesado por el workflow.\n\nℹ️ En producción, la respuesta se enviaría a WhatsApp vía ChakraHQ.\n\nPara ver la respuesta real del AI, usa WhatsApp desde tu móvil o revisa las ejecuciones en n8n.',
          sender: 'system',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };

        setWhatsappMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error al conectar con el workflow. Verifica que esté activo.',
        sender: 'system',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setWhatsappMessages(prev => [...prev, errorMessage]);
    } finally {
      setWhatsappLoading(false);
    }
  };

  // Workflow IX - Vapi Voice AI
  const sendVapiMessage = async () => {
    if (!vapiInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: vapiInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setVapiMessages(prev => [...prev, userMessage]);
    setVapiInput('');
    setVapiLoading(true);

    try {
      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            type: 'function-call',
            functionCall: {
              name: 'chat',
              parameters: {
                query: userMessage.text
              }
            }
          }
        })
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.output || data.result || 'Respuesta recibida',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };

      setVapiMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error al conectar con Vapi. Verifica que el workflow esté activo.',
        sender: 'system',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setVapiMessages(prev => [...prev, errorMessage]);
    } finally {
      setVapiLoading(false);
    }
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'whatsapp') {
        sendWhatsAppMessage();
      } else {
        sendVapiMessage();
      }
    }
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4 relative overflow-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <ChevronLeft className="w-6 h-6 text-purple-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Workflow Tester</h2>
            <p className="text-white/90 text-lg mt-2">Test workflows VIII & IX</p>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
              activeTab === 'whatsapp'
                ? 'bg-white text-purple-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <MessageCircle className="w-6 h-6 inline mr-2" />
            WhatsApp AI Agent (VIII)
          </button>
          <button
            onClick={() => setActiveTab('vapi')}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
              activeTab === 'vapi'
                ? 'bg-white text-purple-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Phone className="w-6 h-6 inline mr-2" />
            Vapi Voice AI (IX)
          </button>
        </div>

        {/* WhatsApp Simulator */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Izumi Hotel AI Assistant</h3>
                  <p className="text-sm text-green-100">Workflow VIII - Active</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
              {whatsappMessages.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Envía un mensaje para comenzar</p>
                  <p className="text-sm mt-2">Prueba preguntar sobre disponibilidad, precios o hacer una reserva</p>
                </div>
              )}

              {whatsappMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl p-4 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : msg.sender === 'system'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-white text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                  {msg.sender !== 'user' && msg.sender !== 'system' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 order-1">
                      <Bot className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2 order-1">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {whatsappLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={whatsappInput}
                  onChange={(e) => setWhatsappInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'whatsapp')}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-800"
                  disabled={whatsappLoading}
                />
                <button
                  onClick={sendWhatsAppMessage}
                  disabled={whatsappLoading || !whatsappInput.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vapi Simulator */}
        {activeTab === 'vapi' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Vapi Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Phone className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Izumi Hotel Reception</h3>
                    <p className="text-sm text-blue-100">Workflow IX - Voice AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setVapiActive(!vapiActive)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    vapiActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {vapiActive ? (
                    <>
                      <Square className="w-4 h-4 inline mr-2" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 inline mr-2" />
                      Start Call
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vapi Messages */}
            <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
              {!vapiActive && vapiMessages.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                  <Phone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Inicia una llamada para comenzar</p>
                  <p className="text-sm mt-2">Simula una conversación de voz con el recepcionista del hotel</p>
                </div>
              )}

              {vapiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl p-4 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : msg.sender === 'system'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-white text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                  {msg.sender !== 'user' && msg.sender !== 'system' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 order-1">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2 order-1">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {vapiLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            {vapiActive && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={vapiInput}
                    onChange={(e) => setVapiInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'vapi')}
                    placeholder="Escribe lo que dirías por voz..."
                    className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-800"
                    disabled={vapiLoading}
                  />
                  <button
                    onClick={sendVapiMessage}
                    disabled={vapiLoading || !vapiInput.trim()}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-xl text-purple-600 mb-4">Workflow VIII - WhatsApp AI</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ AI Agent con herramientas de reserva</li>
              <li>✅ Check Availability</li>
              <li>✅ Calculate Price</li>
              <li>✅ Create Booking</li>
              <li>✅ Memoria conversacional (20 mensajes)</li>
            </ul>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-xl text-purple-600 mb-4">Workflow IX - Vapi Voice AI</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ AI Voice Assistant para llamadas</li>
              <li>✅ Mismas herramientas que WhatsApp</li>
              <li>✅ Conversación natural por voz</li>
              <li>✅ Integración con sistema de reservas</li>
              <li>✅ Respuesta en tiempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTester;
