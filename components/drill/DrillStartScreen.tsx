
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, LayoutDashboard, Target, BrainCircuit, Zap } from 'lucide-react';
import { User } from '../../types';

interface DrillStartScreenProps {
    user: User | null;
    message?: string;
}

const ActionCard: React.FC<{ to: string; icon: React.ElementType; title: string; children: React.ReactNode; isCta?: boolean }> = ({ to, icon: Icon, title, children, isCta = false }) => {
    const baseClasses = "flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg border transition-all transform hover:-translate-y-1";
    const normalClasses = "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border-primary)] hover:bg-[var(--color-bg-tertiary)]";
    const ctaClasses = "bg-gradient-to-br from-green-500 to-teal-500 text-white border-transparent hover:opacity-90 animate-pulse-subtle";

    return (
        <Link to={to} className={`${baseClasses} ${isCta ? ctaClasses : normalClasses}`}>
            <Icon className="h-8 w-8 mb-2" />
            <span className="font-semibold text-center">{title}</span>
            {children}
        </Link>
    );
};

const DrillStartScreen: React.FC<DrillStartScreenProps> = ({ user, message }) => {
    const isFreeUser = user?.plan === 'Free';

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-12 min-h-[calc(100vh-20rem)] animate-fade-in-up">
            <div className="max-w-2xl">
                <Lightbulb className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                <h2 className="mt-6 text-4xl font-extrabold text-[var(--color-text-primary)]">You're All Caught Up!</h2>
                <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                   {message || "You've completed every available drill. Great job! While new drills are being added, here's what you can do next:"}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                 <ActionCard to="/dashboard" icon={LayoutDashboard} title="Review Your Dashboard">
                    <p className="text-xs mt-1 text-center text-current opacity-80">Check your stats and Skill Heatmap.</p>
                </ActionCard>

                <ActionCard to="/use-cases" icon={Target} title="Explore Use Cases">
                    <p className="text-xs mt-1 text-center text-current opacity-80">See how ProEvals helps at every career stage.</p>
                </ActionCard>
                
                {isFreeUser ? (
                     <ActionCard to="/pricing" icon={Zap} title="Upgrade to Plus" isCta={true}>
                        <p className="text-xs mt-1 font-bold text-center">Unlock unlimited drills & analytics.</p>
                    </ActionCard>
                ) : (
                    <ActionCard to="/about" icon={BrainCircuit} title="Our Mission">
                        <p className="text-xs mt-1 text-center text-current opacity-80">Learn what drives us to build ProEvals.</p>
                    </ActionCard>
                )}
            </div>
        </div>
    );
};

export default DrillStartScreen;
