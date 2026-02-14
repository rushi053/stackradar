'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState<number | null>(null);

  // Fetch waitlist count on mount
  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const response = await fetch('/api/waitlist');
      if (response.ok) {
        const data = await response.json();
        setCount(data.count);
      }
    } catch (err) {
      console.error('Failed to fetch waitlist count:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'website' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        fetchCount(); // Refresh count
      } else if (response.status === 409) {
        setError(data.message || "You're already on the list!");
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass p-8 rounded-2xl border-accentGreen/30 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-accentGreen/20 border border-accentGreen/30 flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-accentGreen" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">You're in!</h3>
          <p className="text-secondary">
            We'll notify you at <span className="text-accent font-medium">{email}</span> when StackRadar Pro launches.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass-premium p-8 md:p-10 rounded-3xl border-accent/20 relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accentPurple/20 rounded-full blur-3xl" />

        <div className="relative">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Coming Soon</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              StackRadar <span className="gradient-text">Pro</span>
            </h2>
            <p className="text-secondary text-lg">
              Join the waitlist for early access to premium features
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { icon: '📦', text: 'Bulk scan 50+ URLs at once' },
              { icon: '🔌', text: 'API access for developers' },
              { icon: '📊', text: 'Export reports as PDF/PNG' },
              { icon: '🔄', text: 'Unlimited compare & 90-day history' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-background/40 border border-white/5"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 glass rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 smooth placeholder:text-secondary/50 disabled:opacity-50"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-accent hover:bg-accent/90 disabled:bg-secondary/20 disabled:cursor-not-allowed text-white font-semibold rounded-xl smooth flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join Waitlist</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Waitlist Count */}
          {count !== null && count > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-secondary mt-6"
            >
              <span className="text-accent font-semibold">{count}</span> {count === 1 ? 'person' : 'people'} on the waitlist
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
