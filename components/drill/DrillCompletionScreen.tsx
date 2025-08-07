import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, LayoutDashboard, Share2, Loader2, Zap, Bookmark, Star } from 'lucide-react';
import { Drill } from '../../types';
import * as dataService from '../../services/localDataService';
import { useAuth } from '../../contexts/AuthContext';
import { useShare } from '../../hooks/useShare';

export type AttemptResult = 'correct' | 'strategic_alt' | 'incorrect';

interface DrillCompletionScreenProps {
    drill: Drill;
    attemptResult: AttemptResult;
    onStartNextDrill: () => void;
    hasMoreDrillsToday: boolean;
}

const getCompletionContent = (result: AttemptResult) => {
    switch (result) {
        case 'correct':
            return {
                icon: Award,
                color: 'text-[var(--color-brand-accent)]',
                title: 'Drill Complete!',
                message: "Excellent choice. Each drill sharpens your judgment. What's next?",
            };
        case 'strategic_alt':
            return {
                icon: Star,
                color: 'text-sky-400',
                title: 'Strong Alternative!',
                message: 'A solid, defensible choice. Understanding the nuances is key to elite judgment.',
            };
        case 'incorrect':
            return {
                icon: Award,
                color: 'text-[var(--color-text-secondary)]',
                title: 'Drill Complete!',
                message: "Good work. Every attempt is a learning opportunity. What's next?",
            };
    }
};

const DrillCompletionScreen: React.FC<DrillCompletionScreenProps> = ({ drill, attemptResult, onStartNextDrill, hasMoreDrillsToday }) => {
    const { user } = useAuth();
    const { handleShare, ShareCard, ShareModalComponent, isSharing } = useShare(user);
    const [isSaved, setIsSaved] = useState(false);
    
    useEffect(() => {
        if (user) {
            const progress = dataService.getUserProgress(user.id);
            setIsSaved((progress.savedDrills || []).includes(drill.drill_id));
        }
    }, [user, drill.drill_id]);

    const handleSaveToggle = () => {
        if (user) {
            const newSavedState = dataService.toggleSaveDrill(user.id, drill.drill_id);
            setIsSaved(newSavedState);
        }
    };
    
    const isPlusUser = user?.plan === 'Plus' || user?.plan === 'Teams';
    const { icon: Icon, color, title, message } = getCompletionContent(attemptResult);

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-12 min-h-[calc(100vh-20rem)] animate-fade-in-up">
            {ShareCard}
            {ShareModalComponent}
            <div className="max-w-2xl">
                <Icon className={`mx-auto h-16 w-16 ${color}`} />
                <h2 className="mt-6 text-4xl font-extrabold text-[var(--color-text-primary)]">{title}</h2>
                <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                   {message}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                {/* Next Drill or Upgrade CTA */}
                {hasMoreDrillsToday ? (
                     <button
                        onClick={onStartNextDrill}
                        className="flex flex-col items-center justify-center p-6 bg-[var(--color-brand-primary)] text-white rounded-2xl shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-1"
                    >
                        <ArrowRight className="h-8 w-8 mb-2" />
                        <span className="font-semibold">Next Drill</span>
                    </button>
                ) : (
                    <Link
                        to="/pricing"
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-1 animate-pulse-subtle"
                    >
                        <Zap className="h-8 w-8 mb-2" />
                        <span className="font-semibold">Keep Your Streak Going</span>
                        <span className="text-xs mt-1 font-bold">Upgrade for Unlimited Drills</span>
                    </Link>
                )}


                {/* Dashboard */}
                <Link
                    to="/dashboard"
                    className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all transform hover:-translate-y-1"
                >
                    <LayoutDashboard className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Go to Dashboard</span>
                </Link>

                {/* Save Drill Feature */}
                 {isPlusUser ? (
                    <button
                        onClick={handleSaveToggle}
                        className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all transform hover:-translate-y-1"
                    >
                        <Bookmark className={`h-8 w-8 mb-2 transition-colors ${isSaved ? 'fill-current text-[var(--color-brand-primary)]' : ''}`} />
                        <span className="font-semibold">{isSaved ? 'Drill Saved' : 'Save Drill'}</span>
                    </button>
                ) : (
                    <Link
                        to="/pricing"
                        className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all transform hover:-translate-y-1"
                    >
                        <Bookmark className="h-8 w-8 mb-2 text-[var(--color-text-tertiary)]" />
                        <span className="font-semibold">Save Drills (Plus)</span>
                    </Link>
                )}

                {/* Share Achievement */}
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all transform hover:-translate-y-1 disabled:opacity-50"
                >
                    {isSharing ? <Loader2 className="h-8 w-8 mb-2 animate-spin" /> : <Share2 className="h-8 w-8 mb-2" />}
                    <span className="font-semibold">Share Achievement</span>
                </button>
            </div>
        </div>
    );
};

export default DrillCompletionScreen;