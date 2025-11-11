import React, { useState } from 'react';
import { LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone, ClipboardList, User, ThumbsDown } from 'lucide-react';
import { StatCard, WorkflowCard } from '../components/common/Cards';

const WorkflowsAutomations = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Workflows & Automations</h2>
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Workflow} label="Active Workflows" value="12" gradient="from-indigo-500 to-purple-600" />
          <StatCard icon={Zap} label="Tasks Automated" value="348" trend="+45%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={Clock} label="Time Saved" value="24h" trend="+18%" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={CheckCircle} label="Success Rate" value="98%" gradient="from-purple-500 to-pink-600" />
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
