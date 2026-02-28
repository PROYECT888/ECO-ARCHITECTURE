import React from 'react';
import Logo from './Logo';

const UnderConstruction: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#152E2A] flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-4">
                    <Logo size="lg" />
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
            </div>
        </div>
    );
};

export default UnderConstruction;
