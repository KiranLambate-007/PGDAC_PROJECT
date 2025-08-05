import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password, role);
    if (!success) {
      setError('Invalid credentials or role selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          Welcome Back 👋
        </h2>

        <div className="flex justify-center mb-6 gap-6">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              role === 'user'
                ? 'bg-blue-600 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <UserCircle className="h-5 w-5" />
            User
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              role === 'admin'
                ? 'bg-purple-600 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Shield className="h-5 w-5" />
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};
