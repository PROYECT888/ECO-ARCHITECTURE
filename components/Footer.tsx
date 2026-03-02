
import React from 'react';
import { Page } from '../types';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-dark border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo size="xl" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 max-w-[200px] text-center md:text-left mt-2">Luxury F&B Sustainability Intelligence</span>
          </div>

          <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-gray-400">
            <button onClick={() => onNavigate(Page.HOME)} className="hover:text-brand-gold transition-colors">Privacy</button>
            <button onClick={() => onNavigate(Page.HOME)} className="hover:text-brand-gold transition-colors">Terms</button>
            <button onClick={() => onNavigate(Page.HOME)} className="hover:text-brand-gold transition-colors">Contact</button>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
          Powered by Ecometricus Metrics Engine &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
