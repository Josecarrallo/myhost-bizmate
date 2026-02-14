import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * ConnectionStatusBox
 * Shows connection status for WhatsApp and Email
 */
const ConnectionStatusBox = ({ whatsappStatus, emailStatus }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (connected, status) => {
    if (!connected) return 'Not connected';
    switch (status) {
      case 'ok':
        return 'Connected';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (connected, status) => {
    if (!connected) return 'bg-gray-500/20 border-gray-500/30';
    switch (status) {
      case 'ok':
        return 'bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="flex gap-3">
      {/* WhatsApp Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(whatsappStatus.connected, whatsappStatus.status)}`}>
        {getStatusIcon(whatsappStatus.status)}
        <div className="flex flex-col">
          <span className="text-white/60 text-xs">WhatsApp</span>
          <span className="text-white text-sm font-medium">
            {getStatusText(whatsappStatus.connected, whatsappStatus.status)}
          </span>
        </div>
      </div>

      {/* Email Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(emailStatus.connected, emailStatus.status)}`}>
        {getStatusIcon(emailStatus.status)}
        <div className="flex flex-col">
          <span className="text-white/60 text-xs">Email</span>
          <span className="text-white text-sm font-medium">
            {getStatusText(emailStatus.connected, emailStatus.status)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatusBox;
