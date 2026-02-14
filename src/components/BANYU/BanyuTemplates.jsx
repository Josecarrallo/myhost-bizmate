import React, { useState } from "react";
import { ArrowLeft, FileText, Plus, Edit, Copy, CheckCircle } from "lucide-react";

const BanyuTemplates = ({ onBack }) => {
  const [copiedId, setCopiedId] = useState(null);

  // Mock WhatsApp message templates
  const templates = [
    {
      id: "1",
      name: "Booking Confirmation",
      category: "Confirmation",
      language: "English",
      content: `✅ *Booking Confirmed!*

Dear {{guest_name}},

Your reservation at *Izumi Hotel* is confirmed!

📅 Check-in: {{check_in_date}}
📅 Check-out: {{check_out_date}}
🏡 Villa: {{villa_name}}
👥 Guests: {{num_guests}}

💰 Total: {{total_price}}

We are excited to welcome you! If you have any questions, feel free to reply to this message.

🌴 Izumi Hotel Team`,
      variables: ["{{guest_name}}", "{{check_in_date}}", "{{check_out_date}}", "{{villa_name}}", "{{num_guests}}", "{{total_price}}"],
      status: "active",
      last_used: "2 hours ago"
    },
    {
      id: "2",
      name: "Pre-Arrival Instructions",
      category: "Pre-Arrival",
      language: "English",
      content: `🌅 *Welcome to Bali, {{guest_name}}!*

Your stay begins in *2 days*! Here is what you need to know:

✈️ *Airport Transfer*
We offer complimentary pickup service. Please share your flight details.

🕐 *Check-in Time*
Standard check-in: 2:00 PM
Early check-in may be available (subject to availability)

📍 *Location*
Izumi Hotel, Ubud
Google Maps: {{maps_link}}

📱 Questions? Just reply to this message!

See you soon! 🌴`,
      variables: ["{{guest_name}}", "{{maps_link}}"],
      status: "active",
      last_used: "5 hours ago"
    },
    {
      id: "3",
      name: "FAQ - Availability Check",
      category: "FAQ",
      language: "English",
      content: `Hello! 👋

I would be happy to check availability for you.

Please share:
📅 Check-in date
📅 Check-out date
👥 Number of guests

I will get back to you right away with options and pricing!`,
      variables: [],
      status: "active",
      last_used: "1 day ago"
    },
    {
      id: "4",
      name: "Payment Reminder",
      category: "Payment",
      language: "English",
      content: `💰 *Payment Reminder*

Hi {{guest_name}},

Friendly reminder about your upcoming payment:

Amount due: {{amount_due}}
Due date: {{due_date}}

You can pay via:
💳 Bank transfer
💳 Credit card (link below)

Payment link: {{payment_link}}

Questions? Reply to this message!`,
      variables: ["{{guest_name}}", "{{amount_due}}", "{{due_date}}", "{{payment_link}}"],
      status: "active",
      last_used: "3 hours ago"
    },
    {
      id: "5",
      name: "Check-out Thank You",
      category: "Post-Stay",
      language: "English",
      content: `🙏 *Thank you, {{guest_name}}!*

We hope you enjoyed your stay at Izumi Hotel!

It would mean a lot if you could share your experience:
⭐ Leave a review: {{review_link}}

We would love to welcome you back to Bali soon! 🌴

Stay in touch,
Izumi Hotel Team`,
      variables: ["{{guest_name}}", "{{review_link}}"],
      status: "active",
      last_used: "Yesterday"
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case "Confirmation": return "bg-green-500/20 text-green-300";
      case "Pre-Arrival": return "bg-blue-500/20 text-blue-300";
      case "FAQ": return "bg-purple-500/20 text-purple-300";
      case "Payment": return "bg-orange-500/20 text-orange-300";
      case "Post-Stay": return "bg-pink-500/20 text-pink-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
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
                Message Templates
              </h1>
              <p className="text-sm text-orange-400">Powered by BANYU.AI</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74f24] hover:to-[#e09620] rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg">
            <Plus className="w-5 h-5" />
            New Template
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Total Templates</p>
          <p className="text-3xl font-bold text-white">{templates.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Confirmation</p>
          <p className="text-3xl font-bold text-green-300">{templates.filter(t => t.category === "Confirmation").length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Pre-Arrival</p>
          <p className="text-3xl font-bold text-blue-300">{templates.filter(t => t.category === "Pre-Arrival").length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">FAQ</p>
          <p className="text-3xl font-bold text-purple-300">{templates.filter(t => t.category === "FAQ").length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-orange-400">{templates.filter(t => t.status === "active").length}</p>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d85a2a]/20 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-xs font-medium">
                      {template.language}
                    </span>
                    <span className="text-white/40 text-xs">Last used: {template.last_used}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(template.id, template.content)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors relative"
                  title="Copy template"
                >
                  {copiedId === template.id ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/60" />
                  )}
                </button>
                <button
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit template"
                >
                  <Edit className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4 mb-4">
              <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">
                {template.content}
              </pre>
            </div>

            {template.variables.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/60 text-sm">Variables:</span>
                {template.variables.map((variable, idx) => (
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
          How Templates Work
        </h3>
        <p className="text-white/80 text-sm mb-3">
          Templates allow you to create reusable WhatsApp messages with dynamic variables that auto-fill with guest data.
        </p>
        <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
          <li>Variables like {"{guest_name}"} are automatically replaced with actual guest information</li>
          <li>Templates can be used in automated guest journeys or sent manually</li>
          <li>BANYU.AI uses natural language processing to adapt templates to conversation context</li>
          <li>All templates support emojis and WhatsApp formatting (bold, italic)</li>
        </ul>
      </div>
    </div>
  );
};

export default BanyuTemplates;
