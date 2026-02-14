import React, { useState, useEffect } from 'react';
import { Mail, Copy, CheckCircle, Tag } from 'lucide-react';
import guestCommunicationsService from '../../services/guestCommunicationsService';

const EmailExamples = ({ onBack }) => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    const result = await guestCommunicationsService.getEmailExamples();
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
        <h2 className="text-white text-3xl font-bold mb-2">Email Campaign Examples</h2>
        <p className="text-white/70 text-lg">Templates for booking confirmations, campaigns, and follow-ups</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {examples.map((example) => (
          <div key={example.id} className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{example.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      example.type === 'transactional'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      <Tag className="w-3 h-3 inline mr-1" />
                      {example.type}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">{example.use_case}</p>
                </div>
              </div>
            </div>

            {/* Email preview */}
            <div className="bg-[#1a1f2e] rounded-lg p-5 mb-3 space-y-4">
              {/* Subject line */}
              <div className="border-b border-white/10 pb-3">
                <p className="text-white/60 text-xs mb-1">SUBJECT:</p>
                <p className="text-white font-medium">{example.subject}</p>
              </div>

              {/* Body preview */}
              <div>
                <p className="text-white/60 text-xs mb-2">BODY:</p>
                <div className="bg-white/5 rounded p-4 max-h-64 overflow-y-auto">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {example.body}
                  </pre>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(example.body, example.id)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                {copiedId === example.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy email body
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailExamples;
