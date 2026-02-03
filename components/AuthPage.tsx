
import React, { useState } from 'react';
import { Page, UserProfile } from '../types';
import Logo from './Logo';
import { ArrowLeft, Crown, LayoutDashboard, ChefHat, UserCheck, HelpCircle, CheckCircle2, Lock } from 'lucide-react';

interface AuthPageProps {
  currentView: Page;
  onNavigate: (page: Page) => void;
  onLogin: (user: UserProfile) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ currentView, onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'chef' | 'gm'>('admin');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== verifyPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (isSignUp && !acceptTerms) {
      alert("Please accept the terms and conditions.");
      return;
    }
    setIsLoading(true);

    // Mock Login Logic
    setTimeout(() => {
      setIsLoading(false);
      
      // Training Credentials Logic
      const isSupervisor = email.toLowerCase() === 'jane@gmail.com';
      const isStaff = password.toLowerCase().includes('staff') || email.startsWith('jack');
      
      const mockUser: UserProfile = {
        id: 'mock-123',
        fullName: fullName || (isSupervisor ? 'Jane Smith' : (isStaff ? 'Jack Jay' : 'Alexander Pierce')),
        email: email,
        role: isSupervisor ? 'supervisor' : (isStaff ? 'chef' : 'admin'),
        position: isSupervisor ? 'Outlet Manager' : (isStaff ? 'Chef Prep' : 'GM'),
        outletCode: 'ROY02',
      };

      onLogin(mockUser);
    }, 1200);
  };

  const isSignIn = currentView === Page.SIGN_IN;
  const isSignUp = currentView === Page.SIGN_UP;
  const isForgot = currentView === Page.FORGOT_PASSWORD;

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative pb-20 overflow-x-hidden">
      <div className="absolute top-8 left-4 sm:left-8 z-10">
        <button 
          onClick={() => onNavigate(Page.HOME)}
          className="flex items-center gap-2 border border-white/30 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all backdrop-blur-md"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 pt-24 sm:pt-32">
        <div className="max-w-xl w-full bg-brand-dark border border-brand-gold/30 rounded-[40px] p-8 sm:p-12 shadow-2xl backdrop-blur-sm relative">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="mb-6 transform hover:scale-110 transition-transform">
              <Logo size="lg" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-geometric font-bold text-white mb-4">
              {isSignIn && "Member Access"}
              {isSignUp && "Create Account"}
              {isForgot && "Recovery"}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto">
              Access the operational intelligence core.
            </p>

            <div className="flex gap-4 mt-8 bg-brand-dark/40 p-1.5 rounded-full border border-white/5 w-full">
              <button 
                onClick={() => onNavigate(Page.SIGN_IN)}
                className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isSignIn ? 'bg-brand-gold text-brand-dark shadow-xl' : 'text-gray-400 hover:text-white'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => onNavigate(Page.SIGN_UP)}
                className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isSignUp ? 'bg-brand-gold text-brand-dark shadow-xl' : 'text-gray-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Staff or Admin Name"
                  className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-brand-gold outline-none transition-all placeholder:text-gray-700"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] ml-1">User Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@hotel.com"
                className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-brand-gold outline-none transition-all placeholder:text-gray-700"
                required
              />
            </div>

            {!isForgot && (
              <div className={`grid grid-cols-1 ${isSignUp ? 'sm:grid-cols-2' : ''} gap-4`}>
                <div className="space-y-2 relative">
                  <div className="flex justify-between items-center mr-1">
                    <label className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                      Password
                    </label>
                    {isSignIn && (
                      <button 
                        type="button"
                        onClick={() => onNavigate(Page.FORGOT_PASSWORD)}
                        className="text-[9px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-10 text-white focus:border-brand-gold outline-none transition-all placeholder:text-gray-700"
                      required
                    />
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40" />
                  </div>
                </div>
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] ml-1">Verify Password</label>
                    <input 
                      type="password" 
                      value={verifyPassword}
                      onChange={(e) => setVerifyPassword(e.target.value)}
                      placeholder="Repeat"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-brand-gold outline-none transition-all placeholder:text-gray-700"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-4 pt-2">
                <label className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] ml-1">Your Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'admin', icon: <Crown size={18} />, label: 'Admin' },
                    { id: 'manager', icon: <LayoutDashboard size={18} />, label: 'Manager' },
                    { id: 'chef', icon: <ChefHat size={18} />, label: 'Chef' },
                    { id: 'gm', icon: <UserCheck size={18} />, label: 'GM' }
                  ].map((r) => (
                    <button 
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`flex flex-col items-center justify-center gap-2 py-4 border rounded-2xl transition-all ${role === r.id ? 'bg-brand-gold/20 border-brand-gold text-brand-gold shadow-lg' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                    >
                      {r.icon}
                      <span className="text-[9px] font-black uppercase tracking-tighter">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(isSignUp || isSignIn) && (
              <div className="flex items-start gap-3 py-2">
                <button 
                  type="button"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${acceptTerms ? 'bg-brand-gold border-brand-gold' : 'border-white/20 hover:border-brand-gold'}`}
                >
                  {acceptTerms && <CheckCircle2 size={12} className="text-brand-dark" />}
                </button>
                <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">
                  I accept the <button type="button" className="text-brand-gold hover:underline">Terms</button> and <button type="button" className="text-brand-gold hover:underline">Privacy Policy</button>
                </p>
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-eco text-brand-dark py-5 rounded-full font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center shadow-2xl disabled:opacity-50"
              >
                {isLoading ? "Synchronizing Session..." : "LOG IN"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors">
              <HelpCircle size={14} />
              Support Portal
            </button>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center">
              Ecometricus Metrics Engine &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
