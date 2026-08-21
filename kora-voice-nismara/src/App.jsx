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
        <div className="flex justify-center mb-6">
          <img
            src="/images/lumina-avatar.jpg"
            alt="Nismara Uma"
            className="w-48 h-64 md:w-56 md:h-72 rounded-full object-cover border-4 border-[#d85a2a] shadow-2xl"
          />
        </div>
        {/* Property Name */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#d85a2a] mb-2">Nismara Uma</h1>
        <p className="text-lg text-[#f5a524] font-semibold mb-12">Ubud, Bali</p>
      </div>
    </div>
  );
};

export default App;
