
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const dims = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-16 h-16';
    return (
        <div className={`${dims} relative flex items-center justify-center`}>
            <img src="/logo.png" alt="Ecometricus Logo" className="w-full h-full object-contain" />
        </div>
    );
};

export default Logo;
