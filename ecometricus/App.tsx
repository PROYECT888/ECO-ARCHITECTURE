
import React, { useState, useEffect } from 'react';
import { Page, UserProfile } from './types';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import FAQPage from './components/FAQPage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import StaffPortal from './components/StaffPortal';
import SupervisorDashboard from './components/SupervisorDashboard';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Force Clear Onboarding Cache as requested
  useEffect(() => {
    const onboardingKeys = ['ecometricus_onboarding', 'ecometricus_tour', 'ecometricus_setup_complete'];
    onboardingKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Force cleared ${key} to reset onboarding state.`);
      }
    });
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin' || user.role === 'manager') {
      setCurrentPage(Page.DASHBOARD);
    } else if (user.role === 'supervisor') {
      setCurrentPage(Page.SUPERVISOR_DASHBOARD);
    } else {
      setCurrentPage(Page.STAFF_PORTAL);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(Page.SIGN_IN);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <LandingPage onNavigate={setCurrentPage} />;
      case Page.ABOUT:
        return <AboutPage />;
      case Page.FAQ:
        return <FAQPage />;
      case Page.DASHBOARD:
        return currentUser ? <DashboardPage user={currentUser} onLogout={handleLogout} /> : <LandingPage onNavigate={setCurrentPage} />;
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

  // Nav is now shown for Admin Dashboard as requested
  const hideNavigation = currentPage === Page.STAFF_PORTAL || currentPage === Page.SUPERVISOR_DASHBOARD;

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
