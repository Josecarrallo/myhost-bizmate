import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  Target,
  Palette,
  MessageSquare,
  PhoneCall,
  Lightbulb,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';

const AISystems = ({ onBack }) => {
  const [selectedAgent, setSelectedAgent] = useState('osiris');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Agent definitions with corporate orange theme
  const agents = {
    osiris: {
      id: 'osiris',
      name: 'OSIRIS',
      fullName: 'OSIRIS.AI',
      description: 'Operations & Control',
      icon: Bot,
      gradient: 'from-[#d85a2a] via-[#e67e50] to-[#f5a524]',
      glowColor: 'shadow-[#d85a2a]/50',
      quickQuestions: [
        "What's my occupancy for next 7 days?",
        "Show pending payments",
        "Any active alerts?",
        "Today's check-ins"
      ]
    },
    lumina: {
      id: 'lumina',
      name: 'LUMINA',
      fullName: 'LUMINA.AI',
      description: 'Sales & Leads',
      icon: Target,
      gradient: 'from-[#FF6B35] via-[#FF8C42] to-[#FFA94D]',
      glowColor: 'shadow-orange-500/50',
      quickQuestions: [
        "Show hot leads",
        "Pending follow-ups",
        "Lead conversion rate",
        "Draft follow-up message"
      ]
    },
    iris: {
      id: 'iris',
      name: 'IRIS',
      fullName: 'IRIS.AI',
      description: 'Marketing Intelligence',
      icon: Palette,
      gradient: 'from-purple-500 via-pink-500 to-rose-400',
      glowColor: 'shadow-purple-500/50',
      quickQuestions: [
        "Content ideas for this week",
        "Review performance",
        "Draft Instagram post",
        "Campaign summary"
      ]
    },
    banyu: {
      id: 'banyu',
      name: 'BANYU',
      fullName: 'BANYU.AI',
      description: 'WhatsApp Concierge',
      icon: MessageSquare,
      gradient: 'from-emerald-500 via-green-500 to-teal-400',
      glowColor: 'shadow-emerald-500/50',
      quickQuestions: [
        "Active conversations",
        "Messages today",
        "Send welcome message",
        "Response time stats"
      ]
    },
    kora: {
      id: 'kora',
      name: 'KORA',
      fullName: 'KORA.AI',
      description: 'Voice Assistant',
      icon: PhoneCall,
      gradient: 'from-blue-500 via-indigo-500 to-violet-400',
      glowColor: 'shadow-blue-500/50',
      quickQuestions: [
        "Today's calls",
        "Call duration average",
        "Sentiment analysis",
        "Missed calls"
      ]
    },
    aura: {
      id: 'aura',
      name: 'AURA',
      fullName: 'AURA.AI',
      description: 'Insights & Predictions',
      icon: Lightbulb,
      gradient: 'from-amber-400 via-yellow-500 to-orange-400',
      glowColor: 'shadow-amber-500/50',
      quickQuestions: [
        "Revenue forecast",
        "Market trends",
        "Optimization suggestions",
        "Anomaly detection"
      ]
    }
  };

  const currentAgent = agents[selectedAgent];

  // Welcome message when agent changes
  useEffect(() => {
    const welcomeMessage = {
      type: 'assistant',
      agent: selectedAgent,
      content: `Hello! I'm ${currentAgent.fullName}, your ${currentAgent.description} assistant. How can I help you today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [selectedAgent]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (mock for demo)
    setTimeout(() => {
      const mockResponse = {
        type: 'assistant',
        agent: selectedAgent,
        content: getMockResponse(selectedAgent, inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, mockResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const getMockResponse = (agent, question) => {
    // Mock responses for demo
    const responses = {
      osiris: "Based on current data:\n\n📊 **Occupancy Next 7 Days:** 85% (6 of 7 properties booked)\n\n💰 **Pending Payments:** 3 payments totaling $2,450\n\n✅ **System Status:** All operational\n\nWould you like me to send payment reminders?",
      lumina: "Here's your sales summary:\n\n🎯 **Hot Leads:** 5 leads with high engagement\n\n📧 **Pending Follow-ups:** 8 leads need contact\n\n📈 **Conversion Rate:** 23% (last 30 days)\n\nShall I draft follow-up messages for the hot leads?",
      iris: "Marketing insights:\n\n✨ **Content Ideas:** Beach sunset posts, villa tours, guest testimonials\n\n⭐ **Review Performance:** 4.8 avg rating (last month)\n\n📱 **Best Time to Post:** 6-8 PM local time\n\nWant me to create a content calendar?",
      banyu: "WhatsApp status:\n\n💬 **Active Conversations:** 12 guests\n\n📨 **Messages Today:** 47 messages\n\n⚡ **Avg Response Time:** 3.2 minutes\n\nNeed help with any specific conversation?",
      kora: "Voice activity:\n\n📞 **Calls Today:** 8 calls\n\n⏱️ **Avg Duration:** 4m 32s\n\n😊 **Sentiment:** 85% positive\n\nAny call you'd like to review?",
      aura: "Market intelligence:\n\n📈 **Revenue Forecast:** +15% next month\n\n🌴 **Bali Trends:** High season starting\n\n💡 **Recommendation:** Increase rates 10-15%\n\nWant detailed analysis?"
    };

    return responses[agent] || "I'm here to help! Ask me anything.";
  };

  const AgentIcon = currentAgent.icon;

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-[#1a1f2e] via-[#2a2f3a] to-[#1a1f2e] flex flex-col overflow-hidden">
      {/* Header - Corporate Design */}
      <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-orange-500/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`
              w-20 h-20 rounded-2xl bg-gradient-to-br ${currentAgent.gradient}
              flex items-center justify-center shadow-2xl ${currentAgent.glowColor}
              ring-4 ring-white/20
              animate-pulse
            `}>
              <AgentIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                {currentAgent.fullName}
              </h2>
              <p className="text-base text-orange-300 font-medium">{currentAgent.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-full">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Agent Selector - BIGGER & MORE ATTRACTIVE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(agents).map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`
                  group relative flex flex-col items-center gap-3 p-4 rounded-2xl
                  transition-all duration-300 transform
                  ${isActive
                    ? `bg-gradient-to-br ${agent.gradient} text-white shadow-2xl ${agent.glowColor}
                       scale-105 ring-4 ring-white/30 animate-pulse`
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:scale-105 hover:shadow-xl'
                  }
                `}
              >
                {/* Icon Container */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center
                  transition-transform duration-300
                  ${isActive
                    ? 'bg-white/20 scale-110'
                    : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-110'
                  }
                `}>
                  <Icon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-white/80'}`} />
                </div>

                {/* Agent Name */}
                <div className="text-center">
                  <span className={`text-sm font-bold block ${isActive ? 'text-white' : 'text-white/90'}`}>
                    {agent.name}
                  </span>
                  <span className={`text-xs ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                    {agent.description.split(' ')[0]}
                  </span>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area - Enhanced Design */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-black/20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`
                max-w-[85%] rounded-2xl p-5 shadow-xl
                ${message.type === 'user'
                  ? 'bg-gradient-to-br from-[#d85a2a] via-[#e67e50] to-[#f5a524] text-white ring-2 ring-orange-400/30'
                  : 'bg-white/10 backdrop-blur-md text-white border-2 border-white/20'
                }
              `}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/20">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center`}>
                    <AgentIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-orange-300 font-semibold text-sm">{currentAgent.fullName}</span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-base">{message.content}</p>
              <p className="text-xs opacity-70 mt-3 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border-2 border-white/20 shadow-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center animate-pulse`}>
                  <AgentIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions - Enhanced */}
      <div className="px-6 pb-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {currentAgent.quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-5 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-orange-500/20 hover:to-orange-600/20
                       text-white text-sm font-medium rounded-xl whitespace-nowrap
                       border border-white/20 hover:border-orange-400/50
                       transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar - Premium Design */}
      <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-t border-orange-500/20 p-6 shadow-2xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask ${currentAgent.name} anything...`}
            className="flex-1 bg-white/10 text-white placeholder-orange-300/50 rounded-2xl px-6 py-4
                     border-2 border-white/20 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20
                     transition-all duration-300 backdrop-blur-sm text-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform
              ${inputMessage.trim() && !isLoading
                ? `bg-gradient-to-br ${currentAgent.gradient} text-white
                   hover:scale-105 hover:shadow-2xl ${currentAgent.glowColor}
                   ring-2 ring-white/30 active:scale-95`
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISystems;
