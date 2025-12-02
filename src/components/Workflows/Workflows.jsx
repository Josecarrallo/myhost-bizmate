import React from 'react';
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
  Percent
} from 'lucide-react';
import { StatCard, WorkflowCard } from '../common';

const WorkflowsAutomations = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Workflow} label="Active Workflows" value="12" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Zap} label="Tasks Automated" value="348" trend="+45%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Clock} label="Time Saved" value="24h" trend="+18%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CheckCircle} label="Success Rate" value="98%" gradient="from-orange-500 to-orange-600" />
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
        </div>
      </div>
    </div>
  );
};

export default WorkflowsAutomations;
