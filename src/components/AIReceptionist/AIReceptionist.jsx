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

const AIReceptionist = ({ onBack }) => {
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
    <div className="flex-1 h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 p-4 relative overflow-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <ChevronLeft className="w-6 h-6 text-purple-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">AI Receptionist</h2>
            <p className="text-white/90 text-lg mt-2">Monitoreo en tiempo real</p>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* WhatsApp AI Agent Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">WhatsApp AI Agent</h3>
                  <p className="text-sm text-gray-500">Workflow VIII</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${whatsappStats.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-3 h-3 rounded-full ${whatsappStats.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-bold ${whatsappStats.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                  {whatsappStats.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Mensajes Hoy</span>
                </div>
                <p className="text-3xl font-black text-blue-900">{whatsappStats.todayMessages}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Resp. Media</span>
                </div>
                <p className="text-3xl font-black text-purple-900">{whatsappStats.avgResponseTime}</p>
              </div>
            </div>

            <button
              onClick={() => toggleWorkflow(WORKFLOW_VIII_ID, whatsappStats.status === 'active')}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                whatsappStats.status === 'active'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {whatsappStats.status === 'active' ? 'Desactivar' : 'Activar'}
            </button>
          </div>

          {/* Vapi Voice AI Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Vapi Voice AI</h3>
                  <p className="text-sm text-gray-500">Workflow IX</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${vapiStats.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-3 h-3 rounded-full ${vapiStats.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-bold ${vapiStats.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                  {vapiStats.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Llamadas Hoy</span>
                </div>
                <p className="text-3xl font-black text-green-900">{vapiStats.todayCalls}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">Duración Media</span>
                </div>
                <p className="text-3xl font-black text-amber-900">{vapiStats.avgDuration}</p>
              </div>
            </div>

            <button
              onClick={() => toggleWorkflow(WORKFLOW_IX_ID, vapiStats.status === 'active')}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                vapiStats.status === 'active'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {vapiStats.status === 'active' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-800">Últimas Conversaciones</h3>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando...</p>
            </div>
          ) : recentConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay conversaciones hoy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => (
                <div key={conv.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${conv.type === 'whatsapp' ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {conv.type === 'whatsapp' ? (
                          <MessageCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Phone className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {conv.type === 'whatsapp' ? 'WhatsApp' : 'Vapi Voice'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {conv.time.toLocaleTimeString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{conv.duration}s</span>
                      {conv.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
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

export default AIReceptionist;
