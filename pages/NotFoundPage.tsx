
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
            <AlertTriangle className="w-16 h-16 text-[var(--color-brand-accent)]" />
            <h1 className="mt-6 text-5xl font-extrabold text-[var(--color-text-primary)]">404 - Page Not Found</h1>
            <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link to="/" className="mt-8 px-6 py-3 text-base font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:opacity-90 transition-opacity">
                Go back home
            </Link>
        </div>
    );
};

export default NotFoundPage;