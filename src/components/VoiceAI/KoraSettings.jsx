import React, { useState } from 'react';
import { ArrowLeft, Phone, Clock, Globe, Volume2, Mic, MessageSquare, Mail, Save, Info, Bell, Shield } from 'lucide-react';

const KoraSettings = ({ onBack }) => {
  const [settings, setSettings] = useState({
    // Reception Hours
    receptionHoursEnabled: true,
    receptionStart: '08:00',
    receptionEnd: '20:00',

    // Voice Settings
    voiceGender: 'female',
    voiceLanguage: 'en-US',
    voiceSpeed: 1.0,

    // Behavior
    maxCallDuration: 300, // seconds
    enableVoicemail: true,
    enableTranscripts: true,
    enableSentimentAnalysis: true,

    // Notifications
    notifyOnMissedCall: true,
    notifyOnComplaint: true,
    notifyEmail: 'owner@izumihotel.com',
    notifyWhatsApp: '+62 813 2576 4867',

    // AI Behavior
    aiPersonality: 'professional',
    enableSmallTalk: true,
    enableBookingAssistance: true,
    enableComplaintHandling: true,

    // Handoff Rules
    handoffToStaff: true,
    handoffKeywords: ['urgent', 'emergency', 'manager', 'speak to someone'],

    // VAPI Integration
    vapiAssistantId: 'ast_abc123xyz',
    vapiPhoneNumber: '+1 555 KORA-AI'
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving KORA.AI settings:', settings);
    // TODO: Save to Supabase
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-6 relative overflow-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">📞 KORA.AI Settings</h1>
            <p className="text-white/60 mt-1">Configure your voice concierge assistant</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reception Hours */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Clock className="w-5 h-5 text-blue-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">Reception Hours</h2>
          </div>
          <p className="text-white/60 text-sm mb-4">
            KORA.AI answers calls when reception is closed
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="receptionEnabled"
                checked={settings.receptionHoursEnabled}
                onChange={(e) => handleChange('receptionHoursEnabled', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="receptionEnabled" className="text-white text-sm">
                Enable reception hours (KORA handles calls outside these hours)
              </label>
            </div>

            {settings.receptionHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="text-white/60 text-sm block mb-2">Reception Opens</label>
                  <input
                    type="time"
                    value={settings.receptionStart}
                    onChange={(e) => handleChange('receptionStart', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm block mb-2">Reception Closes</label>
                  <input
                    type="time"
                    value={settings.receptionEnd}
                    onChange={(e) => handleChange('receptionEnd', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Volume2 className="w-5 h-5 text-purple-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">Voice Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm block mb-2">Voice Gender</label>
              <select
                value={settings.voiceGender}
                onChange={(e) => handleChange('voiceGender', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label className="text-white/60 text-sm block mb-2">Language</label>
              <select
                value={settings.voiceLanguage}
                onChange={(e) => handleChange('voiceLanguage', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="id-ID">Indonesian</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>

            <div>
              <label className="text-white/60 text-sm block mb-2">
                Speaking Speed: {settings.voiceSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => handleChange('voiceSpeed', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call Behavior */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Phone className="w-5 h-5 text-green-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">Call Behavior</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm block mb-2">Max Call Duration (seconds)</label>
              <input
                type="number"
                value={settings.maxCallDuration}
                onChange={(e) => handleChange('maxCallDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableVoicemail"
                checked={settings.enableVoicemail}
                onChange={(e) => handleChange('enableVoicemail', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="enableVoicemail" className="text-white text-sm">
                Enable voicemail fallback
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableTranscripts"
                checked={settings.enableTranscripts}
                onChange={(e) => handleChange('enableTranscripts', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="enableTranscripts" className="text-white text-sm">
                Save call transcripts
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableSentiment"
                checked={settings.enableSentimentAnalysis}
                onChange={(e) => handleChange('enableSentimentAnalysis', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="enableSentiment" className="text-white text-sm">
                Enable sentiment analysis
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Bell className="w-5 h-5 text-orange-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notifyMissed"
                checked={settings.notifyOnMissedCall}
                onChange={(e) => handleChange('notifyOnMissedCall', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="notifyMissed" className="text-white text-sm">
                Notify on missed calls
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notifyComplaint"
                checked={settings.notifyOnComplaint}
                onChange={(e) => handleChange('notifyOnComplaint', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="notifyComplaint" className="text-white text-sm">
                Notify on complaints (urgent)
              </label>
            </div>

            <div>
              <label className="text-white/60 text-sm block mb-2">Notification Email</label>
              <input
                type="email"
                value={settings.notifyEmail}
                onChange={(e) => handleChange('notifyEmail', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm block mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={settings.notifyWhatsApp}
                onChange={(e) => handleChange('notifyWhatsApp', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* AI Personality */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/20 rounded-xl">
              <MessageSquare className="w-5 h-5 text-pink-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Personality</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm block mb-2">Personality Style</label>
              <select
                value={settings.aiPersonality}
                onChange={(e) => handleChange('aiPersonality', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
              >
                <option value="professional">Professional & Formal</option>
                <option value="friendly">Friendly & Warm</option>
                <option value="concise">Concise & Direct</option>
                <option value="luxury">Luxury & Sophisticated</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableSmallTalk"
                checked={settings.enableSmallTalk}
                onChange={(e) => handleChange('enableSmallTalk', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="enableSmallTalk" className="text-white text-sm">
                Enable small talk and pleasantries
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableBooking"
                checked={settings.enableBookingAssistance}
                onChange={(e) => handleChange('enableBookingAssistance', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="enableBooking" className="text-white text-sm">
                Enable booking assistance
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableComplaint"
                checked={settings.enableComplaintHandling}
                onChange={(e) => handleChange('enableComplaintHandling', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="enableComplaint" className="text-white text-sm">
                Enable complaint handling
              </label>
            </div>
          </div>
        </div>

        {/* Handoff Rules */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <Shield className="w-5 h-5 text-yellow-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">Handoff to Staff</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="handoffEnabled"
                checked={settings.handoffToStaff}
                onChange={(e) => handleChange('handoffToStaff', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="handoffEnabled" className="text-white text-sm">
                Enable handoff to human staff
              </label>
            </div>

            {settings.handoffToStaff && (
              <div>
                <label className="text-white/60 text-sm block mb-2">
                  Handoff Keywords (comma-separated)
                </label>
                <textarea
                  value={settings.handoffKeywords.join(', ')}
                  onChange={(e) => handleChange('handoffKeywords', e.target.value.split(',').map(k => k.trim()))}
                  rows="3"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 resize-none"
                  placeholder="urgent, emergency, manager, speak to someone"
                />
                <p className="text-white/40 text-xs mt-2">
                  KORA will transfer the call when these words are detected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* VAPI Integration */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Globe className="w-5 h-5 text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">VAPI Integration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm block mb-2">VAPI Assistant ID</label>
              <input
                type="text"
                value={settings.vapiAssistantId}
                onChange={(e) => handleChange('vapiAssistantId', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 font-mono text-sm"
                placeholder="ast_..."
              />
            </div>

            <div>
              <label className="text-white/60 text-sm block mb-2">VAPI Phone Number</label>
              <input
                type="text"
                value={settings.vapiPhoneNumber}
                onChange={(e) => handleChange('vapiPhoneNumber', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                placeholder="+1 555 ..."
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">VAPI Configuration</p>
                <p className="text-blue-200/80 text-xs">
                  Configure your VAPI assistant at{' '}
                  <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">
                    vapi.ai
                  </a>
                  . Make sure to set up webhooks pointing to your n8n workflow (WF-VA-01).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg text-lg"
        >
          <Save className="w-6 h-6" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default KoraSettings;
