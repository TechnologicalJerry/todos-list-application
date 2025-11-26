'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="text-green-600 text-sm">
          Password reset email sent! Please check your inbox.
        </div>
        <a href="/login" className="text-blue-600 hover:underline">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      
      <div className="text-sm text-center">
        <a href="/login" className="text-blue-600 hover:underline">
          Back to login
        </a>
      </div>
    </form>
  );
}

