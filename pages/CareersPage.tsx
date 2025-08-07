
import React from 'react';
import { Briefcase } from 'lucide-react';

const CareersPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
            <Briefcase className="w-16 h-16 text-[var(--color-brand-accent)]" />
            <h1 className="mt-6 text-5xl font-extrabold text-[var(--color-text-primary)]">Careers</h1>
            <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                We're not hiring right now, but check back soon for opportunities to join our mission!
            </p>
        </div>
    );
};

export default CareersPage;