
import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    withLabel?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withLabel = false }) => {
    const dims = size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24';
    const textSize = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px] sm:text-xs' : 'text-sm sm:text-base';

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`${dims} relative flex items-center justify-center`}>
                <img src="/logo.png" alt="Ecometricus Logo" className="w-full h-full object-contain" />
            </div>
            {withLabel && (
                <span className={`font-geometric font-bold tracking-widest text-brand-gold uppercase mt-0.5 leading-none ${textSize}`}>
                    ECOMETRICUS
                </span>
            )}
        </div>
    );
};

export default Logo;
