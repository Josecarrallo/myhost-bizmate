import React, { useState } from 'react';
import { Info, ExternalLink, CheckCircle2, AlertCircle, Phone, MessageSquare } from 'lucide-react';

const WhatsAppCoexistence = () => {
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/90 text-sm">
            <strong>WhatsApp automation requires a WhatsApp Business account connected via Coexistence mode.</strong>
            <br />
            MY HOST BizMate helps you set it up — you keep full control of your chats on your phone.
            <br />
            AI only helps with drafts, FAQs, and follow-ups.
          </div>
        </div>
      </div>

      {/* Setup Guide Button */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-2">Get Started with WhatsApp Coexistence</h3>
        <p className="text-white/70 text-sm mb-4">
          We'll help you connect your WhatsApp Business account in Coexistence mode. This means you can chat with guests from your phone while AI assists with drafts and FAQs.
        </p>
        <button
          onClick={() => setShowSetupGuide(true)}
          className="bg-[#d85a2a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c14d1f] transition-colors flex items-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Setup WhatsApp Coexistence
        </button>
      </div>

      {/* What AI Will Do */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-4">What AI Will Do</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Answer common FAQs (check-in time, WiFi password, amenities)</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Provide local recommendations (restaurants, attractions, transport)</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Send automated check-in/check-out reminders</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Generate message drafts for you to review before sending</p>
          </div>
        </div>
      </div>

      {/* What AI Won't Do */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-4">What AI Won't Do</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Handle booking modifications (you stay in control)</p>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Process refunds or cancellations (requires your approval)</p>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">Reply to complex or sensitive issues (you handle these)</p>
          </div>
        </div>
      </div>

      {/* Responsibility & Billing */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/90 text-sm">
            <strong>Important:</strong> WhatsApp Business API has messaging costs (usually $0.005-0.05 per conversation).
            <br />
            You are responsible for WhatsApp billing. MY HOST BizMate does not charge for WhatsApp usage.
          </div>
        </div>
      </div>

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSetupGuide(false)}>
          <div className="bg-[#1a1f2e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Coexistence Setup Guide</h2>
              <p className="text-white/90 text-sm">Follow these steps to connect your WhatsApp Business account</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1 */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-[#d85a2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Create a WhatsApp Business Account</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Go to Meta Business Suite and create a WhatsApp Business account. You'll need a phone number dedicated to your business.
                    </p>
                    <a
                      href="https://business.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF8C42] hover:text-[#d85a2a] text-sm flex items-center gap-1"
                    >
                      Open Meta Business Suite <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-[#d85a2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Enable Coexistence Mode</h3>
                    <p className="text-white/70 text-sm mb-3">
                      In Meta Business Suite, go to WhatsApp Manager → Settings → Phone Number → Enable "Coexistence mode". This allows both you and the API to send messages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-[#d85a2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Get Your API Credentials</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Copy your Phone Number ID and Access Token from WhatsApp Manager → API Setup.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-[#d85a2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Connect to MY HOST BizMate</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Contact our support team with your Phone Number ID and Access Token. We'll configure your WhatsApp integration securely.
                    </p>
                    <p className="text-white/60 text-xs italic">
                      Support: support@myhostbizmate.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-[#d85a2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Test & Launch</h3>
                    <p className="text-white/70 text-sm">
                      Our team will help you test the integration. Once verified, your WhatsApp AI assistant will be live!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSetupGuide(false)}
                className="w-full bg-[#d85a2a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c14d1f] transition-colors"
              >
                Got it, close guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppCoexistence;
