import { useState, FormEvent } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AdminLoginScreenProps {
  onAdminLogin: (email: string, name: string) => void;
  setScreen: (screen: any) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function AdminLoginScreen({
  onAdminLogin,
  setScreen,
  showToast
}: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please enter admin credentials.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Small delay purely for a smoother, more deliberate authentication feel.
    setTimeout(() => {
      if (email.toLowerCase() === 'admin@biharbite.com' && password === 'admin123') {
        showToast('Admin authentication successful!', 'success');
        onAdminLogin(email, 'Mithila Admin Coordinator');
      } else {
        showToast('Invalid administrator credentials.', 'error');
      }
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10 font-sans relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[28rem] h-[28rem] bg-[#7C8464]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors uppercase tracking-wider mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </button>

        <div className="bg-[#FAF8F4] rounded-[36px] p-8 md:p-10 shadow-2xl space-y-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />

          <div className="text-center space-y-3 relative">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto text-white shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Bihar Bite</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Admin Control Portal</h2>
            </div>
            <p className="text-[11px] text-on-surface-variant/65 max-w-xs mx-auto leading-relaxed">
              This is a restricted system access terminal. Only authorized administrators may proceed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Authorized Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@biharbite.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface"
                />
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/60" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Portal Key Code</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3 pl-11 pr-11 text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface"
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/60" />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-3.5 text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4A4A3A] hover:bg-[#343428] text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : (
                <>
                  Authenticate Portal Access
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-on-surface-variant/45 text-center relative">
            Every access attempt to this terminal is monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}