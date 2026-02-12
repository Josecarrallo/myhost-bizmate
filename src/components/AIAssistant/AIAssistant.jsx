import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Sparkles,
  Send,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
  Calendar,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { aiAssistantService } from '../../services/aiAssistant';

const AIAssistant = ({ onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Longer delay to ensure AI response content is fully rendered
    setTimeout(scrollToBottom, 300);
  }, [messages, isLoading]);

  // Scroll on mount - scroll to input on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    } else {
      setTimeout(scrollToBottom, 100);
    }
  }, []);

  // Load initial greeting and reset chat on mount (Opción B: Clean session)
  useEffect(() => {
    const greeting = {
      type: 'assistant',
      content: "Hi! I'm OSIRIS. Ask me anything.",
      timestamp: new Date()
    };

    // Clear messages and start fresh on every mount (Opción B)
    setMessages([greeting]);
    setKpis(null);
    setSuggestedActions([]);

    // Cleanup function to clear state when component unmounts
    return () => {
      setMessages([]);
      setKpis(null);
      setSuggestedActions([]);
    };
  }, []); // Empty dependency array = only runs on mount/unmount

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Validate user is logged in
    if (!user || !user.id) {
      const errorMessage = {
        type: 'error',
        content: 'User not authenticated. Please refresh the page.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get current date range (today to +30 days)
      const dateFrom = new Date().toISOString().split('T')[0];
      const dateTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Call AI Assistant service
      const response = await aiAssistantService.sendMessage(
        user.id,
        inputMessage,
        {
          contextMode: 'overview',
          dateFrom,
          dateTo
        }
      );

      // Update KPIs
      setKpis(response.kpis);
      setSuggestedActions(response.actionsSuggested || []);

      // Add AI response to messages
      const aiMessage = {
        type: 'assistant',
        content: response.reply,
        timestamp: new Date(),
        kpis: response.kpis,
        actions: response.actionsSuggested
      };

      setMessages(prev => [...prev, aiMessage]);

      // Scroll to show the beginning of AI response after a delay
      setTimeout(() => {
        if (messagesContainerRef.current) {
          // Find the messages container div (space-y-4)
          const messagesDiv = messagesContainerRef.current.querySelector('.space-y-4');
          if (messagesDiv && messagesDiv.children.length > 0) {
            // Get the last actual message (not the loading indicator or ref div)
            const messageElements = Array.from(messagesDiv.children).filter(
              child => child.querySelector('.rounded-2xl') // Only actual message bubbles
            );
            const lastMessageElement = messageElements[messageElements.length - 1];
            if (lastMessageElement) {
              lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { full: "What's my occupancy rate?", short: "Occupancy?" },
    { full: "How much revenue this month?", short: "Revenue?" },
    { full: "Any check-ins today?", short: "Check-ins?" },
    { full: "Show me outstanding payments", short: "Payments?" }
  ];

  const handleQuickQuestion = async (question) => {
    setInputMessage(question);

    // Auto-send the message after a brief delay to show the question in the input
    setTimeout(async () => {
      if (!isLoading && user?.id) {
        const userMessage = {
          type: 'user',
          content: question,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
          const dateFrom = new Date().toISOString().split('T')[0];
          const dateTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          const response = await aiAssistantService.sendMessage(
            user.id,
            question,
            {
              contextMode: 'overview',
              dateFrom,
              dateTo
            }
          );

          const assistantMessage = {
            type: 'assistant',
            content: response.response || 'I apologize, but I encountered an error. Please try again.',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, assistantMessage]);

          if (response.kpis) {
            setKpis(response.kpis);
          }

          if (response.suggestedActions) {
            setSuggestedActions(response.suggestedActions);
          }
        } catch (error) {
          console.error('[AIAssistant] Error:', error);
          const errorMessage = {
            type: 'error',
            content: 'Sorry, I encountered an error processing your request. Please try again.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300);
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-1.5 lg:p-4 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="w-full relative z-10 flex flex-col h-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-0.5 lg:mb-3 shrink-0">
          <button
            onClick={onBack}
            className="p-1 lg:p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20"
          >
            <ChevronLeft className="w-3.5 h-3.5 lg:w-6 lg:h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-base lg:text-3xl lg:text-4xl font-black text-white drop-shadow-2xl">OSIRIS</h2>
          </div>
          <div className="w-6 lg:w-14"></div>
        </div>

        {/* KPI Summary (if available) */}
        {kpis && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 lg:gap-3 mb-0.5 lg:mb-2 shrink-0">
            <div className="bg-[#1f2937]/95 rounded-lg p-0.5 lg:p-3 border border-[#d85a2a]/20">
              <div className="flex items-center gap-0.5 lg:gap-2 mb-0 lg:mb-1">
                <TrendingUp className="w-2 h-2 lg:w-4 lg:h-4 text-[#FF8C42]" />
                <p className="text-[8px] lg:text-xs text-white/70">Occupancy</p>
              </div>
              <p className="text-[10px] lg:text-xl font-bold text-white">{kpis.occupancy}%</p>
            </div>
            <div className="bg-[#1f2937]/95 rounded-lg p-0.5 lg:p-3 border border-[#d85a2a]/20">
              <div className="flex items-center gap-0.5 lg:gap-2 mb-0 lg:mb-1">
                <DollarSign className="w-2 h-2 lg:w-4 lg:h-4 text-[#10b981]" />
                <p className="text-[8px] lg:text-xs text-white/70">Revenue</p>
              </div>
              <p className="text-[10px] lg:text-xl font-bold text-white">${kpis.revenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-[#1f2937]/95 rounded-lg p-0.5 lg:p-3 border border-[#d85a2a]/20">
              <div className="flex items-center gap-0.5 lg:gap-2 mb-0 lg:mb-1">
                <Calendar className="w-2 h-2 lg:w-4 lg:h-4 text-[#3b82f6]" />
                <p className="text-[8px] lg:text-xs text-white/70">Check-ins</p>
              </div>
              <p className="text-[10px] lg:text-xl font-bold text-white">{kpis.upcomingCheckIns || 0}</p>
            </div>
            <div className="bg-[#1f2937]/95 rounded-lg p-0.5 lg:p-3 border border-[#d85a2a]/20">
              <div className="flex items-center gap-0.5 lg:gap-2 mb-0 lg:mb-1">
                <AlertCircle className="w-2 h-2 lg:w-4 lg:h-4 text-[#f59e0b]" />
                <p className="text-[8px] lg:text-xs text-white/70">Alerts</p>
              </div>
              <p className="text-[10px] lg:text-xl font-bold text-white">{kpis.alertsCount || 0}</p>
            </div>
          </div>
        )}

        {/* Chat Messages Container - Hidden on mobile if only greeting */}
        {(messages.length > 1 || window.innerWidth >= 1024) && (
        <div ref={messagesContainerRef} className="flex-1 lg:flex-auto bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 p-2 lg:p-6 mb-1 lg:mb-4 overflow-y-auto min-h-[60px] max-h-[8vh] lg:max-h-none">
          <div className="space-y-1 lg:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${index === 0 && messages.length === 1 ? 'hidden lg:flex' : 'flex'} ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-2 py-1 lg:px-4 lg:py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white'
                      : message.type === 'error'
                      ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                      : 'bg-[#2a2f3a] text-white border border-[#d85a2a]/30'
                  }`}
                >
                  <div className="flex items-start gap-1 lg:gap-2">
                    {message.type === 'assistant' && (
                      <Sparkles className="w-3 h-3 lg:w-5 lg:h-5 mt-0.5 flex-shrink-0 text-[#FF8C42]" />
                    )}
                    <p className="text-xs lg:text-sm whitespace-pre-wrap leading-tight lg:leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-[10px] lg:text-xs opacity-60 mt-0.5 lg:mt-2">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2f3a] text-white border border-[#d85a2a]/30 rounded-xl px-2 py-1 lg:px-4 lg:py-3">
                  <div className="flex items-center gap-1 lg:gap-2">
                    <Loader2 className="w-3 h-3 lg:w-5 lg:h-5 animate-spin text-[#FF8C42]" />
                    <p className="text-xs lg:text-sm">Analyzing...</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
        )}

        {/* Quick Questions - Only show 2 on mobile for space */}
        {messages.length <= 1 && (
          <div className="mb-1 lg:mb-4 shrink-0">
            <p className="text-[10px] lg:text-sm text-white/70 mb-0.5 lg:mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-1.5 lg:gap-2">
              {quickQuestions.slice(0, window.innerWidth < 1024 ? 2 : 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question.full)}
                  className="px-2 lg:px-3 py-1 lg:py-2 bg-[#1f2937]/95 border border-[#d85a2a]/20 rounded-lg text-xs lg:text-sm text-white/90 hover:bg-[#d85a2a]/20 transition-colors whitespace-nowrap"
                >
                  <span className="lg:hidden">{question.short}</span>
                  <span className="hidden lg:inline">{question.full}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Actions (if available) */}
        {suggestedActions.length > 0 && (
          <div className="mb-2 lg:mb-4 shrink-0">
            <p className="text-sm font-semibold text-[#FF8C42] mb-2">💡 Suggested Actions:</p>
            <div className="space-y-2">
              {suggestedActions.map((action, index) => (
                <div
                  key={index}
                  className="bg-[#1f2937]/95 rounded-lg p-3 border border-[#d85a2a]/20 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">{action.title}</p>
                    <p className="text-xs text-white/70">{action.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    action.priority === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : action.priority === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {action.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-[#d85a2a]/20 p-1.5 lg:p-4 shrink-0">
          <div className="flex gap-1 lg:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask OSIRIS..."
              disabled={isLoading}
              className="flex-1 bg-[#2a2f3a] text-white placeholder-white/50 rounded-xl px-2 lg:px-4 py-1.5 lg:py-3 text-xs lg:text-base border border-[#d85a2a]/30 focus:border-[#FF8C42] focus:outline-none focus:ring-2 focus:ring-[#FF8C42]/20 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-2 lg:px-6 py-1.5 lg:py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 lg:gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
