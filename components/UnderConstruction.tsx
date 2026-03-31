import React from 'react';
import Logo from './Logo';

const UnderConstruction: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#152E2A] flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-4">
                    <Logo size="xl" />
                </div>

                <h1 className="text-4xl md:text-6xl font-geometric font-black text-[#C8A413] tracking-widest uppercase">
                    Ecometricus
                </h1>

                <div className="h-px w-32 bg-[#C8A413]/30 mx-auto my-6"></div>

                <h2 className="text-xl md:text-2xl font-geometric font-black text-white/90 tracking-widest uppercase">
                    You're Getting Early Access to Something Exciting and New
                </h2>

                <div className="max-w-xl mx-auto space-y-4">
                    <p className="text-sm md:text-base font-body text-white/70 tracking-wide leading-relaxed">
                        Ecometricus is the premier sustainability intelligence platform designed for F&B operations that care about profit, saves AND the planet. We empower you to measure, optimize, and report on ESG metrics that drive operational profit and elevate your brand.
                    </p>
                    
                    <div className="bg-[#1a3833] border border-[#22c55e]/40 rounded-xl p-6 mt-6 shadow-lg">
                        <p className="text-sm md:text-base font-body text-white/90 tracking-wide leading-relaxed mb-4">
                            This 5-minute assessment shows where your F&B operation stands. Plus, see if you qualify for our freemium launch.
                        </p>
                        
                        <div className="flex justify-center mb-6">
                            <span className="inline-block px-3 py-1 bg-[#C8A413]/20 text-[#C8A413] border border-[#C8A413]/50 rounded-full text-xs font-bold uppercase tracking-widest">
                                Only 10 Spots Available
                            </span>
                        </div>

                        <a 
                            href="https://tally.so/r/aQ0ZOZ" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block w-full md:w-auto px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-geometric font-bold tracking-wide uppercase text-sm md:text-base rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-0.5"
                        >
                            Test your F&B Sustainability Knowledge here
                        </a>
                    </div>

                    {/* Failsafe Manual Bypass Button (Only visible on /MVP path) */}
                    {(typeof window !== 'undefined' && /mvp/i.test(window.location.pathname)) && (
                        <div className="pt-8 border-t border-white/5 animate-bounce">
                            <button 
                                onClick={() => {
                                    sessionStorage.setItem('ecometricus_mvp_bypass', 'true');
                                    window.location.href = '/mvp';
                                }}
                                className="group relative px-10 py-5 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-black tracking-widest uppercase text-xs rounded-full transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Click Here to Enter MVP Portal
                                    <div className="w-5 h-5 rounded-full border-2 border-brand-dark/30 border-t-brand-dark animate-spin"></div>
                                </span>
                            </button>
                            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold animate-pulse">
                                Authorized Test Access Path Detected
                            </p>
                        </div>
                    )}
                </div>
                
                <p className="mt-8 text-[8px] font-black uppercase tracking-[0.4em] text-white/10 text-center">
                    Build: V2.0-SYNC-MVP
                </p>
            </div>
        </div>
    );
};

export default UnderConstruction;
