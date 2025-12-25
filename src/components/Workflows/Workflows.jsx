import React, { useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Workflow,
  Zap,
  Clock,
  CheckCircle,
  CalendarCheck,
  BellRing,
  Compass,
  Calendar,
  Percent,
  Star,
  TestTube
} from 'lucide-react';
import { StatCard, WorkflowCard } from '../common';

const WorkflowsAutomations = ({ onBack, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Workflows</h2>
          </div>
          <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <Plus className="w-5 h-5 inline mr-2" /> New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Workflow} label="Active Workflows" value="12" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Zap} label="Tasks Automated" value="348" trend="+45%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Clock} label="Time Saved" value="24h" trend="+18%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CheckCircle} label="Success Rate" value="98%" gradient="from-orange-500 to-orange-600" />
        </div>

        {/* Workflow Tester Button */}
        <div
          onClick={() => onNavigate('workflow-tester')}
          className="mb-8 cursor-pointer bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-[#d85a2a]/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#d85a2a]/10 backdrop-blur-sm p-3 rounded-2xl">
                  <TestTube className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white">Workflow Tester</h3>
                <span className="px-4 py-1 bg-green-400 text-green-900 rounded-full text-sm font-bold">LIVE</span>
              </div>
              <p className="text-white/90 text-lg ml-14">
                Test WhatsApp AI Agent (VIII) and Vapi Voice AI (IX) directly from the app
              </p>
              <div className="flex gap-4 mt-4 ml-14">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-sm font-medium">WhatsApp AI Ready</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-sm font-medium">Vapi Voice Ready</span>
                </div>
              </div>
            </div>
            <div className="text-white text-6xl font-black opacity-20">→</div>
          </div>
        </div>

        <div className="space-y-4">
          <WorkflowCard
            name="New Booking Welcome"
            trigger="When new booking is confirmed"
            actions={[
              "Send welcome email with property details",
              "Share check-in instructions and house rules",
              "Add guest to property calendar"
            ]}
            status="active"
            lastRun="15 min ago"
            runsToday={8}
            icon={CalendarCheck}
          />

          <WorkflowCard
            name="Guest Communication"
            trigger="24 hours before check-in"
            actions={[
              "Send reminder message to guest",
              "Verify arrival time",
              "Notify property manager"
            ]}
            status="active"
            lastRun="2 hours ago"
            runsToday={5}
            icon={BellRing}
          />

          <div
            onClick={() => onNavigate('trip-planner')}
            className="cursor-pointer"
          >
            <WorkflowCard
              name="AI Trip Planner"
              trigger="When guest requests local recommendations"
              actions={[
                "Analyze guest preferences and interests",
                "Generate personalized itinerary",
                "Share curated recommendations"
              ]}
              status="active"
              lastRun="45 min ago"
              runsToday={12}
              icon={Compass}
            />
          </div>

          <div
            onClick={() => onNavigate('bookings-workflow')}
            className="cursor-pointer"
          >
            <WorkflowCard
              name="Smart Booking Management"
              trigger="Continuous monitoring"
              actions={[
                "Track booking status changes",
                "Automate payment processing",
                "Sync calendar across platforms"
              ]}
              status="active"
              lastRun="5 min ago"
              runsToday={24}
              icon={Calendar}
            />
          </div>

          <WorkflowCard
            name="Dynamic Pricing Updates"
            trigger="Every 4 hours"
            actions={[
              "Analyze market demand",
              "Adjust property rates",
              "Update listings on all platforms"
            ]}
            status="active"
            lastRun="3 hours ago"
            runsToday={6}
            icon={Percent}
          />

          <WorkflowCard
            name="Review Collection & Response"
            trigger="After check-out"
            actions={[
              "Send review request email",
              "Monitor review submission",
              "Auto-respond with thank you message"
            ]}
            status="active"
            lastRun="1 hour ago"
            runsToday={3}
            icon={Star}
          />

          <WorkflowCard
            name="Maintenance Scheduling"
            trigger="After guest check-out"
            actions={[
              "Schedule professional cleaning",
              "Perform property inspection",
              "Restock amenities and supplies"
            ]}
            status="active"
            lastRun="30 min ago"
            runsToday={4}
            icon={CheckCircle}
          />

          <WorkflowCard
            name="Guest Follow-up & Upsell"
            trigger="7 days after check-out"
            actions={[
              "Send personalized thank you message",
              "Offer discount for next booking",
              "Request social media shares"
            ]}
            status="active"
            lastRun="4 hours ago"
            runsToday={2}
            icon={BellRing}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowsAutomations;
