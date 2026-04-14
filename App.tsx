
import React, { useState, useEffect, useCallback } from 'react';
import { Page, UserProfile } from './types';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UnderConstruction from './components/UnderConstruction';
import AboutPage from './components/AboutPage';
import FAQPage from './components/FAQPage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import { supabase } from './lib/supabase';
import StaffPortal from './components/StaffPortal';
import SupervisorDashboard from './components/SupervisorDashboard';
import Footer from './components/Footer';

const App: React.FC = () => {
  const isDev = import.meta.env.DEV;
  
  // 🛡️ Ironclad MVP Path Bypass (Top-Level Constant for Immediate Detection)
  const isMVPPath = typeof window !== 'undefined' && (
                    /mvp/i.test(window.location.pathname) || 
                    /mvp/i.test(window.location.hash) || 
                    /mvp/i.test(window.location.search) ||
                    sessionStorage.getItem('ecometricus_mvp_bypass') === 'true');

  // Persistence: Once unlocked by URL, keep unlocked for session
  if (typeof window !== 'undefined' && !sessionStorage.getItem('ecometricus_mvp_bypass') && isMVPPath) {
    sessionStorage.setItem('ecometricus_mvp_bypass', 'true');
  }

  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleLogin = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin' || user.role === 'manager') {
      setCurrentPage(Page.DASHBOARD);
    } else if (user.role === 'supervisor') {
      setCurrentPage(Page.SUPERVISOR_DASHBOARD);
    } else {
      setCurrentPage(Page.STAFF_PORTAL);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout failed", e);
    } finally {
      // Force a hard reload to completely destroy any lingering React state loops
      // and drop the user back at the clean authentication screen.
      window.location.href = '/';
    }
  }, []);

  const handleUpdateUser = useCallback((updatedFields: Partial<UserProfile>) => {
    setCurrentUser(prev => prev ? { ...prev, ...updatedFields } : null);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        // Show real app if on localhost, or if using the /MVP bypass path (url or session flag).
        // Otherwise, show the Under Construction shield on production.
        return (isMVPPath) ? <LandingPage onNavigate={setCurrentPage} /> : <UnderConstruction />;
      case Page.ABOUT:
        return <AboutPage />;
      case Page.FAQ:
        return <FAQPage />;
      case Page.DASHBOARD:
        return currentUser ? <DashboardPage user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <LandingPage onNavigate={setCurrentPage} />;
      case Page.SUPERVISOR_DASHBOARD:
        return currentUser ? <SupervisorDashboard user={currentUser} onLogout={handleLogout} /> : <LandingPage onNavigate={setCurrentPage} />;
      case Page.STAFF_PORTAL:
        return currentUser ? <StaffPortal user={currentUser} onLogout={handleLogout} /> : <LandingPage onNavigate={setCurrentPage} />;
      case Page.SIGN_IN:
      case Page.SIGN_UP:
      case Page.FORGOT_PASSWORD:
        return <AuthPage currentView={currentPage} onNavigate={setCurrentPage} onLogin={handleLogin} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  // Nav is hidden for portals; for HOME, only hide it if we are showing UnderConstruction (non-dev)
  const hideNavigation = currentPage === Page.STAFF_PORTAL || 
                        currentPage === Page.SUPERVISOR_DASHBOARD || 
                        currentPage === Page.DASHBOARD || 
                        (currentPage === Page.HOME && !isMVPPath);

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white font-body selection:bg-brand-gold/30 selection:text-brand-gold">
      {!hideNavigation && <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className="flex-grow">
        {renderPage()}
      </main>
      {!hideNavigation && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
};

export default App;
