import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Lock, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { storageUtils } from '../utils/storage';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (storageUtils.verifyAdminPassword(password)) {
      storageUtils.setAdminAuth(true);
      onLogin();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card border border-cyan-500/20 p-8 rounded-[32px] shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <Shield className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Secure Access</h1>
            <p className="text-slate-400 text-sm">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Access Key</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-2xl font-bold border-0 shadow-lg shadow-cyan-900/20"
            >
              Verify Credentials
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-bold"
            >
              Return to Brand Site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}