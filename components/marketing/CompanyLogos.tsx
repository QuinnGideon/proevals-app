
import React from 'react';

const CompanyLogos: React.FC = () => {
    const logos = [
        { name: 'Nexus', path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
        { name: 'Quantum', path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' },
        { name: 'Apex', path: 'M3 17l9-12 9 12-9 4-9-4z' },
        { name: 'Stellar', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
        { name: 'Momentum', path: 'M3.5 8.5l6-6 6 6-6 6-6-6zM9.5 8.5l6 6' },
        { name: 'Fusion', path: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2 14v-4H6v-2h4V6h4v4h4v2h-4v4h-4z' },
    ];

    return (
        <div className="mt-8">
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
                {logos.map(logo => (
                    <div key={logo.name} className="flex items-center space-x-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={logo.path}></path>
                        </svg>
                        <span className="text-xl font-semibold">{logo.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyLogos;
