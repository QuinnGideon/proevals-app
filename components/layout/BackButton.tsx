
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDrills } from '../../contexts/DrillContext';

const BackButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDrillActive } = useDrills();

    // Paths where the back button should NOT be shown
    const noBackPaths = ['/', '/login', '/signup'];

    // Don't show on the homepage, auth pages, or if a drill is active
    if (noBackPaths.includes(location.pathname) || isDrillActive) {
        return null;
    }

    // Don't show if there's no history to go back to (i.e., user opened page in new tab)
    if (window.history.state && window.history.state.idx === 0) {
        return null;
    }

    const goBack = () => navigate(-1);

    return (
        <div className="absolute top-20 left-4 sm:left-6 lg:left-8 z-20">
             <button
                onClick={goBack}
                className="flex items-center gap-2 rounded-full bg-[var(--color-bg-glass)] backdrop-blur-md border border-[var(--color-border-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors group shadow-lg"
                aria-label="Go back to previous page"
            >
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>
        </div>
    );
};

export default BackButton;