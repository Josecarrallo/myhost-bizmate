import React from 'react';
import { ArrowLeft, FileText, Smile, DollarSign, AlertTriangle, Gift, Phone } from 'lucide-react';

const LeadsTemplates = ({ onBack }) => {
  const templates = [
    { name: 'Welcome Message', icon: Smile, color: 'from-green-400 to-green-600', example: '"Hello! Thanks for your interest in Villa Sunset Bali..."' },
    { name: 'Price Quote', icon: DollarSign, color: 'from-blue-400 to-blue-600', example: '"For your dates (May 15-20), the rate is $180/night..."' },
    { name: 'Availability Response', icon: Phone, color: 'from-purple-400 to-purple-600', example: '"Great news! Villa Sunset is available for your dates..."' },
    { name: 'Objection Handler', icon: AlertTriangle, color: 'from-yellow-400 to-yellow-600', example: '"I understand your concern. Let me explain..."' },
    { name: 'Upsell Offer', icon: Gift, color: 'from-orange-400 to-orange-600', example: '"Would you like to add airport transfer for $25?"' },
    { name: 'Booking Confirmation', icon: FileText, color: 'from-pink-400 to-pink-600', example: '"Booking confirmed! Here are your details..."' }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Message Templates
            </h1>
            <p className="text-sm text-orange-400">Powered by BANYU.AI</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <FileText className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Pre-Built Sales Templates</h3>
          <p className="text-gray-300 mb-4">Professional templates for every sales scenario</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.name} className={`bg-gradient-to-br ${template.color} rounded-xl p-6 text-white`}>
                <Icon className="w-10 h-10 mb-3" />
                <h4 className="font-bold mb-2">{template.name}</h4>
                <p className="text-sm opacity-90 italic">{template.example}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">Template Features:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✅ <strong>Dynamic Variables:</strong> Auto-fill guest name, property, dates, prices</li>
            <li>✅ <strong>Multi-Language:</strong> Templates available in English, Spanish, French, etc.</li>
            <li>✅ <strong>Tone Adjustment:</strong> Formal, friendly, or casual versions</li>
            <li>✅ <strong>A/B Testing:</strong> Test different templates to see what converts best</li>
            <li>✅ <strong>Custom Templates:</strong> Create your own templates for specific scenarios</li>
          </ul>
          <div className="mt-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
            <p className="text-sm font-bold mb-1">Pro Tip:</p>
            <p className="text-xs">BANYU.AI automatically selects the best template based on conversation context and lead intent.</p>
          </div>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Template editor with AI assistance</p>
        </div>
      </div>
    </div>
  );
};

export default LeadsTemplates;
