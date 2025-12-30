import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, CheckCircle } from 'lucide-react';
import guestCommunicationsService from '../../services/guestCommunicationsService';

const WhatsAppExamples = ({ onBack }) => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    const result = await guestCommunicationsService.getWhatsAppExamples();
    if (result.success) {
      setExamples(result.data);
    }
    setLoading(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <div className="text-white/60">Loading examples...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">WhatsApp Message Examples</h2>
        <p className="text-white/70 text-lg">Real examples of automated WhatsApp messages you can send</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {examples.map((example) => (
          <div key={example.id} className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{example.title}</h3>
                  <p className="text-white/60 text-sm">{example.use_case}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp-style message bubble */}
            <div className="bg-[#1a1f2e] rounded-2xl rounded-tl-none p-4 mb-3">
              <pre className="text-white/90 text-sm whitespace-pre-wrap font-sans">
                {example.message}
              </pre>
            </div>

            {/* Copy button */}
            <button
              onClick={() => copyToClipboard(example.message, example.id)}
              className="w-full bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              {copiedId === example.id ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy message
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsAppExamples;
