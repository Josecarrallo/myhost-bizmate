import React, { useState } from 'react';
import {
  ChevronLeft,
  MessageCircle,
  Phone,
  Send,
  Loader2,
  Bot,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const WorkflowTester = ({ onBack }) => {
  // WhatsApp Chat State
  const [whatsappMessages, setWhatsappMessages] = useState([]);
  const [whatsappInput, setWhatsappInput] = useState('');
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // Workflow VIII - WhatsApp AI Agent
  const sendWhatsAppMessage = async () => {
    if (!whatsappInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: whatsappInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setWhatsappMessages(prev => [...prev, userMessage]);
    setWhatsappInput('');
    setWhatsappLoading(true);

    try {
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
                          from: "34619794604",
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

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          text: '✅ Message processed successfully.\n\nℹ️ In production, the AI response is sent to WhatsApp via ChakraHQ.\n\nTo see the real AI response, use WhatsApp from your mobile or check n8n executions.',
          sender: 'system',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setWhatsappMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error connecting to workflow. Verify that it is active in n8n.',
        sender: 'error',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setWhatsappMessages(prev => [...prev, errorMessage]);
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendWhatsAppMessage();
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto">
      {/* Header */}
      <div className="bg-[#252b3b] border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
              <div>
                <h1 className="text-white text-2xl font-bold">WhatsApp AI Tester</h1>
                <p className="text-white/60 text-sm">Test your WhatsApp AI workflow from your mobile phone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Test from Your Mobile Phone</h3>
              <p className="text-white/80 text-sm">
                Send a WhatsApp message to your hotel's number to test the AI assistant.
                The AI will respond automatically via WhatsApp Business API.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Simulator */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Area - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-[#252b3b] rounded-xl border border-white/10 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 border-b border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Bot className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Izumi Hotel AI Assistant</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        <p className="text-sm text-green-100">Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[350px] overflow-y-auto p-6 bg-[#1a1f2e]">
                  {whatsappMessages.length === 0 && (
                    <div className="text-center text-white/40 mt-20">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Send a message to start testing</p>
                      <p className="text-sm mt-2">Try asking about availability, prices, or making a reservation</p>
                    </div>
                  )}

                  {whatsappMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender !== 'user' && (
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          {msg.sender === 'system' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : msg.sender === 'error' ? (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Bot className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      )}

                      <div className={`max-w-[70%]`}>
                        <div
                          className={`rounded-xl p-4 ${
                            msg.sender === 'user'
                              ? 'bg-[#d85a2a] text-white'
                              : msg.sender === 'error'
                              ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                              : 'bg-[#252b3b] text-white border border-white/10'
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                          <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-white/40'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 bg-[#d85a2a]/20 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                          <User className="w-5 h-5 text-[#d85a2a]" />
                        </div>
                      )}
                    </div>
                  ))}

                  {whatsappLoading && (
                    <div className="flex items-center gap-2 text-white/60">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="bg-[#252b3b] rounded-xl p-4 border border-white/10">
                        <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-[#252b3b] border-t border-white/10">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={whatsappInput}
                      onChange={(e) => setWhatsappInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-lg bg-[#1a1f2e] border border-white/10 focus:border-[#d85a2a] focus:outline-none text-white placeholder-white/40"
                      disabled={whatsappLoading}
                    />
                    <button
                      onClick={sendWhatsAppMessage}
                      disabled={whatsappLoading || !whatsappInput.trim()}
                      className="px-6 py-3 bg-[#d85a2a] text-white rounded-lg font-semibold hover:bg-[#c14d1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel - Takes 1 column */}
            <div className="space-y-6">
              {/* Workflow Info */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  WhatsApp AI Features
                </h3>
                <ul className="space-y-3 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>AI Agent with booking tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Check availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Calculate prices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Create bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Conversational memory (20 messages)</span>
                  </li>
                </ul>
              </div>

              {/* How it Works */}
              <div className="bg-gradient-to-br from-[#d85a2a]/10 to-purple-500/10 rounded-xl p-6 border border-[#d85a2a]/30">
                <h3 className="font-bold text-lg text-white mb-4">How it Works</h3>
                <div className="space-y-3 text-white/80 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#d85a2a] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                    <p>Your message is sent to the n8n workflow</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#d85a2a] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                    <p>AI processes the request using Claude</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#d85a2a] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                    <p>Response sent via WhatsApp Business API</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <h3 className="font-bold text-lg text-white mb-4">Workflow Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">n8n Workflow</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-green-400 text-sm font-semibold">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">WhatsApp API</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-green-400 text-sm font-semibold">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Claude AI</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-green-400 text-sm font-semibold">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTester;
