import React, { useState, useEffect } from 'react';
import { Info, ExternalLink, Mail, Sparkles, Send, Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import guestCommunicationsService from '../../services/guestCommunicationsService';

const EmailCommunication = () => {
  const [showSendGridGuide, setShowSendGridGuide] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [emailTone, setEmailTone] = useState('friendly');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Load segments on mount
  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    const data = await guestCommunicationsService.getGuestSegments();
    setSegments(data);
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await guestCommunicationsService.generateEmailDraft(
        selectedSegment,
        emailTone
      );

      if (result.success) {
        setEmailSubject(result.subject);
        setEmailBody(result.body);
        setMessage({ type: 'success', text: 'AI draft generated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to generate draft' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error generating draft' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!emailSubject || !emailBody) {
      setMessage({ type: 'error', text: 'Please enter subject and message' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await guestCommunicationsService.saveDraft(
        selectedSegment,
        emailSubject,
        emailBody,
        emailTone
      );

      if (result.success) {
        setMessage({ type: 'success', text: 'Draft saved successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save draft' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving draft' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) {
      setMessage({ type: 'error', text: 'Please enter subject and message' });
      return;
    }

    const segment = segments.find(s => s.id === selectedSegment);
    const recipientCount = segment ? segment.count : 0;

    if (recipientCount === 0) {
      setMessage({ type: 'error', text: 'No recipients found for this segment' });
      return;
    }

    // Confirm before sending
    const confirmed = window.confirm(
      `Are you sure you want to send this email to ${recipientCount} guests?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setSending(true);
    setMessage(null);

    try {
      const result = await guestCommunicationsService.sendEmail(
        selectedSegment,
        emailSubject,
        emailBody,
        emailTone
      );

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Email sent successfully to ${result.recipientsCount} guests!`
        });
        // Clear form
        setEmailSubject('');
        setEmailBody('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sending email' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/90 text-sm">
            <strong>Email automation requires SendGrid configuration.</strong>
            <br />
            MY HOST BizMate uses SendGrid to send emails on your behalf. You'll need a SendGrid account (free tier available).
          </div>
        </div>
      </div>

      {/* SendGrid Setup Button */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-2">Get Started with Email</h3>
        <p className="text-white/70 text-sm mb-4">
          We'll help you connect SendGrid to send automated emails to your guests. SendGrid offers a free tier (100 emails/day).
        </p>
        <button
          onClick={() => setShowSendGridGuide(true)}
          className="bg-[#d85a2a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c14d1f] transition-colors flex items-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Setup SendGrid
        </button>
      </div>

      {/* Email Composer */}
      <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF8C42]" />
          AI Email Composer
        </h3>

        {/* Guest Segment Selection */}
        <div className="mb-4">
          <label className="text-white/80 text-sm font-medium mb-2 block">Send to:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {segments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => setSelectedSegment(segment.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedSegment === segment.id
                    ? 'bg-[#d85a2a]/20 border-[#d85a2a] text-white'
                    : 'bg-[#1a1f2e] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{segment.label}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">{segment.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Tone Selection */}
        <div className="mb-4">
          <label className="text-white/80 text-sm font-medium mb-2 block">Tone:</label>
          <div className="flex gap-2">
            {['formal', 'friendly', 'promo'].map((tone) => (
              <button
                key={tone}
                onClick={() => setEmailTone(tone)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  emailTone === tone
                    ? 'bg-[#d85a2a] text-white'
                    : 'bg-[#1a1f2e] text-white/70 hover:text-white'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Generate Draft Button */}
        <button
          onClick={handleGenerateDraft}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Draft
            </>
          )}
        </button>

        {/* Email Subject */}
        <div className="mb-4">
          <label className="text-white/80 text-sm font-medium mb-2 block">Subject:</label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#d85a2a] transition-colors"
          />
        </div>

        {/* Email Body */}
        <div className="mb-4">
          <label className="text-white/80 text-sm font-medium mb-2 block">Message:</label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Write your message here..."
            rows="10"
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#d85a2a] transition-colors resize-none"
          />
        </div>

        {/* Send Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSendEmail}
            disabled={sending || loading}
            className="flex-1 bg-[#d85a2a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c14d1f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send to {segments.find(s => s.id === selectedSegment)?.count || 0} Guests
              </>
            )}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={loading || sending}
            className="bg-[#1a1f2e] text-white/80 px-6 py-3 rounded-lg font-medium hover:bg-[#252b3b] transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* SendGrid Setup Modal */}
      {showSendGridGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSendGridGuide(false)}>
          <div className="bg-[#1a1f2e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">SendGrid Setup Guide</h2>
              <p className="text-white/90 text-sm">Follow these steps to connect SendGrid for email automation</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1 */}
              <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-[#d85a2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Create a SendGrid Account</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Sign up for a free SendGrid account. The free tier allows 100 emails/day, perfect for small properties.
                    </p>
                    <a
                      href="https://signup.sendgrid.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF8C42] hover:text-[#d85a2a] text-sm flex items-center gap-1"
                    >
                      Create SendGrid Account <ExternalLink className="w-4 h-4" />
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
                    <h3 className="text-white font-semibold mb-2">Verify Your Sender Identity</h3>
                    <p className="text-white/70 text-sm mb-3">
                      In SendGrid, go to Settings → Sender Authentication → Verify a Single Sender. Use your business email address.
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
                    <h3 className="text-white font-semibold mb-2">Generate API Key</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Go to Settings → API Keys → Create API Key. Choose "Restricted Access" and enable "Mail Send" permission only.
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
                      Contact our support team with your SendGrid API Key. We'll configure your email integration securely.
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
                    <h3 className="text-white font-semibold mb-2">Test & Send</h3>
                    <p className="text-white/70 text-sm">
                      Our team will help you send a test email. Once verified, you can start sending emails to your guests!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSendGridGuide(false)}
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

export default EmailCommunication;
