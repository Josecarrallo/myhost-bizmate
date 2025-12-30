import React from 'react';
import { Lock, Zap, DollarSign, HelpCircle, ArrowRight } from 'lucide-react';

const HowItWorks = ({ onBack }) => {
  const faqs = [
    {
      question: 'Do I need technical knowledge to set this up?',
      answer: 'No! The setup wizard guides you through each step. You just need your WhatsApp Business account and email provider credentials. Our support team can help if needed.'
    },
    {
      question: 'Will guests see a different number or email?',
      answer: 'No. All messages come from YOUR WhatsApp Business number and YOUR hotel email address. Guests see the same contact information they already know.'
    },
    {
      question: 'Who pays for the messages?',
      answer: 'You do, directly to Meta (WhatsApp) and Amazon SES (email). MY HOST BizMate doesn\'t charge per message - we just provide the platform to send them.'
    },
    {
      question: 'Can I still use my WhatsApp manually?',
      answer: 'Yes! That\'s the "coexistence" part. You can use your WhatsApp Business App normally while the automation works in parallel via the official Cloud API.'
    },
    {
      question: 'What if the AI makes a mistake?',
      answer: 'You choose the AI mode (Auto/Assist/Human). In Assist mode, you approve every message before sending. You can also limit what types of questions AI can answer.'
    },
    {
      question: 'How much does this cost?',
      answer: 'MY HOST BizMate platform is included in your subscription. You only pay Meta and Amazon SES directly for actual message volume (very low cost - usually cents per message).'
    },
    {
      question: 'Can I customize the message templates?',
      answer: 'Yes! All templates are fully customizable. You can edit text, timing, and choose which automations to enable for your property.'
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">How Guest Communications Works</h2>
        <p className="text-white/70 text-lg">Understanding BYOK (Bring Your Own Key) and how MY HOST BizMate connects everything</p>
      </div>

      {/* BYOK Explanation */}
      <div className="bg-gradient-to-br from-[#d85a2a]/20 to-[#f5a524]/20 rounded-xl p-6 border border-[#d85a2a]/30">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#d85a2a]">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">BYOK - Bring Your Own Key</h3>
            <p className="text-white/80">
              You keep full control and ownership of your communication channels. MY HOST BizMate connects to YOUR accounts, not ours.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-2">YOUR WhatsApp</p>
            <p className="text-white font-medium">Your Business number</p>
            <p className="text-white/80 text-sm mt-1">Guests see your brand</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-2">YOUR Email</p>
            <p className="text-white font-medium">Your domain & sender</p>
            <p className="text-white/80 text-sm mt-1">Professional branding</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-2">YOUR Data</p>
            <p className="text-white font-medium">You own everything</p>
            <p className="text-white/80 text-sm mt-1">Full privacy & control</p>
          </div>
        </div>
      </div>

      {/* How it works - 3 steps */}
      <div className="space-y-6">
        <h3 className="text-white text-2xl font-semibold">Simple Setup in 3 Steps</h3>

        {/* Step 1 */}
        <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d85a2a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white text-lg font-semibold mb-2">Connect Your Accounts</h4>
              <p className="text-white/70 mb-3">
                Add your WhatsApp Business credentials and email provider API keys. We encrypt everything with AES-256.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">WhatsApp Business</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">Amazon SES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d85a2a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white text-lg font-semibold mb-2">Configure Automations</h4>
              <p className="text-white/70 mb-3">
                Choose which messages to automate (booking confirmations, welcome messages, etc.) and set your AI assistance level.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">Guest Journey</span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded text-sm">AI Coexistence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d85a2a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white text-lg font-semibold mb-2">Go Live!</h4>
              <p className="text-white/70 mb-3">
                Send test messages to verify everything works. Then activate automations and start saving time while improving guest experience.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">24/7 Coverage</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">Instant Responses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Transparent Pricing</h4>
            <p className="text-white/70 text-sm mb-2">
              MY HOST BizMate platform: Included in your subscription<br/>
              WhatsApp messages: ~$0.005 - $0.10 per message (billed by Meta)<br/>
              Email sending: ~$0.10 per 1,000 emails (billed by Amazon SES)
            </p>
            <p className="text-white/60 text-xs">
              Example: 1,000 WhatsApp + 2,000 emails per month ≈ $5-12 total external costs
            </p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h3 className="text-white text-2xl font-semibold flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Frequently Asked Questions
        </h3>

        {faqs.map((faq, index) => (
          <details key={index} className="bg-[#252b3b] rounded-xl border border-white/10 group">
            <summary className="p-5 cursor-pointer list-none flex items-center justify-between">
              <span className="text-white font-medium">{faq.question}</span>
              <ArrowRight className="w-5 h-5 text-white/60 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-5 pb-5">
              <p className="text-white/70 text-sm">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-xl p-6 text-center">
        <h3 className="text-white text-2xl font-bold mb-2">Ready to Get Started?</h3>
        <p className="text-white/90 mb-4">Set up your first automation in less than 15 minutes</p>
        <button
          onClick={onBack}
          className="bg-white text-[#d85a2a] px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Start Setup Now
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
