import { Phone } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';

const App = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* VoiceAssistant component - will render floating button */}
      <VoiceAssistant />

      {/* Main Content */}
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src="/images/lumina-avatar.jpg"
              alt="Izumi Hotel"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#d85a2a] shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Titles - All same size with gradient */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] bg-clip-text text-transparent">
            Speak with KORA
          </span>
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] bg-clip-text text-transparent">
            Habla con KORA
          </span>
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] bg-clip-text text-transparent">
            Bicara dengan KORA
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
          Our virtual receptionist speaks{' '}
          <span className="font-bold text-[#d85a2a]">English</span>,{' '}
          <span className="font-bold text-[#d85a2a]">Spanish</span>, and{' '}
          <span className="font-bold text-[#d85a2a]">Indonesian</span>
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-[#d85a2a] to-[#f5a524] rounded-2xl p-6 shadow-xl border-2 border-white">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Multilingual</h3>
            <p className="text-sm text-white/90">Available 24/7 in your language</p>
          </div>

          <div className="bg-gradient-to-br from-[#d85a2a] to-[#f5a524] rounded-2xl p-6 shadow-xl border-2 border-white">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Help</h3>
            <p className="text-sm text-white/90">Get answers immediately</p>
          </div>

          <div className="bg-gradient-to-br from-[#d85a2a] to-[#f5a524] rounded-2xl p-6 shadow-xl border-2 border-white">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Voice Powered</h3>
            <p className="text-sm text-white/90">Natural conversation</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-2xl p-8 border-4 border-white shadow-2xl">
          <p className="text-lg text-white mb-4 font-semibold">
            👇 Tap the <span className="font-bold">KORA Voice Assistant</span> button below to start speaking
          </p>
          <p className="text-sm text-white/90">
            Available for room service, concierge, activities, and more
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-400">
          <p>Powered by Izumi Hotel AI</p>
        </div>
      </div>
    </div>
  );
};

export default App;
