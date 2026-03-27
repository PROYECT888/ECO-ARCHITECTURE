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
                    Under Construction
                </h2>

                <p className="text-sm md:text-base font-body text-white/60 max-w-md mx-auto mt-4 tracking-wide leading-relaxed">
                    We are currently building the next generation of luxury F&B sustainability intelligence. Please check back soon.
                </p>

                <div className="pt-6">
                    <a 
                        href="https://tally.so/r/aQ0ZOZ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-geometric font-bold tracking-wide uppercase text-sm md:text-base rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-0.5"
                    >
                        Test your F&B Sustainability Knowledge here
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction;
