import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { TimelineNode } from './shared';
import guestCommunicationsService from '../../services/guestCommunicationsService';

const GuestJourney = ({ onBack }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadJourneyRules();
  }, []);

  const loadJourneyRules = async () => {
    const result = await guestCommunicationsService.getJourneyRules();
    if (result.success) {
      setRules(result.data);
    }
    setLoading(false);
  };

  const handleToggle = (ruleId) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleEdit = (ruleId) => {
    // TODO: Open template editor modal
    console.log('Edit template for rule:', ruleId);
    alert('Template editor coming soon! This will allow you to customize the message content.');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const result = await guestCommunicationsService.saveJourneyRules(null, rules);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving journey settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white/60">Loading journey settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">Guest Journey Automations</h2>
        <p className="text-white/70 text-lg">
          Choose when to send WhatsApp and Email messages during the guest journey
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-white/80 text-sm">
          <strong>How it works:</strong> Toggle each step ON or OFF. Messages are sent automatically based on booking dates. You can customize the message templates by clicking "Edit template".
        </p>
      </div>

      {/* Success/Error message */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${
            message.type === 'success' ? 'text-green-300' : 'text-red-300'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-[#1a1f2e] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-6">Journey Timeline</h3>

        <div className="space-y-0">
          {rules.map((rule, index) => (
            <TimelineNode
              key={rule.id}
              rule={rule}
              isFirst={index === 0}
              isLast={index === rules.length - 1}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <div>
          <p className="text-white font-medium">
            {rules.filter(r => r.enabled).length} of {rules.length} automations enabled
          </p>
          <p className="text-white/60 text-sm">Changes are saved automatically to your property</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#d85a2a] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#c14d1f] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Journey Settings
            </>
          )}
        </button>
      </div>

      {/* Additional info */}
      <div className="bg-[#252b3b] rounded-xl p-5 border border-white/10">
        <h4 className="text-white font-semibold mb-3">💡 Pro Tips</h4>
        <ul className="space-y-2 text-white/70 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[#d85a2a]">•</span>
            <span>Start with booking confirmation and check-in messages - these have the highest impact</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#d85a2a]">•</span>
            <span>Review requests (3 days after) significantly increase your online ratings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#d85a2a]">•</span>
            <span>WhatsApp messages have 98% open rates vs 20% for emails - use them for time-sensitive info</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#d85a2a]">•</span>
            <span>You can pause individual automations anytime without affecting others</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GuestJourney;
