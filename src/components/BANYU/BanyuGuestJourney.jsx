import React from "react";
import { ArrowLeft, CalendarCheck, Send, Clock, CheckCircle, MessageSquare } from "lucide-react";

const BanyuGuestJourney = ({ onBack }) => {
  // Mock guest journey stages
  const journeyStages = [
    {
      id: 1,
      name: "Booking Confirmation",
      timing: "Immediate",
      message: "Thank you for booking! Here are your reservation details...",
      status: "active"
    },
    {
      id: 2,
      name: "Pre-Arrival (7 days before)",
      timing: "7 days before check-in",
      message: "We are excited to welcome you! Here is what to expect...",
      status: "active"
    },
    {
      id: 3,
      name: "Pre-Arrival (2 days before)",
      timing: "2 days before check-in",
      message: "Your stay is just around the corner! Preparation details...",
      status: "active"
    },
    {
      id: 4,
      name: "Check-in Day",
      timing: "Day of arrival",
      message: "Welcome to Izumi Hotel! Check-in instructions...",
      status: "active"
    },
    {
      id: 5,
      name: "During Stay",
      timing: "Daily at 10 AM",
      message: "Good morning! How can we make your day special?",
      status: "active"
    },
    {
      id: 6,
      name: "Check-out Day",
      timing: "Day of departure",
      message: "We hope you enjoyed your stay! Check-out details...",
      status: "active"
    },
    {
      id: 7,
      name: "Post-Stay Follow-up",
      timing: "3 days after check-out",
      message: "We would love to hear about your experience...",
      status: "active"
    }
  ];

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
                <CalendarCheck className="w-6 h-6" />
                Guest Journey
              </h1>
              <p className="text-sm text-orange-400">Powered by BANYU.AI</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74f24] hover:to-[#e09620] rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg">
            <MessageSquare className="w-5 h-5" />
            Configure Journey
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
        <h3 className="text-white font-semibold mb-2">Automated Guest Journey</h3>
        <p className="text-white/80 text-sm">
          BANYU.AI automatically sends personalized WhatsApp messages at key touchpoints throughout the guest journey.
          Messages are sent based on booking dates and guest preferences.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Journeys</p>
              <p className="text-3xl font-bold text-white">12</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Messages Sent (7d)</p>
              <p className="text-3xl font-bold text-white">84</p>
            </div>
            <div className="p-3 bg-[#d85a2a]/20 rounded-xl">
              <Send className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Response Rate</p>
              <p className="text-3xl font-bold text-white">87%</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg Response Time</p>
              <p className="text-3xl font-bold text-white">3m</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Journey Stages */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Journey Stages</h3>
        {journeyStages.map((stage, index) => (
          <div
            key={stage.id}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#d85a2a]/20 rounded-xl flex items-center justify-center">
                  <span className="text-orange-400 font-bold">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{stage.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {stage.timing}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                        {stage.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-colors">
                      Edit Message
                    </button>
                    <button className="px-4 py-2 bg-[#d85a2a]/20 hover:bg-[#d85a2a]/30 border border-[#d85a2a]/30 rounded-lg text-orange-400 text-sm transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white/80 text-sm">{stage.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-orange-400" />
          How Guest Journey Works
        </h3>
        <p className="text-white/80 text-sm mb-3">
          BANYU.AI automatically schedules and sends WhatsApp messages based on your guests booking timeline.
        </p>
        <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
          <li>Messages are personalized with guest names and booking details</li>
          <li>Timing is automatically calculated based on check-in/check-out dates</li>
          <li>Guests can reply and engage in conversation at any stage</li>
          <li>All interactions are logged and visible in the Inbox</li>
        </ul>
      </div>
    </div>
  );
};

export default BanyuGuestJourney;
