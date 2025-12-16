import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
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
      // Success - AuthContext will handle the redirect
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Solid Orange */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-500 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-50"></div>

        {/* Optional: Add subtle pattern or branding here later */}
        <div className="relative z-10 w-full"></div>
      </div>

      {/* Right Side - Light Gray with White Card */}
      <div className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-10">

            {/* Logo and Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-1">
                MY HOST
              </h1>
              <p className="text-3xl font-bold text-orange-500">
                BizMate
              </p>
              <p className="text-gray-600 mt-6 text-lg">
                Sign in to your account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-gray-900"
                  placeholder="Email Address"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-gray-900"
                  placeholder="Password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
