
import React from 'react';
import { Page } from '../types';
import { Leaf, Droplets, Zap, Globe, Users, ArrowRight, Infinity, GlassWater, Sun, Eye } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [engagementAvg, setEngagementAvg] = React.useState('87');

  React.useEffect(() => {
    const saved = localStorage.getItem('ecometricus_cumulative_engagement');
    if (saved) setEngagementAvg(saved);
  }, []);

  const metrics = [
    { value: '5,675', unit: 'kg', label: 'Food Waste Saved', icon: <Leaf className="text-brand-gold" size={32} /> },
    { value: '895', unit: 'Lts', label: 'Water Saved', icon: <Droplets className="text-brand-gold" size={32} /> },
    { value: '13,000', unit: 'kWh', label: 'Energy Reduced', icon: <Zap className="text-brand-gold" size={32} /> },
    { value: '2,890', unit: 'kg', label: 'CO₂ Emissions Avoided', icon: <Globe className="text-brand-gold" size={32} /> },
    { value: `+${engagementAvg}%`, unit: '', label: 'Staff Engagement Avg.', icon: <Users className="text-brand-gold" size={32} /> },
  ];

  const sdgs = [
    {
      id: 12,
      number: "12",
      title: 'Responsible Consumption',
      label: "RESPONSIBLE CONSUMPTION",
      icon: <Infinity className="text-brand-gold" size={48} strokeWidth={1.5} />
    },
    {
      id: 6,
      number: "6",
      title: 'Clean Water',
      label: "CLEAN WATER & SANITATION",
      icon: <GlassWater className="text-brand-gold" size={48} strokeWidth={1.5} />
    },
    {
      id: 7,
      number: "7",
      title: 'Energy Efficiency',
      label: "AFFORDABLE & CLEAN ENERGY",
      icon: <Sun className="text-brand-gold" size={48} strokeWidth={1.5} />
    },
    {
      id: 13,
      number: "13",
      title: 'Climate Action',
      label: "CLIMATE ACTION",
      icon: <Eye className="text-brand-gold" size={48} strokeWidth={1.5} />
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section - Responsive Aspect Ratios: 9:16 (mobile), 4:3 (tablet), 16:9 (desktop) */}
      <section className="relative aspect-[9/16] sm:aspect-[4/3] lg:aspect-video xl:aspect-[21/9] w-full flex items-center overflow-hidden">
        {/* Background Image: New uploaded hero kitchen image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-kitchen.png"
            alt="Chefs working at a kitchen prep table under heat lamps"
            className="w-full h-full object-cover opacity-95 brightness-[0.55] contrast-[1.05]"
          />
          {/* Refined Gradient Overlay for contrast while maintaining brightness */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="space-y-6 sm:space-y-10 max-w-3xl text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 backdrop-blur-xl text-brand-gold text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold">
              F&B Intelligence
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-geometric font-bold leading-[1.1] text-white drop-shadow-2xl">
              Sustainability metrics that drive <span className="text-brand-gold">operational profit.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-100 font-light leading-relaxed max-w-xl drop-shadow-lg">
              Empowering F&B leaders to measure, optimize, and report ESG performance with unmatched luxury precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
              <button
                className="border-2 border-brand-gold text-brand-gold bg-brand-dark/10 backdrop-blur-xl hover:bg-brand-gold hover:text-brand-dark px-10 py-4 rounded-full font-bold transition-all uppercase tracking-widest text-xs shadow-xl"
                onClick={() => window.open("https://calendly.com/urbanseed-ai/ai-bureau-services", "_blank")}
              >
                Book Demo
              </button>
              <button
                className="bg-brand-eco text-brand-dark hover:brightness-110 px-12 py-4 rounded-full font-bold shadow-[0_15px_35px_rgba(119,177,57,0.5)] transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
                onClick={() => onNavigate(Page.SIGN_UP)}
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics - Responsive Grids */}
      <section className="py-20 sm:py-32 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-geometric font-bold text-center mb-16 sm:mb-24 uppercase tracking-[0.3em] text-white">
            Global Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {metrics.map((m, i) => (
              <div key={i} className="metric-card aspect-square p-6 sm:p-8 rounded-2xl bg-brand-dark/40 flex flex-col items-center justify-center text-center group hover:bg-brand-gold/5 transition-all duration-500">
                <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">{m.icon}</div>
                <div className="text-3xl sm:text-4xl font-geometric font-bold text-brand-gold mb-2">
                  {m.value} <span className="text-sm sm:text-lg font-light text-gray-400">{m.unit}</span>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em] font-bold leading-relaxed">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Impact & Global Alignment - Stylized Gold Version */}
      <section className="py-20 sm:py-32 bg-brand-dark/80 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-geometric font-bold text-center mb-20 uppercase tracking-[0.3em] text-white">
            Industry Impact & Global Alignment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 items-start">
            {sdgs.map((sdg) => (
              <div key={sdg.id} className="flex flex-col items-center text-center group">
                {/* SDG Top Label */}
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-2xl font-geometric font-bold text-brand-gold">{sdg.number}</span>
                  <div className="text-[8px] font-black uppercase tracking-widest text-brand-gold text-left leading-[1.2] pt-1">
                    {sdg.label.split(' ').map((word, i) => (
                      <React.Fragment key={i}>{word}<br /></React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Stylized Icon */}
                <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  {sdg.icon}
                </div>

                {/* Bottom Label */}
                <div className="text-sm font-medium text-gray-400 uppercase tracking-widest group-hover:text-brand-gold transition-colors duration-300">
                  SDG {sdg.number} — {sdg.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies - Responsive Snapshots */}
      <section className="py-20 sm:py-32 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 sm:mb-24 gap-8">
            <h2 className="text-3xl sm:text-4xl font-geometric font-bold uppercase tracking-[0.3em] text-center md:text-left">
              Operational <span className="text-brand-gold">Snapshots</span>
            </h2>
            <button className="flex items-center gap-3 text-brand-gold hover:text-white transition-all group font-bold uppercase tracking-[0.2em] text-xs">
              EXPLORE CASE STUDIES <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {[
              { name: "137 PILLARS", location: "Thailand", desc: "Staff participation in sustainable practices increased 23% in 4 months after implementing real-time tracking.", logoBg: "#3a274c" },
              { name: "MAISON LA FLORIDE", location: "France", desc: "Substantial waste reduction leading to €675/month savings per outlet through Mila AI intervention.", logoBg: "#1a3d31" }
            ].map((partner, i) => (
              <div key={i} className="metric-card aspect-video sm:aspect-[21/9] lg:aspect-[16/7] p-8 sm:p-12 rounded-3xl bg-brand-dark/40 flex flex-col sm:flex-row items-center gap-8 sm:gap-12 overflow-hidden group">
                <div className="aspect-square w-24 sm:w-32 bg-white rounded-2xl flex items-center justify-center p-4 shrink-0 shadow-2xl transform group-hover:scale-105 transition-all">
                  <span style={{ color: partner.logoBg }} className="font-bold text-center text-[10px] sm:text-xs leading-tight uppercase font-geometric">{partner.name}</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-brand-gold font-geometric font-bold text-xl mb-2">{partner.name}, {partner.location}</h3>
                  <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed line-clamp-3">{partner.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
