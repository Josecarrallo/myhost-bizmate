import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Users,
  Tag,
  TrendingUp,
  DollarSign,
  Star,
  RefreshCw,
  Plus,
  Eye,
  Search,
  Filter,
  Target,
  CheckCircle
} from 'lucide-react';
import { guestSegmentationService } from '../../services/guestSegmentationService';

const GuestSegmentation = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, segments, tags
  const [tagStats, setTagStats] = useState({});
  const [segments, setSegments] = useState([]);
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [autoTagResult, setAutoTagResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load tag statistics
      const stats = await guestSegmentationService.getTagStatistics();
      setTagStats(stats);

      // Load segments (hardcoded tenant for now)
      const tenantId = localStorage.getItem('user_id') || 'demo-tenant';
      const segs = await guestSegmentationService.getSegments(tenantId);
      setSegments(segs);
    } catch (error) {
      console.error('Error loading segmentation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTagAll = async () => {
    setIsAutoTagging(true);
    setAutoTagResult(null);

    try {
      const tenantId = localStorage.getItem('user_id') || 'demo-tenant';
      const result = await guestSegmentationService.autoTagAllGuests(tenantId);
      setAutoTagResult(result);

      // Reload tag statistics
      const stats = await guestSegmentationService.getTagStatistics();
      setTagStats(stats);
    } catch (error) {
      console.error('Error auto-tagging guests:', error);
      setAutoTagResult({
        success: false,
        error: 'Failed to auto-tag guests'
      });
    } finally {
      setIsAutoTagging(false);
    }
  };

  // Tag configurations for display
  const tagConfig = {
    'VIP': { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '👑' },
    'High Value': { color: 'bg-green-100 text-green-700 border-green-300', icon: '💰' },
    'Repeat Guest': { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '🔄' },
    'Loyal': { color: 'bg-orange-100 text-orange-700 border-orange-300', icon: '❤️' },
    'First Time': { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '🆕' },
    'Recent Booking': { color: 'bg-teal-100 text-teal-700 border-teal-300', icon: '📅' },
    'At Risk': { color: 'bg-red-100 text-red-700 border-red-300', icon: '⚠️' },
    'Win Back': { color: 'bg-pink-100 text-pink-700 border-pink-300', icon: '🎯' }
  };

  const totalTags = Object.values(tagStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 border-2 border-orange-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center flex-1">
            <h2 className="text-3xl font-black text-orange-600">Guest Segmentation</h2>
            <p className="text-sm text-gray-600 font-semibold">Smart guest tagging & targeting</p>
          </div>
          <button
            onClick={handleAutoTagAll}
            disabled={isAutoTagging}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAutoTagging ? 'animate-spin' : ''}`} />
            {isAutoTagging ? 'Tagging...' : 'Auto-Tag All'}
          </button>
        </div>

        {/* Auto-tag result */}
        {autoTagResult && (
          <div className={`mt-4 p-4 rounded-xl ${autoTagResult.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            {autoTagResult.success ? (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">Auto-tagging completed!</p>
                  <p className="text-sm text-green-700">
                    Processed {autoTagResult.guestsProcessed} guests, tagged {autoTagResult.guestsTagged} guests with {autoTagResult.totalTagsAdded} total tags
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-700 font-semibold">{autoTagResult.error}</p>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'tags'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            Tag Distribution
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'segments'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Segments ({segments.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading segmentation data...</p>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-bold text-gray-600">Total Tags Applied</span>
                  </div>
                  <div className="text-3xl font-black text-orange-600">{totalTags}</div>
                  <div className="text-xs text-green-600 font-bold mt-1">Across all guests</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-bold text-gray-600">Active Segments</span>
                  </div>
                  <div className="text-3xl font-black text-orange-600">{segments.length}</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">Custom targeting</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 border-2 border-orange-200 shadow-lg text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6" />
                    <span className="text-sm font-bold opacity-90">Tag Types</span>
                  </div>
                  <div className="text-3xl font-black">{Object.keys(tagStats).length}</div>
                  <div className="text-xs opacity-80 font-bold mt-1">Different categories</div>
                </div>
              </div>

              {/* Quick Tag Overview */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                <h3 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tag Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(tagStats).map(([tagType, count]) => (
                    <div
                      key={tagType}
                      className={`p-4 rounded-xl border-2 ${tagConfig[tagType]?.color || 'bg-gray-100 text-gray-700 border-gray-300'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{tagConfig[tagType]?.icon || '🏷️'}</span>
                        <span className="text-xs font-bold">{tagType}</span>
                      </div>
                      <div className="text-2xl font-black">{count}</div>
                      <div className="text-xs opacity-75">guests</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-black text-blue-800 mb-3">📊 About Guest Segmentation</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Auto-Tagging:</strong> Automatically assigns tags based on guest behavior (bookings, spending, ratings)</p>
                  <p><strong>Segments:</strong> Create custom groups for targeted marketing campaigns</p>
                  <p><strong>Smart Targeting:</strong> Use segments in email, WhatsApp, and ad campaigns</p>
                </div>
              </div>
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                <h3 className="text-xl font-black text-orange-600 mb-4">Tag Definitions</h3>
                <div className="space-y-3">
                  {[
                    { tag: 'VIP', rule: 'Spent > $2000 OR Rating ≥ 4.8' },
                    { tag: 'High Value', rule: 'Spent > $1000' },
                    { tag: 'Repeat Guest', rule: 'Bookings ≥ 2' },
                    { tag: 'Loyal', rule: 'Bookings ≥ 5' },
                    { tag: 'First Time', rule: 'Bookings = 0' },
                    { tag: 'Recent Booking', rule: 'Last booking within 90 days' },
                    { tag: 'At Risk', rule: 'Last booking 180-365 days ago' },
                    { tag: 'Win Back', rule: 'Last booking > 365 days ago' }
                  ].map(({ tag, rule }) => (
                    <div
                      key={tag}
                      className={`p-4 rounded-xl border-2 ${tagConfig[tag]?.color || 'bg-gray-100 text-gray-700 border-gray-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tagConfig[tag]?.icon || '🏷️'}</span>
                          <div>
                            <p className="font-black">{tag}</p>
                            <p className="text-sm opacity-75">{rule}</p>
                          </div>
                        </div>
                        <div className="text-2xl font-black">{tagStats[tag] || 0}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-orange-600">Custom Segments</h3>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Segment
                  </button>
                </div>

                {segments.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold mb-2">No segments created yet</p>
                    <p className="text-sm text-gray-400">Create custom segments to target specific guest groups</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {segments.map((segment) => (
                      <div
                        key={segment.id}
                        className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-black text-gray-800">{segment.name}</h4>
                            <p className="text-sm text-gray-600">{segment.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-black text-orange-600">{segment.guest_count}</div>
                              <div className="text-xs text-gray-500">guests</div>
                            </div>
                            <button className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-all">
                              <Eye className="w-5 h-5 text-orange-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuestSegmentation;
