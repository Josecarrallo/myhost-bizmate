import React, { useState } from 'react';
import { User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden font-sans">
      {/* Background Image - Luxury tropical resort at sunset */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/login-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-wide">
            MY HOST
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-medium tracking-widest mt-1">
            BIZMATE
          </p>
        </div>

        {/* Headline */}
        <div className="mb-10 max-w-md">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
            Your hospitality business.
          </h2>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
            <span className="text-white">Now with an </span>
            <span className="text-[#D7B46A]">AI team.</span>
          </h2>
        </div>

        {/* Login Form Card - Dark semi-transparent */}
        <div className="w-full max-w-sm">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#D7B46A]/50 focus:ring-1 focus:ring-[#D7B46A]/30 focus:outline-none transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#D7B46A]/50 focus:ring-1 focus:ring-[#D7B46A]/30 focus:outline-none transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#B98A3D] focus:ring-[#B98A3D]/30 focus:ring-offset-0"
                  />
                  <span className="text-white/60">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-white/60 hover:text-[#D7B46A] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button - Champagne/Gold */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 text-base font-semibold bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] hover:from-[#A67A30] hover:to-[#C9A65C] text-white rounded-xl transition-all shadow-lg shadow-[#B98A3D]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <>
                    Enter My HOST
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Text */}
          <p className="text-center text-white/50 text-sm mt-6">
            AI-powered hospitality operating system
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
