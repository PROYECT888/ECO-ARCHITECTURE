
import React, { useState } from 'react';
import { Page } from '../types';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', page: Page.HOME },
    { label: 'About Us', page: Page.ABOUT },
    { label: 'FAQ', page: Page.FAQ },
    { label: 'Sign Up', page: Page.SIGN_UP },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
        <div
          className="flex flex-col items-center justify-center cursor-pointer group py-2"
          onClick={() => handleNavigate(Page.HOME)}
        >
          <Logo size="lg" />
          <span className="text-xs sm:text-sm font-geometric font-bold tracking-widest text-brand-gold uppercase mt-0.5 group-hover:brightness-110 transition-all">
            Ecometricus
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigate(link.page)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-brand-gold relative py-1 ${currentPage === link.page ? 'text-brand-gold' : 'text-gray-300'
                  }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-gold shadow-[0_0_10px_rgba(200,164,19,0.6)]"></span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleNavigate(Page.SIGN_IN)}
            className="hidden sm:block bg-brand-eco text-brand-dark px-4 sm:px-8 py-2.5 rounded-full font-bold text-xs hover:brightness-110 transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(119,177,57,0.3)] uppercase tracking-widest"
          >
            Log In
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white hover:text-brand-gold transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-brand-dark border-b border-brand-gold/20 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-6">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigate(link.page)}
                className={`text-sm font-bold uppercase tracking-[0.2em] text-left transition-all ${currentPage === link.page ? 'text-brand-gold' : 'text-gray-300'
                  }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate(Page.SIGN_IN)}
              className="bg-brand-eco text-brand-dark w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* Universal Golden Line Separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent shadow-[0_1px_10px_rgba(200,164,19,0.5)]"></div>
    </nav>
  );
};

export default Navbar;
