'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login({ email, password });

    if (result.success) {
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-card-hover rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-secondary hover:text-foreground transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-6">
          Welcome <span className="text-primary">Back</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-card-hover rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-card-hover rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-background font-semibold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-primary hover:text-primary-hover font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
