import React, { useState } from 'react';
import { ArrowLeft, FileText, Plus, Edit, Copy, Play } from 'lucide-react';

const KoraScripts = ({ onBack }) => {
  // Mock scripts library
  const scripts = [
    {
      id: '1',
      name: 'Welcome Greeting',
      type: 'greeting',
      content: `Hello! Thank you for calling Izumi Hotel. This is KORA, your AI voice concierge. I'm here to help you 24/7.

How may I assist you today? I can help with:
- Checking villa availability
- Answering questions about our property
- Booking assistance
- General inquiries

If you need to speak with our reception team, they are available from 8 AM to 8 PM Bali time.`,
      variables: [],
      last_updated: '2026-01-10'
    },
    {
      id: '2',
      name: 'Availability Check',
      type: 'booking',
      content: `I'd be happy to check availability for you!

Could you please tell me:
1. Your preferred check-in date?
2. Your check-out date?
3. How many guests will be staying?

Once I have this information, I'll check our availability and provide you with options and pricing.`,
      variables: ['{{check_in}}', '{{check_out}}', '{{guests}}'],
      last_updated: '2026-01-10'
    },
    {
      id: '3',
      name: 'Objection Handling - Price',
      type: 'objection',
      content: `I understand price is an important consideration. Let me explain what makes Izumi Hotel special:

Our luxury villas include:
- Private infinity pools with jungle views
- Daily breakfast prepared by our chef
- Premium amenities and eco-friendly design
- Personalized concierge service
- Complimentary airport transfer (for stays 3+ nights)

We also offer:
- Early booking discounts (15% off for bookings 60+ days in advance)
- Extended stay promotions
- Honeymoon and special occasion packages

Would you like me to check if any of our current promotions apply to your dates?`,
      variables: ['{{promotion_available}}'],
      last_updated: '2026-01-09'
    },
    {
      id: '4',
      name: 'Outside Hours Handoff',
      type: 'handoff',
      content: `Thank you for your inquiry! I've recorded all the details you've shared.

Our reception team is currently offline (available 8 AM - 8 PM Bali time), but I'll make sure they receive your request first thing in the morning.

You can expect:
- A personalized email response within 12 hours
- A WhatsApp message with your inquiry summary
- Direct contact from our team to answer any additional questions

Is there a preferred method for our team to reach you - email or WhatsApp?`,
      variables: ['{{contact_method}}', '{{inquiry_summary}}'],
      last_updated: '2026-01-08'
    },
    {
      id: '5',
      name: 'Complaint Acknowledgment',
      type: 'complaint',
      content: `I'm very sorry to hear about this issue. Your satisfaction is extremely important to us.

I'm immediately escalating your concern to our management team. Here's what will happen next:

1. Our manager will be notified within the next 5 minutes
2. You'll receive a call back within 1 hour to address your concern
3. We'll follow up via email with our resolution plan

May I have your name and the best contact number to reach you?

Your feedback helps us improve, and we're committed to making this right.`,
      variables: ['{{guest_name}}', '{{contact_number}}', '{{issue_type}}'],
      last_updated: '2026-01-11'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'greeting': return 'bg-blue-500/20 text-blue-300';
      case 'booking': return 'bg-purple-500/20 text-purple-300';
      case 'objection': return 'bg-orange-500/20 text-orange-300';
      case 'handoff': return 'bg-green-500/20 text-green-300';
      case 'complaint': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Script copied to clipboard!');
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-6 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Scripts & Prompts
              </h1>
              <p className="text-sm text-orange-400">Powered by KORA.AI</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74f24] hover:to-[#e09620] rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg">
            <Plus className="w-5 h-5" />
            New Script
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Total Scripts</p>
          <p className="text-3xl font-bold text-white">{scripts.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Greeting</p>
          <p className="text-3xl font-bold text-orange-400">{scripts.filter(s => s.type === 'greeting').length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Booking</p>
          <p className="text-3xl font-bold text-orange-400">{scripts.filter(s => s.type === 'booking').length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Objection</p>
          <p className="text-3xl font-bold text-orange-400">{scripts.filter(s => s.type === 'objection').length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Complaint</p>
          <p className="text-3xl font-bold text-red-300">{scripts.filter(s => s.type === 'complaint').length}</p>
        </div>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d85a2a]/20 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{script.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(script.type)}`}>
                      {script.type}
                    </span>
                    <span className="text-white/40 text-xs">Updated: {script.last_updated}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(script.content)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy script"
                >
                  <Copy className="w-5 h-5 text-white/60" />
                </button>
                <button
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit script"
                >
                  <Edit className="w-5 h-5 text-white/60" />
                </button>
                <button
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                  title="Test with AI"
                >
                  <Play className="w-5 h-5 text-green-300" />
                </button>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4 mb-4">
              <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">
                {script.content}
              </pre>
            </div>

            {script.variables.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/60 text-sm">Variables:</span>
                {script.variables.map((variable, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-mono"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-400" />
          How Scripts Work
        </h3>
        <p className="text-white/80 text-sm mb-3">
          These scripts guide KORA.AI during voice calls. The AI uses them as a framework but adapts based on the conversation context.
        </p>
        <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
          <li>Scripts are triggered based on caller intent and conversation flow</li>
          <li>Variables are automatically filled with caller-specific information</li>
          <li>AI can combine multiple scripts within a single call</li>
          <li>All conversations are logged and can be reviewed for quality assurance</li>
        </ul>
      </div>
    </div>
  );
};

export default KoraScripts;
