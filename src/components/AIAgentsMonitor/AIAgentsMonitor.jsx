import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  MessageCircle,
  Phone,
  Activity,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const AIAgentsMonitor = ({ onBack }) => {
  const [whatsappStats, setWhatsappStats] = useState({
    status: 'active',
    todayMessages: 0,
    avgResponseTime: '0s',
    satisfaction: 0
  });

  const [vapiStats, setVapiStats] = useState({
    status: 'active',
    todayCalls: 0,
    avgDuration: '0m',
    satisfaction: 0
  });

  const [recentConversations, setRecentConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // API key de n8n (ya la tenemos)
  const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMmNkZWVjOC0xM2U0LTQzYTQtODAzYS0zOTU2NmIzYzRiNDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2MDIzNzU5LCJleHAiOjE3Njg1Mzk2MDB9.s0mDKR4mZ4z_3ErMmmij1Lx-HYoU3Y6uqu_JWvb18S0';
  const N8N_URL = 'https://n8n-production-bb2d.up.railway.app';

  // IDs de los workflows
  const WORKFLOW_VIII_ID = 'ln2myAS3406D6F8W'; // WhatsApp
  const WORKFLOW_IX_ID = '3sU4RgV892az8nLZ'; // Vapi

  useEffect(() => {
    fetchWorkflowsData();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchWorkflowsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkflowsData = async () => {
    try {
      // Obtener datos de ambos workflows
      const [whatsappData, vapiData] = await Promise.all([
        fetch(`${N8N_URL}/api/v1/workflows/${WORKFLOW_VIII_ID}`, {
          headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        }).then(r => r.json()),
        fetch(`${N8N_URL}/api/v1/workflows/${WORKFLOW_IX_ID}`, {
          headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        }).then(r => r.json())
      ]);

      // Obtener executions de ambos workflows
      const [whatsappExecs, vapiExecs] = await Promise.all([
        fetch(`${N8N_URL}/api/v1/executions?workflowId=${WORKFLOW_VIII_ID}&limit=100`, {
          headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        }).then(r => r.json()),
        fetch(`${N8N_URL}/api/v1/executions?workflowId=${WORKFLOW_IX_ID}&limit=100`, {
          headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        }).then(r => r.json())
      ]);

      // Calcular estadísticas
      const today = new Date().toDateString();

      // WhatsApp stats
      const whatsappTodayExecs = whatsappExecs.data?.filter(e =>
        new Date(e.startedAt).toDateString() === today
      ) || [];

      setWhatsappStats({
        status: whatsappData.active ? 'active' : 'inactive',
        todayMessages: whatsappTodayExecs.length,
        avgResponseTime: calculateAvgTime(whatsappTodayExecs),
        satisfaction: 95 // Mock - calcular real basado en handoffs
      });

      // Vapi stats
      const vapiTodayExecs = vapiExecs.data?.filter(e =>
        new Date(e.startedAt).toDateString() === today
      ) || [];

      setVapiStats({
        status: vapiData.active ? 'active' : 'inactive',
        todayCalls: vapiTodayExecs.length,
        avgDuration: calculateAvgDuration(vapiTodayExecs),
        satisfaction: 92 // Mock
      });

      // Combinar y ordenar conversaciones
      const allConversations = [
        ...whatsappTodayExecs.map(e => ({
          id: e.id,
          type: 'whatsapp',
          time: new Date(e.startedAt),
          status: e.status,
          duration: e.stoppedAt ? Math.round((new Date(e.stoppedAt) - new Date(e.startedAt)) / 1000) : 0
        })),
        ...vapiTodayExecs.map(e => ({
          id: e.id,
          type: 'vapi',
          time: new Date(e.startedAt),
          status: e.status,
          duration: e.stoppedAt ? Math.round((new Date(e.stoppedAt) - new Date(e.startedAt)) / 1000) : 0
        }))
      ].sort((a, b) => b.time - a.time).slice(0, 10);

      setRecentConversations(allConversations);
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching workflows data:', error);
      setIsLoading(false);
    }
  };

  const calculateAvgTime = (executions) => {
    if (!executions.length) return '0s';
    const avgMs = executions.reduce((sum, e) => {
      if (e.stoppedAt) {
        return sum + (new Date(e.stoppedAt) - new Date(e.startedAt));
      }
      return sum;
    }, 0) / executions.length;
    return `${Math.round(avgMs / 1000)}s`;
  };

  const calculateAvgDuration = (executions) => {
    if (!executions.length) return '0m';
    const avgMs = executions.reduce((sum, e) => {
      if (e.stoppedAt) {
        return sum + (new Date(e.stoppedAt) - new Date(e.startedAt));
      }
      return sum;
    }, 0) / executions.length;
    return `${Math.round(avgMs / 60000)}m`;
  };

  const toggleWorkflow = async (workflowId, currentStatus) => {
    try {
      await fetch(`${N8N_URL}/api/v1/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          active: !currentStatus
        })
      });
      // Refrescar datos
      fetchWorkflowsData();
    } catch (error) {
      console.error('Error toggling workflow:', error);
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 sm:p-6 lg:p-8 pb-24 relative overflow-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button onClick={onBack} className="lg:hidden self-start p-2 sm:p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl">AI Agents Monitor</h2>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">Real-time monitoring - WhatsApp & Voice AI</p>
          </div>
          <div className="w-12 hidden lg:block"></div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* WhatsApp AI Agent Card */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-[#FF8C42]">WhatsApp AI</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Workflow VIII</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${whatsappStats.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-3 h-3 rounded-full ${whatsappStats.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-bold ${whatsappStats.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                  {whatsappStats.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C42]" />
                  <span className="text-xs sm:text-sm font-medium text-orange-700">Mensajes Hoy</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-orange-900">{whatsappStats.todayMessages}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C42]" />
                  <span className="text-xs sm:text-sm font-medium text-orange-700">Resp. Media</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-orange-900">{whatsappStats.avgResponseTime}</p>
              </div>
            </div>

            <button
              onClick={() => toggleWorkflow(WORKFLOW_VIII_ID, whatsappStats.status === 'active')}
              className={`w-full py-3 rounded-2xl font-bold text-white transition-all shadow-md ${
                whatsappStats.status === 'active'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90'
              }`}
            >
              {whatsappStats.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
            </button>
          </div>

          {/* Vapi Voice AI Card */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-[#FF8C42]">Voice AI</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Workflow IX</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${vapiStats.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-3 h-3 rounded-full ${vapiStats.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-bold ${vapiStats.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                  {vapiStats.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C42]" />
                  <span className="text-xs sm:text-sm font-medium text-orange-700">Llamadas Hoy</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-orange-900">{vapiStats.todayCalls}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C42]" />
                  <span className="text-xs sm:text-sm font-medium text-orange-700">Duración Media</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-orange-900">{vapiStats.avgDuration}</p>
              </div>
            </div>

            <button
              onClick={() => toggleWorkflow(WORKFLOW_IX_ID, vapiStats.status === 'active')}
              className={`w-full py-3 rounded-2xl font-bold text-white transition-all shadow-md ${
                vapiStats.status === 'active'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90'
              }`}
            >
              {vapiStats.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
            </button>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8C42]" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#FF8C42]">Recent Conversations</h3>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-[#FF8C42] font-medium mt-4">Loading conversations...</p>
            </div>
          ) : recentConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm sm:text-base">No conversations today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => (
                <div key={conv.id} className="bg-gradient-to-r from-orange-50/50 to-white rounded-xl p-3 sm:p-4 border-2 border-orange-100 hover:border-orange-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 rounded-lg ${conv.type === 'whatsapp' ? 'bg-orange-100 border-2 border-orange-300' : 'bg-orange-100 border-2 border-orange-400'}`}>
                        {conv.type === 'whatsapp' ? (
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C42]" />
                        ) : (
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-[#FF8C42]">
                          {conv.type === 'whatsapp' ? 'WhatsApp' : 'Voice Call'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {conv.time.toLocaleTimeString('en-US')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">{conv.duration}s</span>
                      {conv.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAgentsMonitor;
