import React, { useState, useEffect, useRef } from 'react';
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
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const AISystems = ({ onBack }) => {
  const { userData } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(null); // Start with no agent selected
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [showHelp, setShowHelp] = useState(false); // State for help tooltip
  const chatEndRef = useRef(null);

  // Fetch user's property_id on mount
  useEffect(() => {
    const fetchPropertyId = async () => {
      if (!userData?.id) return;

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id')
          .eq('owner_id', userData.id)
          .limit(1)
          .single();

        if (!error && data) {
          setPropertyId(data.id);
        }
      } catch (error) {
        console.error('Error fetching property_id:', error);
      }
    };

    fetchPropertyId();
  }, [userData]);

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
        "Compare this month's revenue vs last month",
        "Which villas are underperforming in occupancy?",
        "Show me booking trends for the next 30 days",
        "What's my average daily rate trend?",
        "Identify operational bottlenecks affecting guest satisfaction"
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
        "What's my lead-to-booking conversion rate this quarter?",
        "Which marketing channels bring the highest-value bookings?",
        "Analyze why leads are dropping off in the pipeline",
        "Compare my sales performance vs competitors",
        "What's the ROI on my current marketing spend?"
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
        "Which content types drive the most bookings?",
        "Analyze my brand visibility vs top 3 competitors",
        "What's my social media engagement ROI?",
        "Recommend optimal posting times based on audience data",
        "Create a content strategy for peak season"
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
        "How does automated chat affect my booking conversion?",
        "What are the most common guest pain points?",
        "Calculate time saved by automation vs manual responses",
        "Which guest segments have highest satisfaction scores?",
        "Identify opportunities to upsell through chat interactions"
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
        "What's my call-to-booking conversion rate?",
        "Analyze common objections preventing bookings",
        "How much staff time is voice AI saving me monthly?",
        "Compare guest satisfaction: AI vs human calls",
        "Identify high-value guests from call patterns"
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
        "Predict my revenue for next quarter with 90% confidence",
        "What pricing changes would maximize my annual profit?",
        "Should I invest in villa renovations? Calculate expected ROI",
        "Which market segments should I target for growth?",
        "Forecast impact of adding 2 more properties to my portfolio"
      ]
    }
  };

  // Welcome message when agent changes
  useEffect(() => {
    if (!selectedAgent) return;

    const agent = agents[selectedAgent];
    const welcomeMessage = {
      type: 'assistant',
      agent: selectedAgent,
      content: `Hello! I'm ${agent.fullName}, your ${agent.description} assistant. How can I help you today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [selectedAgent]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Scroll to bottom to show user message and loading indicator
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      // OSIRIS: Call real n8n endpoint
      if (selectedAgent === 'osiris') {
        // ✅ CORRECTED: Using /webhook/ai/chat-v2 (not /webhook/ai/chat)
        // ✅ CORRECTED: Using authenticated user's ID (not hardcoded Jose's ID)
        const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/ai/chat-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tenant_id: userData?.id || 'c24393db-d318-4d75-8bbf-0fa240b9c1db',
            user_id: userData?.id || 'c24393db-d318-4d75-8bbf-0fa240b9c1db',
            message: currentQuestion
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage = {
          type: 'assistant',
          agent: 'osiris',
          content: data.reply,
          kpis: data.kpis || null,
          table: data.table || null,
          actions: data.actions || null,
          meta: data.meta || null,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Other agents: Use mock response
        setTimeout(() => {
          const mockResponse = {
            type: 'assistant',
            agent: selectedAgent,
            content: getMockResponse(selectedAgent, currentQuestion),
            timestamp: new Date()
          };
          setMessages(prev => [...prev, mockResponse]);
        }, 1500);
      }
    } catch (error) {
      console.error('Error calling OSIRIS:', error);
      const errorMessage = {
        type: 'assistant',
        agent: selectedAgent,
        content: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const getMockResponse = (agent, question) => {
    // Mock responses for demo
    const responses = {
      lumina: "Here's your sales summary:\n\n🎯 **Hot Leads:** 5 leads with high engagement\n\n📧 **Pending Follow-ups:** 8 leads need contact\n\n📈 **Conversion Rate:** 23% (last 30 days)\n\nShall I draft follow-up messages for the hot leads?",
      iris: "Marketing insights:\n\n✨ **Content Ideas:** Beach sunset posts, villa tours, guest testimonials\n\n⭐ **Review Performance:** 4.8 avg rating (last month)\n\n📱 **Best Time to Post:** 6-8 PM local time\n\nWant me to create a content calendar?",
      banyu: "WhatsApp status:\n\n💬 **Active Conversations:** 12 guests\n\n📨 **Messages Today:** 47 messages\n\n⚡ **Avg Response Time:** 3.2 minutes\n\nNeed help with any specific conversation?",
      kora: "Voice activity:\n\n📞 **Calls Today:** 8 calls\n\n⏱️ **Avg Duration:** 4m 32s\n\n😊 **Sentiment:** 85% positive\n\nAny call you'd like to review?",
      aura: "Market intelligence:\n\n📈 **Revenue Forecast:** +15% next month\n\n🌴 **Bali Trends:** High season starting\n\n💡 **Recommendation:** Increase rates 10-15%\n\nWant detailed analysis?"
    };

    return responses[agent] || "I'm here to help! Ask me anything.";
  };

  // AUTOPILOT Actions - Execute n8n webhooks
  const executeAutopilotAction = async (actionType, params) => {
    const tenantId = userData?.id;
    const propId = propertyId;

    if (!tenantId || !propId) {
      console.error('Missing tenant_id or property_id');
      return { success: false, error: 'Missing authentication data' };
    }

    const endpoints = {
      payment_protection: 'https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start-v2',
      approve_action: 'https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action/approve',
      reject_action: 'https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action/reject',
      daily_summary: 'https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary'
    };

    const url = endpoints[actionType];
    if (!url) {
      console.error('Unknown action type:', actionType);
      return { success: false, error: 'Unknown action type' };
    }

    let body = {};

    switch (actionType) {
      case 'payment_protection':
        body = {
          booking_id: params.booking_id,
          tenant_id: tenantId,
          property_id: propId,
          guest_name: params.guest_name,
          guest_phone: params.guest_phone,
          total_amount: params.total_amount,
          check_in: params.check_in,
          check_out: params.check_out
        };
        break;
      case 'approve_action':
      case 'reject_action':
        body = { action_id: params.action_id };
        break;
      case 'daily_summary':
        body = {
          tenant_id: tenantId,
          property_id: propId
        };
        break;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Error executing ${actionType}:`, error);
      return { success: false, error: error.message };
    }
  };

  // If no agent is selected, show agent selection grid
  if (!selectedAgent) {
    return (
      <div className="flex-1 h-screen bg-gradient-to-br from-[#1a1f2e] via-[#2a2f3a] to-[#1a1f2e] flex flex-col overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-orange-500/20 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent mb-2">
                BIZMATE AI
              </h1>
              <p className="text-lg text-orange-300 font-medium">Select an AI Agent to start</p>
            </div>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
          </div>
        </div>

        {/* Agent Selection Grid - COMPACT */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(agents).map((agent) => {
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`
                      group relative flex flex-col items-center gap-3 p-5 rounded-2xl
                      bg-gradient-to-br ${agent.gradient}
                      hover:scale-105 hover:shadow-2xl ${agent.glowColor}
                      transition-all duration-300 transform
                      ring-2 ring-white/20 hover:ring-4 hover:ring-white/40
                    `}
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>

                    {/* Agent Name & Description */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white mb-1">{agent.fullName}</h3>
                      <p className="text-xs text-white/80 font-medium">{agent.description}</p>
                    </div>

                    {/* Arrow icon on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agent is selected - show chat interface (2/3 screen)
  // Render KPIs as cards
  const renderKPIs = (kpis) => {
    if (!kpis || kpis.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {kpis.map((kpi, index) => {
          const isPositive = kpi.delta && kpi.delta.startsWith('+');
          const isNegative = kpi.delta && kpi.delta.startsWith('-');

          return (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-xs text-orange-300 font-medium mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                {kpi.delta && (
                  <span className={`text-xs font-semibold flex items-center gap-1 ${
                    isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {isPositive && <ArrowUp className="w-3 h-3" />}
                    {isNegative && <ArrowDown className="w-3 h-3" />}
                    {kpi.delta}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render table
  const renderTable = (table) => {
    if (!table || !table.rows || table.rows.length === 0) return null;

    return (
      <div className="mt-4 overflow-x-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                {table.columns.map((col, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {table.rows.slice(0, 10).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                  {table.columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-white/90">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {table.row_count > 10 && (
            <div className="bg-white/5 px-4 py-2 text-center text-xs text-orange-300">
              Showing 10 of {table.row_count} rows
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render action buttons
  const renderActions = (actions) => {
    if (!actions || actions.length === 0) return null;

    const handleActionClick = async (action) => {
      console.log('Action clicked:', action);

      // Show confirmation if needed
      if (action.needs_confirm) {
        const confirmed = window.confirm(`Are you sure you want to: ${action.label}?`);
        if (!confirmed) return;
      }

      // Execute the AUTOPILOT action
      setIsLoading(true);
      const result = await executeAutopilotAction(action.type, action.params || {});
      setIsLoading(false);

      // Show result message
      const resultMessage = {
        type: 'assistant',
        agent: 'osiris',
        content: result.success
          ? `✅ ${action.label} completed successfully!`
          : `❌ Failed to execute ${action.label}: ${result.error}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, resultMessage]);
    };

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action)}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                     text-white text-sm font-medium rounded-lg
                     transition-all duration-300 hover:scale-105 hover:shadow-lg
                     flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.needs_confirm ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  // Agent is selected - show chat interface
  // Get current agent data
  const currentAgent = agents[selectedAgent];
  const AgentIcon = currentAgent.icon;

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-[#1a1f2e] via-[#2a2f3a] to-[#1a1f2e] flex flex-col overflow-hidden relative">
      {/* Minimal Header - Chat Mode */}
      <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-orange-500/20 px-4 py-2 shadow-xl">
        <div className="flex items-center gap-4">
          {/* Back button - LEFT aligned, icon only */}
          <button
            onClick={() => setSelectedAgent(null)}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 text-lg"
            title="Back to agents"
          >
            <span>←</span>
          </button>

          {/* Current Agent Info - Compact */}
          <div className="flex items-center gap-2 flex-1">
            <div className={`
              w-8 h-8 rounded-lg bg-gradient-to-br ${currentAgent.gradient}
              flex items-center justify-center shadow-lg
            `}>
              <AgentIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {currentAgent.fullName}
              </h2>
            </div>
          </div>

          {/* Status indicator - Minimal */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-300">Online</span>
          </div>
        </div>
      </div>

      {/* Floating Insights Button */}
      <div className="absolute top-16 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                     text-white rounded-full shadow-xl hover:shadow-2xl
                     flex items-center justify-center transition-all duration-300 hover:scale-110
                     ring-2 ring-white/20"
            title="Strategic Insights"
          >
            <TrendingUp className="w-5 h-5" />
          </button>

          {/* Strategic Insights Panel */}
          {showHelp && (
            <div className="absolute top-14 right-0 w-80 bg-white/98 backdrop-blur-sm
                          rounded-lg shadow-xl p-2.5 border border-orange-300/30
                          animate-fadeIn z-50 max-h-[500px] overflow-y-auto">
              <div className="mb-1.5 pb-1.5 border-b border-orange-200/30 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                  <h3 className="text-[11px] font-bold text-gray-700">Insights</h3>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors w-4 h-4 flex items-center justify-center"
                  title="Close"
                >
                  <span className="text-base leading-none">×</span>
                </button>
              </div>
              <div className="space-y-1">
                {currentAgent.quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(question);
                    }}
                    className="w-full text-left px-2 py-1 bg-orange-50 hover:bg-orange-100
                             text-gray-700 text-[9.5px] leading-[1.3] rounded transition-all duration-100
                             hover:shadow-sm border border-orange-100/50 hover:border-orange-200"
                  >
                    <div className="flex items-start gap-1">
                      <BarChart3 className="w-2.5 h-2.5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - MAXIMIZED for better interaction visibility */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent to-black/20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`
                max-w-[90%] rounded-xl p-4 shadow-lg
                ${message.type === 'user'
                  ? 'bg-gradient-to-br from-[#d85a2a] via-[#e67e50] to-[#f5a524] text-white'
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                }
              `}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center`}>
                    <AgentIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-orange-300 font-semibold text-xs">{currentAgent.fullName}</span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>

              {/* Render KPIs */}
              {message.kpis && renderKPIs(message.kpis)}

              {/* Render Table */}
              {message.table && renderTable(message.table)}

              {/* Render Actions */}
              {message.actions && renderActions(message.actions)}

              <p className="text-xs opacity-60 mt-2 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center animate-pulse`}>
                  <AgentIcon className="w-3 h-3 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor - only visible when user sends a message */}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar - Compact */}
      <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-t border-orange-500/20 p-3 shadow-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask ${currentAgent.name} anything...`}
            className="flex-1 bg-white/10 text-white placeholder-orange-300/50 rounded-xl px-4 py-3
                     border border-white/20 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20
                     transition-all duration-300 backdrop-blur-sm text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`
              px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform
              ${inputMessage.trim() && !isLoading
                ? `bg-gradient-to-br ${currentAgent.gradient} text-white
                   hover:scale-105 hover:shadow-xl ${currentAgent.glowColor}
                   ring-1 ring-white/20 active:scale-95`
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISystems;
