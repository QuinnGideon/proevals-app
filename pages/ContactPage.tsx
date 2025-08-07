
import React from 'react';
import { Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
            <Mail className="w-16 h-16 text-[var(--color-brand-accent)]" />
            <h1 className="mt-6 text-5xl font-extrabold text-[var(--color-text-primary)]">Contact Us</h1>
            <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                A contact form will be available here soon. For now, please reach out through our social channels.
            </p>
        </div>
    );
};

export default ContactPage;