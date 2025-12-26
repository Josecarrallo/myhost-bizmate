import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Mail,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { communicationsService } from '../../services/communicationsService';

const SendCommunicationModal = ({ guest, channel, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [templateKey, setTemplateKey] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const templates = communicationsService.getAvailableTemplates();

  // Template variables for replacement
  const templateVariables = {
    guestName: guest.name,
    propertyName: 'Your Property', // TODO: Get from context
    checkinDate: guest.lastBooking || 'TBD',
    checkoutDate: 'TBD',
    bookingId: '12345',
    amountDue: '$500',
    propertyAddress: '123 Main St, Bali'
  };

  useEffect(() => {
    if (templateKey) {
      const template = communicationsService.getTemplate(templateKey, templateVariables);
      setSubject(template.subject);
      setMessage(template.body);
    }
  }, [templateKey]);

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (channel === 'email' && !subject.trim()) {
      setError('Subject cannot be empty for emails');
      return;
    }

    setSending(true);
    setError('');

    try {
      await communicationsService.sendCommunication({
        tenantId: user.id,
        propertyId: null, // TODO: Get from context
        guestId: guest.id,
        bookingId: null, // TODO: Get if applicable
        channel,
        templateKey: templateKey || null,
        subject: channel === 'email' ? subject : null,
        message,
        recipientEmail: channel === 'email' ? guest.email : null,
        recipientPhone: channel === 'whatsapp' ? guest.phone : null
      });

      onSuccess();
    } catch (err) {
      console.error('Error sending communication:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 ${channel === 'email' ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-green-400 to-green-500'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {channel === 'email' ? (
                <Mail className="w-6 h-6 text-white" />
              ) : (
                <MessageSquare className="w-6 h-6 text-white" />
              )}
              <h3 className="text-xl font-bold text-white">
                Send {channel === 'email' ? 'Email' : 'WhatsApp Message'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Recipient */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700">
              {channel === 'email' ? guest.email : guest.phone}
            </div>
          </div>

          {/* Template Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template (Optional)
            </label>
            <select
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Custom Message</option>
              {templates.map((template) => (
                <option key={template.key} value={template.key}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject (Email only) */}
          {channel === 'email' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={10}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {message.length} characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={sending}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className={`flex-1 px-6 py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
              channel === 'email'
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:opacity-90'
                : 'bg-gradient-to-r from-green-400 to-green-500 hover:opacity-90'
            }`}
          >
            {sending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendCommunicationModal;
