import React, { useState } from 'react';
import { LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone, ClipboardList, User, ThumbsDown } from 'lucide-react';

const AITripPlanner = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedDay, setExpandedDay] = useState(null);

  const categories = [
    { id: 'all', name: 'All', icon: Compass },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'culture', name: 'Culture', icon: Camera },
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'beach', name: 'Beach', icon: Waves }
  ];

  const itinerary = [
    {
      day: 1,
      title: "Arrival & Beach Sunset",
      activities: [
        { time: "14:00", name: "Check-in at Villa Sunset", category: "lodging", icon: Home },
        { time: "16:00", name: "Seminyak Beach Walk", category: "beach", icon: Waves },
        { time: "18:00", name: "Sunset at La Plancha", category: "food", icon: Sun },
        { time: "20:00", name: "Dinner at Motel Mexicola", category: "food", icon: Utensils }
      ]
    },
    {
      day: 2,
      title: "Ubud Cultural Experience",
      activities: [
        { time: "08:00", name: "Breakfast at villa", category: "food", icon: Coffee },
        { time: "09:30", name: "Tegalalang Rice Terraces", category: "nature", icon: Leaf },
        { time: "12:00", name: "Lunch at Sari Organik", category: "food", icon: Utensils },
        { time: "14:00", name: "Sacred Monkey Forest", category: "nature", icon: Leaf },
        { time: "16:00", name: "Ubud Traditional Market", category: "culture", icon: Camera },
        { time: "19:00", name: "Dinner at Locavore", category: "food", icon: Utensils }
      ]
    },
    {
      day: 3,
      title: "Adventure Day",
      activities: [
        { time: "06:00", name: "Mount Batur Sunrise Trek", category: "adventure", icon: Mountain },
        { time: "12:00", name: "Coffee Plantation Tour", category: "culture", icon: Coffee },
        { time: "15:00", name: "Tirta Empul Holy Spring", category: "culture", icon: Waves },
        { time: "18:00", name: "Return to villa", category: "lodging", icon: Home },
        { time: "20:00", name: "Private villa dinner", category: "food", icon: Utensils }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">AI Trip Planner</h2>
          <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-colors">
            <Sparkles className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 rounded-3xl mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Compass className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-2">Your Personalized Bali Adventure</h3>
              <p className="text-white/90 mb-4">3-day curated itinerary based on your preferences</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">🏖️ Beach Lover</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">🍜 Foodie</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">🏔️ Adventure Seeker</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 transition-all">
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <span className="text-2xl font-black">D{day.day}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-gray-900 mb-1">{day.title}</h3>
                    <p className="text-sm text-gray-600">{day.activities.length} activities planned</p>
                  </div>
                </div>
                {expandedDay === day.day ? <ChevronUp className="w-6 h-6 text-gray-600" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
              </button>
              
              {expandedDay === day.day && (
                <div className="px-6 pb-6 space-y-3">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="text-sm font-bold text-gray-900">{activity.time}</div>
                      </div>
                      <div className="flex-shrink-0 p-3 bg-white rounded-xl">
                        <activity.icon className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{activity.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">{activity.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <h4 className="text-lg font-black">AI Recommendations</h4>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Book Mount Batur trek in advance - limited spots available</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Bring reef-safe sunscreen for beach activities</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Reserve dinner at Locavore at least 2 weeks ahead</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AITripPlanner;
