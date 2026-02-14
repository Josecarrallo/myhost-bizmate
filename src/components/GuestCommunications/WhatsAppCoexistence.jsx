import React, { useState, useEffect } from 'react';
import { Info, AlertCircle, CheckCircle, X, Loader2, ExternalLink, MessageSquare } from 'lucide-react';
import { AICoexistenceCard } from './shared';
import guestCommunicationsService from '../../services/guestCommunicationsService';

const WhatsAppCoexistence = ({ onBack }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState('assist');
  const [connectionStatus, setConnectionStatus] = useState(null);

  const [formData, setFormData] = useState({
    phone_number: '',
    waba_id: '',
    phone_number_id: '',
    access_token: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [modesResult, statusResult] = await Promise.all([
      guestCommunicationsService.getCoexistenceModes(),
      guestCommunicationsService.getConnectionStatus()
    ]);

    if (modesResult.success) {
      setModes(modesResult.data);
    }

    if (statusResult.success) {
      setConnectionStatus(statusResult.data);
      setSelectedMode(statusResult.data.whatsapp_coexistence_mode || 'assist');
    }

    setLoading(false);
  };

  const handleModeChange = async (modeId) => {
    setSelectedMode(modeId);
    const result = await guestCommunicationsService.updateCoexistenceMode(null, modeId);
    if (result.success) {
      console.log('Mode updated:', result.message);
    }
  };

  const handleWizardNext = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleWizardPrev = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    const result = await guestCommunicationsService.saveWhatsAppConfig(null, formData);

    if (result.success) {
      setConnectionStatus({ ...connectionStatus, whatsapp_connected: true, whatsapp_status: 'ok' });
      handleWizardNext();
    }

    setSaving(false);
  };

  const handleTestMessage = async () => {
    setTesting(true);
    const result = await guestCommunicationsService.testWhatsApp(null, formData.phone_number);

    if (result.success) {
      alert(`✅ ${result.message}\n\nCheck your WhatsApp!`);
    } else {
      alert(`❌ Test failed: ${result.error}`);
    }

    setTesting(false);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    setWizardStep(1);
    setFormData({ phone_number: '', waba_id: '', phone_number_id: '', access_token: '' });
  };

  if (loading) {
    return <div className="text-white/60">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">WhatsApp Coexistence (Human + AI)</h2>
        <p className="text-white/70 text-lg">
          Use your existing WhatsApp Business number with automation and AI assistance
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/90 text-sm">
            <strong>What is Coexistence?</strong> Keep using your WhatsApp Business App while our platform connects via official Cloud API on the same number. Both work together seamlessly.
          </div>
        </div>
      </div>

      {/* What you can do with WhatsApp */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-xl font-semibold mb-4">What you can do with WhatsApp</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Send automatic welcome messages before arrival',
            'Offer airport pickup and local drivers',
            'Answer simple questions (Wi-Fi, hours, directions) automatically',
            'Send reminders during the stay and follow-ups after check-out'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-white/80">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Coexistence Modes */}
      <div className="space-y-4">
        <h3 className="text-white text-xl font-semibold">AI Coexistence Mode (3 levels)</h3>
        <p className="text-white/70 text-sm">Choose how much AI assistance you want</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <AICoexistenceCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode === mode.id}
              onSelect={handleModeChange}
            />
          ))}
        </div>
      </div>

      {/* Setup button */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white text-xl font-semibold mb-2">Setup WhatsApp Coexistence</h3>
            <p className="text-white/70 text-sm">
              {connectionStatus?.whatsapp_connected
                ? '✅ WhatsApp is connected and working'
                : 'Connect your WhatsApp Business account to start automating messages'}
            </p>
          </div>
          {connectionStatus?.whatsapp_connected && (
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <span className="text-green-400 font-medium">Connected</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="bg-[#25D366] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1DA851] transition-colors flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          {connectionStatus?.whatsapp_connected ? 'Reconfigure WhatsApp' : 'Setup WhatsApp Coexistence'}
        </button>
      </div>

      {/* What AI will/won't do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Will do */}
        <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            What AI WILL Do
          </h4>
          <ul className="space-y-2">
            {[
              'Answer FAQs (Wi-Fi, location, hours)',
              'Send journey messages (welcome, reminders)',
              'Suggest responses for you to review',
              'Provide booking recommendations',
              'Escalate complex questions to humans'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                <span className="text-green-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Won't do */}
        <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <X className="w-5 h-5 text-red-400" />
            What AI WON'T Do
          </h4>
          <ul className="space-y-2">
            {[
              'Make complex booking changes',
              'Process payments or refunds',
              'Handle sensitive complaints',
              'Negotiate prices',
              'Make decisions about cancellations'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                <span className="text-red-400">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Warning about costs */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/90 text-sm">
            <strong>Important:</strong> All WhatsApp message costs are billed directly to you by Meta (Facebook). MY HOST BizMate doesn't charge for messages. Typical cost: $0.005 - $0.10 per message depending on country.
          </div>
        </div>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f2e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            {/* Wizard Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#25D366] to-[#1DA851] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">WhatsApp Setup Wizard</h2>
                <button
                  onClick={handleCloseWizard}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <p className="text-white/90 text-sm">Step {wizardStep} of 5</p>
              {/* Progress bar */}
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Wizard Content */}
            <div className="p-6">
              {/* Step 1 */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-semibold">Create WhatsApp Business Account</h3>
                  <p className="text-white/70">
                    If you don't have a WhatsApp Business account yet, you'll need to create one through Meta Business Suite.
                  </p>
                  <div className="bg-[#252b3b] rounded-lg p-4 space-y-3">
                    <p className="text-white/80 text-sm"><strong>Steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 text-white/70 text-sm">
                      <li>Go to Meta Business Suite</li>
                      <li>Navigate to WhatsApp → Get Started</li>
                      <li>Follow the verification process</li>
                      <li>Verify your business phone number</li>
                    </ol>
                  </div>
                  <a
                    href="https://business.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#1DA851] text-sm"
                  >
                    Open Meta Business Suite <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Step 2 */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-semibold">Enable Coexistence Mode</h3>
                  <p className="text-white/70">
                    This allows you to use WhatsApp Business App AND Cloud API on the same number simultaneously.
                  </p>
                  <div className="bg-[#252b3b] rounded-lg p-4 space-y-3">
                    <p className="text-white/80 text-sm"><strong>In Meta Business Suite:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 text-white/70 text-sm">
                      <li>Go to WhatsApp → Settings</li>
                      <li>Find "Access" section</li>
                      <li>Enable "Embedded signup" or "Cloud API"</li>
                      <li>Accept the coexistence terms</li>
                    </ol>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-400 text-xs">
                      💡 With coexistence enabled, you can keep using WhatsApp Business App on your phone while MY HOST BizMate sends automated messages via Cloud API.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-semibold">Get Phone Number ID & Access Token</h3>
                  <p className="text-white/70">
                    You need these credentials to connect MY HOST BizMate to your WhatsApp.
                  </p>
                  <div className="bg-[#252b3b] rounded-lg p-4 space-y-3">
                    <p className="text-white/80 text-sm"><strong>Where to find them:</strong></p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• <strong>WABA ID:</strong> WhatsApp → Settings → Business Info</li>
                      <li>• <strong>Phone Number ID:</strong> WhatsApp → Phone Numbers → Click on your number</li>
                      <li>• <strong>Access Token:</strong> System Users → Create → Generate token with "whatsapp_business_messaging" permission</li>
                    </ul>
                  </div>
                  <a
                    href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#1DA851] text-sm"
                  >
                    View detailed guide <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Step 4 - Form */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-semibold">Enter Your Credentials</h3>
                  <p className="text-white/70 text-sm">
                    All information is encrypted with AES-256 before storage.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white/80 text-sm font-medium mb-2 block">
                        WhatsApp Business Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+62 813 2576 4867"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full bg-[#252b3b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#25D366]"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm font-medium mb-2 block">
                        WABA ID
                      </label>
                      <input
                        type="text"
                        placeholder="123456789012345"
                        value={formData.waba_id}
                        onChange={(e) => setFormData({ ...formData, waba_id: e.target.value })}
                        className="w-full bg-[#252b3b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#25D366]"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm font-medium mb-2 block">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        placeholder="109876543210987"
                        value={formData.phone_number_id}
                        onChange={(e) => setFormData({ ...formData, phone_number_id: e.target.value })}
                        className="w-full bg-[#252b3b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#25D366]"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm font-medium mb-2 block">
                        Permanent Access Token
                      </label>
                      <input
                        type="password"
                        placeholder="EAAG..."
                        value={formData.access_token}
                        onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                        className="w-full bg-[#252b3b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#25D366]"
                      />
                      <p className="text-white/50 text-xs mt-1">
                        Never expires. Generate from System Users in Meta Business Suite.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    disabled={saving || !formData.phone_number || !formData.waba_id || !formData.phone_number_id || !formData.access_token}
                    className="w-full bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1DA851] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save & Continue'
                    )}
                  </button>
                </div>
              )}

              {/* Step 5 - Test */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Configuration Saved!</h3>
                    <p className="text-white/70">
                      Now let's send a test message to verify everything works.
                    </p>
                  </div>

                  <div className="bg-[#252b3b] rounded-lg p-4">
                    <p className="text-white/80 text-sm mb-3">
                      We'll send a test message to: <strong>{formData.phone_number}</strong>
                    </p>
                    <button
                      onClick={handleTestMessage}
                      disabled={testing}
                      className="w-full bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1DA851] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {testing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending test...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-5 h-5" />
                          Send Test Message
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleCloseWizard}
                    className="w-full bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/10"
                  >
                    Done - Close Wizard
                  </button>
                </div>
              )}
            </div>

            {/* Wizard Footer Navigation */}
            {wizardStep < 5 && (
              <div className="border-t border-white/10 p-6 flex items-center justify-between">
                <button
                  onClick={handleWizardPrev}
                  disabled={wizardStep === 1}
                  className="px-6 py-2 rounded-lg text-white/80 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleWizardNext}
                  disabled={wizardStep === 4}
                  className="px-6 py-2 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#1DA851] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {wizardStep === 4 ? 'Fill form above' : 'Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppCoexistence;
