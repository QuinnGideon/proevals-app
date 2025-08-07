
import React from 'react';
import { Drill } from '../../types';
import { BrainCircuit, Play } from 'lucide-react';

interface DrillReadyScreenProps {
    drill: Drill;
    onStart: () => void;
}

const DrillReadyScreen: React.FC<DrillReadyScreenProps> = ({ drill, onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center animate-fade-in-up">
            <div className="max-w-2xl w-full p-8 sm:p-12 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl">
                <BrainCircuit className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />

                <div className="mt-4">
                    <span className="text-sm font-semibold text-[var(--color-brand-accent)]">{drill.target_pm_level} &middot; {drill.skill_category}</span>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">{drill.title}</h1>
                </div>

                <p className="mt-6 text-lg text-[var(--color-text-secondary)]">
                    When you begin, a 5-minute timer will start. Read the scenario, review stakeholder perspectives, and choose the best course of action.
                </p>

                <div className="mt-10">
                    <button
                        onClick={onStart}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-full hover:opacity-90 transition-opacity"
                    >
                        <Play className="h-6 w-6 mr-3 -ml-2 transition-transform group-hover:scale-110" />
                        Start Drill
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrillReadyScreen;
