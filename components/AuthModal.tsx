
import React, { useState } from 'react';
import { X, Mail, Github, Loader2, ArrowRight } from 'lucide-react';
import Button from './Button';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider);
    try {
      let user;
      if (provider === 'google') {
        user = await authService.loginWithGoogle();
      } else {
        user = await authService.loginWithGithub();
      }
      onLogin(user);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading('email');
    try {
      const user = await authService.loginWithEmail(email);
      onLogin(user);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="glass-panel rounded-2xl p-1 shadow-2xl">
          <div className="bg-white/95 dark:bg-[#0b1121]/90 backdrop-blur-xl rounded-xl p-8 border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-xl">
            
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                {isLogin ? 'Enter your credentials to access your workspace' : 'Join PromptForge to save your generations'}
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="secondary"
                className="w-full relative hover:bg-slate-100 dark:hover:bg-white/5 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"
                onClick={() => handleSocialLogin('google')}
                isLoading={isLoading === 'google'}
              >
                {!isLoading && <GoogleIcon className="w-5 h-5 mr-3" />}
                Continue with Google
              </Button>

              <Button
                variant="secondary"
                className="w-full relative hover:bg-slate-100 dark:hover:bg-white/5 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"
                onClick={() => handleSocialLogin('github')}
                isLoading={isLoading === 'github'}
              >
                {!isLoading && <Github className="w-5 h-5 mr-3 text-slate-900 dark:text-white" />}
                Continue with GitHub
              </Button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#0b1121] px-2 text-slate-400 dark:text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-500 mb-2 ml-1">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 dark:bg-[#020617]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 rounded-lg border border-slate-200 dark:border-white/10 py-3 px-4 pl-10 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading === 'email'}
                disabled={!email}
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500 dark:text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
