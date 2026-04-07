import React, { useState, useRef } from 'react';
import { Page, UserProfile } from '../types';
import Logo from './Logo';
import { ArrowLeft, Crown, LayoutDashboard, ChefHat, UserCheck, HelpCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [error, setError] = useState<string | null>(null);

  // 🛡️ RATE LIMITING: Prevent email spam
  const lastAttemptTime = useRef<number>(0);
  const attemptCount = useRef<number>(0);
  const RATE_LIMIT_MS = 3000; // 3 seconds between attempts
  const MAX_ATTEMPTS = 3; // Max 3 attempts per session

  const isSignIn = currentView === Page.SIGN_IN;
  const isSignUp = currentView === Page.SIGN_UP;
  const isForgot = currentView === Page.FORGOT_PASSWORD;

  // 🛡️ Rate limiting check
  const canAttemptAuth = (): boolean => {
    const now = Date.now();

    // Check if too many attempts
    if (attemptCount.current >= MAX_ATTEMPTS) {
      setError(`Too many attempts. Please wait 1 minute and refresh the page.`);
      return false;
    }

    // Check if too soon
    if (now - lastAttemptTime.current < RATE_LIMIT_MS) {
      setError(`Please wait ${Math.ceil((RATE_LIMIT_MS - (now - lastAttemptTime.current)) / 1000)} seconds before trying again.`);
      return false;
    }

    lastAttemptTime.current = now;
    attemptCount.current += 1;
    return true;
  };

  const handleSignUp = async () => {
    console.log("🔐 SIGNUP INITIATED - Email:", email);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          auth_origin: 'registration'
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (signUpError) {
      console.error("❌ SIGNUP ERROR:", signUpError);
      throw signUpError;
    }

    console.log("✅ SIGNUP SUCCESS - User ID:", signUpData.user?.id);
    return signUpData.user;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🛡️ Validation checks
    if (isSignUp && password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isSignUp && !acceptTerms) {
      setError("You must accept the Terms and Privacy Policy to continue.");
      return;
    }

    if (isSignUp && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // 🛡️ Rate limiting check
    if (!canAttemptAuth()) {
      return;
    }

    setIsLoading(true);

    try {
      let authUser = null;

      if (isSignIn) {
        console.log("🔑 SIGNIN INITIATED");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        authUser = signInData.user;
        console.log("✅ SIGNIN SUCCESS");
      } else if (isSignUp) {
        authUser = await handleSignUp();

        // ⚠️ WAIT for user to exist before DB operations
        if (!authUser?.id) {
          throw new Error("Signup completed but user ID not returned. Please check your email to confirm.");
        }
      }

      if (!authUser) {
        throw new Error("Authentication failed to retrieve user session.");
      }

      // 1. Identify Identity
      const dynamicFullName = fullName || authUser.user_metadata?.full_name || 'Admin User';

      // 2. Identify Role & Position
      const finalRole = isSignUp ? role : (authUser.user_metadata?.role || 'admin');
      const finalPosition = isSignUp
        ? (role === 'admin' ? 'GM' : role === 'manager' ? 'Outlet Manager' : role === 'chef' ? 'Head Chef' : 'Supervisor')
        : (authUser.user_metadata?.position || (finalRole === 'admin' ? 'GM' : 'Staff'));

      // 🛡️ DATABASE SYNC (Only for new signups)
      if (isSignUp) {
        console.log("💾 SYNCING TO DATABASE...");

        try {
          // ✅ CRITICAL FIX: Save legal_consent properly
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authUser.id,
              full_name: dynamicFullName,
              role: finalRole,
              position: finalPosition,
              legal_consent: false // ✅ Force LegalConsentModal on first login
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error("⚠️ Profile sync warning:", profileError);
            // Don't throw - allow login to proceed
          }

          const { error: settingsError } = await supabase
            .from('company_settings')
            .upsert({
              user_id: authUser.id,
              admin_name: dynamicFullName,
              company_name: "My Organization",
              audit_cycle: 'Monthly'
            }, {
              onConflict: 'user_id'
            });

          if (settingsError) {
            console.error("⚠️ Settings sync warning:", settingsError);
          }

          console.log("✅ DATABASE SYNC COMPLETE");

        } catch (syncErr: any) {
          console.warn("⚠️ Sync Warning (Non-Blocking):", syncErr.message);
          // Continue to login even if sync partially fails
        }
      }

      // 3. ✅ CRITICAL FIX: Pass actual consent value
      console.log("🚀 TRIGGERING LOGIN...");

      try {
        onLogin({
          id: authUser.id,
          fullName: dynamicFullName,
          email: authUser.email || email,
          role: finalRole as any,
          position: finalPosition as any,
          outletCode: authUser.user_metadata?.outlet_code || 'ROY02',
          legal_consent: isSignUp ? false : (authUser.user_metadata?.legal_consent === true),
        });

        console.log("✅ LOGIN TRIGGERED SUCCESSFULLY");

      } catch (uiErr: any) {
        console.error("❌ UI LOGIN CRASH:", uiErr);
        throw new Error("Dashboard initialization failed. Please refresh and try logging in.");
      }

    } catch (err: any) {
      console.error("❌ AUTH ERROR:", err);

      // Provide helpful error messages
      let errorMessage = "Authentication Failed: " + err.message;

      if (err.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account before signing in.";
      } else if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.message?.includes("rate limit")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      }

      setError(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

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

          {/* ✅ ERROR DISPLAY */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

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
                      minLength={6}
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
                      minLength={6}
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

            {/* ✅ CRITICAL: Only require terms for signup */}
            {isSignUp && (
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
                disabled={isLoading || (isSignUp && !acceptTerms)}
                className="w-full bg-brand-eco text-brand-dark py-5 rounded-full font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Synchronizing Session..." : (isSignUp ? "CREATE ACCOUNT" : "LOG IN")}
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
