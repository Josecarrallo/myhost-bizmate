import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPageV2 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message || 'Invalid email or password');
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/modern-bali-architecture-luxury-villa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex-grow flex flex-col items-center justify-center">
        {/* Logo/Brand */}
        <div className="mb-6 md:mb-8 text-center">
          <span className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter text-[#FF8C42] drop-shadow-2xl">
            MY HOST BizMate
          </span>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left Side: Marketing Copy */}
          <div className="w-full md:w-1/2 text-white text-center md:text-left space-y-3 md:space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight">
              Empowering Property Owners with Intelligence
            </h1>

            <div className="hidden md:block space-y-2">
              <p className="text-base lg:text-lg font-normal opacity-90 leading-relaxed text-white">
                An AI-powered operating system for modern property owners.
              </p>
              <p className="text-base lg:text-lg font-normal opacity-90 leading-relaxed text-white">
                Manage operations, guests, marketing and AI agents from one intelligent platform.
              </p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <div className="md:bg-white md:rounded-2xl md:shadow-2xl p-0 md:p-5 w-full max-w-sm transition-all duration-300 md:hover:shadow-2xl md:border md:border-white/20">
              <div className="text-center mb-4">
                <h2 className="text-xl font-extrabold text-white md:text-slate-900 tracking-tight">Sign In</h2>
                <div className="mt-1 h-1 w-10 bg-[#FF8C42] mx-auto rounded-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Error</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-white md:text-slate-700 font-semibold ml-1 block text-sm">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF8C42] transition-colors" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jose@myhost.com"
                      className="w-full pl-10 h-10 bg-white md:bg-slate-50 border border-white/30 md:border-slate-200 rounded-lg focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 focus:outline-none text-sm transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-white md:text-slate-700 font-semibold ml-1 block text-sm">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF8C42] transition-colors" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••••"
                      className="w-full pl-10 h-10 bg-white md:bg-slate-50 border border-white/30 md:border-slate-200 rounded-lg focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 focus:outline-none text-sm transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 flex items-center justify-center text-sm font-bold bg-[#FF8C42] hover:bg-[#E67E30] text-white rounded-lg transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Footer */}
                <div className="hidden md:block text-center pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Powered · Secure · Private</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-20 w-full bg-black/40 backdrop-blur-sm border-t border-white/10 py-3 px-6">
        <div className="max-w-7xl mx-auto text-center text-white/80 text-xs md:text-sm">
          Built for property owners and operators to manage, communicate, and grow smarter with intelligent agents.
        </div>
      </footer>
    </div>
  );
};

export default LoginPageV2;
