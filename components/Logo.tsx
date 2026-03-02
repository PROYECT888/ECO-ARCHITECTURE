
import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    withLabel?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withLabel = false }) => {
    const dims = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : 'w-20 h-20';
    // Slightly reduced font sizes so the icon is noticeably larger than the text
    const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg sm:text-xl pt-0.5' : 'text-2xl sm:text-3xl pt-0.5';

    return (
        <div className="flex flex-row items-center gap-3">
            <div className={`${dims} relative flex items-center justify-center`}>
                <img src="/logo.png" alt="Ecometricus Logo" className="w-full h-full object-contain" />
            </div>
            {withLabel && (
                <span className={`font-geometric font-black tracking-widest text-brand-gold uppercase leading-none ${textSize}`}>
                    ECOMETRICUS
                </span>
            )}
        </div>
    );
};

export default Logo;
