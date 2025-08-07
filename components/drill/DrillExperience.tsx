import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Drill } from '../../types';
import { Check, X, BarChart2, User, Users, MessageSquare, Star } from 'lucide-react';

type OptionKey = 'A' | 'B' | 'C' | 'D';

interface DrillExperienceProps {
    drill: Drill;
    onComplete: (drillId: string, selectedOption: OptionKey, confidence: number) => void;
}

const StakeholderQuote: React.FC<{ role: string; quote: string; revealed: boolean; onReveal: () => void }> = ({ role, quote, revealed, onReveal }) => (
    <div className={`p-4 rounded-lg transition-all duration-500 ${revealed ? 'bg-[var(--color-bg-tertiary)]' : 'bg-[var(--color-bg-secondary)]'}`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <h4 className="font-bold text-[var(--color-text-primary)]">{role}</h4>
                {revealed && <Check className="w-5 h-5 text-green-400 animate-pop-in" />}
            </div>
            {!revealed && <button onClick={onReveal} className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]">Reveal</button>}
        </div>
        <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${revealed ? 'max-h-40' : 'max-h-0'}`}>
            <p className="mt-2 text-[var(--color-text-secondary)] italic">"{quote}"</p>
        </div>
    </div>
);

const DrillExperience: React.FC<DrillExperienceProps> = ({ drill, onComplete }) => {
    const [revealedStakeholders, setRevealedStakeholders] = useState([false, false, false]);
    const [confidence, setConfidence] = useState(50);
    const [confidenceLocked, setConfidenceLocked] = useState(false);
    const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        // Reset state when a new drill is loaded
        setRevealedStakeholders([false, false, false]);
        setConfidence(50);
        setConfidenceLocked(false);
        setSelectedOption(null);
        setTimeLeft(300); // Reset timer for new drill
    }, [drill.drill_id]);

    const answerSubmitted = selectedOption !== null;

    // Timer countdown logic
    useEffect(() => {
        if (answerSubmitted) {
            return; // Stop the timer if an answer has been submitted.
        }

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                }
                clearInterval(intervalId); // Stop interval when time reaches 0
                return 0;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [answerSubmitted, drill.drill_id]);

    // Handle timeout
    useEffect(() => {
        if (timeLeft === 0 && !answerSubmitted) {
            onComplete(drill.drill_id, 'A', 0); // Default to incorrect answer on timeout
        }
    }, [timeLeft, answerSubmitted, drill.drill_id, onComplete]);


    const allStakeholdersRevealed = useMemo(() => revealedStakeholders.every(r => r), [revealedStakeholders]);

    const stakeholders = [
        { role: drill.stakeholder_1_role, quote: drill.stakeholder_1_quote },
        { role: drill.stakeholder_2_role, quote: drill.stakeholder_2_quote },
        { role: drill.stakeholder_3_role, quote: drill.stakeholder_3_quote },
    ];

    const optionsMap: Record<OptionKey, { text: string; rationale: string; peerData: number; }> = {
        A: { text: drill.option_a, rationale: drill.rationale_for_a, peerData: drill.peer_data_a },
        B: { text: drill.option_b, rationale: drill.rationale_for_b, peerData: drill.peer_data_b },
        C: { text: drill.option_c, rationale: drill.rationale_for_c, peerData: drill.peer_data_c },
        D: { text: drill.option_d, rationale: drill.rationale_for_d, peerData: drill.peer_data_d },
    };

    const handleSelectOption = (option: OptionKey) => {
        if (answerSubmitted) return;
        setSelectedOption(option);
    };

    const handleComplete = () => {
        if (selectedOption) {
            onComplete(drill.drill_id, selectedOption, confidence);
        }
    };

    const peerDataOrder = useMemo(() => {
        const keys: OptionKey[] = ['A', 'B', 'C', 'D'];
        // Scramble unless answer is submitted
        if (!answerSubmitted) {
            for (let i = keys.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [keys[i], keys[j]] = [keys[j], keys[i]];
            }
        }
        return keys;
    }, [answerSubmitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const timerPortalEl = document.getElementById('timer-portal');
    const timerComponent = !answerSubmitted && timerPortalEl ? createPortal(
        <div className={`fixed top-20 right-4 sm:right-6 lg:right-8 z-50 px-4 py-2 font-mono font-bold text-lg transition-colors duration-300 liquid-glass ${timeLeft <= 30 ? 'text-red-400 animate-pulse-urgent' : 'text-[var(--color-text-primary)] animate-pulse-subtle'}`}>
            {formatTime(timeLeft)}
        </div>,
        timerPortalEl
    ) : null;


    return (
        <>
            {timerComponent}
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                {/* Scenario Section */}
                <div className="p-6 liquid-glass">
                    <span className="text-sm font-semibold text-[var(--color-brand-accent)]">{drill.target_pm_level} &middot; {drill.skill_category}</span>
                    <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{drill.title}</h2>
                    <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{drill.core_scenario_text}</p>
                </div>

                {/* Stakeholders Section */}
                <div className="p-6 liquid-glass space-y-4">
                    <h3 className="font-bold text-xl text-[var(--color-text-primary)] flex items-center"><Users className="mr-2"/>Stakeholder Perspectives</h3>
                    {stakeholders.map((s, i) => (
                        <StakeholderQuote key={i} {...s} revealed={revealedStakeholders[i]} onReveal={() => setRevealedStakeholders(prev => prev.map((r, idx) => i === idx ? true : r))} />
                    ))}
                </div>

                {/* Confidence Slider Section */}
                {allStakeholdersRevealed && (
                    <div className={`p-6 liquid-glass animate-peek`}>
                        <h3 className="font-bold text-xl text-[var(--color-text-primary)] text-center">How confident are you in your decision?</h3>
                        <div className="flex items-center space-x-4 mt-4">
                            <span className="text-sm text-[var(--color-text-secondary)]">0%</span>
                            <input type="range" min="0" max="100" step="1" value={confidence} onChange={e => setConfidence(parseInt(e.target.value))} disabled={confidenceLocked}
                                className="w-full h-2 bg-[var(--color-bg-tertiary)] rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm text-[var(--color-text-secondary)]">100%</span>
                        </div>
                        <div className="text-center mt-4">
                            <span className="text-3xl font-bold gradient-text">{confidence}%</span>
                        </div>
                        {!confidenceLocked &&
                            <button onClick={() => setConfidenceLocked(true)} className="mt-4 w-full sm:w-auto mx-auto block px-6 py-2 bg-[var(--color-brand-primary)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity">
                                Lock Confidence
                            </button>
                        }
                    </div>
                )}
                
                {/* Options & Peer Data Grid */}
                {confidenceLocked && (
                    <div className="grid md:grid-cols-2 gap-8 animate-peek">
                        {/* Options */}
                        <div className="space-y-4">
                            {(Object.keys(optionsMap) as OptionKey[]).map(key => {
                                const isSelected = selectedOption === key;
                                const isCorrect = drill.optimal_choice === key;
                                const isStrategicAlt = drill.strategic_alternative === key;
                                let buttonClass = 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border-transparent';
                                if (answerSubmitted) {
                                    if (isCorrect) {
                                        buttonClass = 'bg-green-500/20 border-green-500';
                                    } else if (isSelected) { // Incorrectly selected
                                        buttonClass = 'bg-red-500/20 border-red-500';
                                    } else if (isStrategicAlt) {
                                        buttonClass = 'bg-sky-500/10 border-sky-500';
                                    }
                                }
                                return (
                                    <button key={key} onClick={() => handleSelectOption(key)} disabled={answerSubmitted}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${buttonClass}`}>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center font-bold mr-3">{key}</div>
                                            <p className="flex-1 text-[var(--color-text-primary)]">{optionsMap[key].text}</p>
                                            {answerSubmitted && isSelected && (isCorrect ? <Check className="text-green-400"/> : <X className="text-red-400"/>)}
                                            {answerSubmitted && !isSelected && isStrategicAlt && <Star className="text-sky-400"/>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Peer Data */}
                        <div className="p-6 liquid-glass">
                            <h3 className="font-bold text-xl text-[var(--color-text-primary)] flex items-center mb-4"><BarChart2 className="mr-2"/>Peer Data</h3>
                            <div className="space-y-3">
                                {peerDataOrder.map(key => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <div className={`font-bold w-4 transition-opacity duration-500 ${answerSubmitted ? 'opacity-100' : 'opacity-0'}`}>{key}:</div>
                                        <div className="flex-1 bg-[var(--color-bg-tertiary)] rounded-full h-6">
                                            <div className="bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] h-6 rounded-full flex items-center justify-end px-2 text-white font-bold text-sm transition-all duration-1000 ease-out"
                                                 style={{ width: `${optionsMap[key].peerData}%` }}>
                                                {optionsMap[key].peerData}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Result & Analysis Section */}
                {answerSubmitted && (
                     <div className="p-6 liquid-glass animate-fade-in-up space-y-6">
                         <div>
                             <h3 className="font-bold text-xl text-[var(--color-text-primary)] flex items-center"><MessageSquare className="mr-2"/>Expert Analysis</h3>
                             <p className="mt-2 text-[var(--color-text-secondary)]">{drill.expert_analysis_text}</p>
                         </div>
                         {drill.strategic_alternative && drill.strategic_alternative_rationale && (
                            <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20">
                                <h4 className="font-bold text-sky-300 flex items-center"><Star className="mr-2"/>Strategic Alternative Rationale (Option {drill.strategic_alternative})</h4>
                                <p className="mt-2 text-sm text-sky-400">{drill.strategic_alternative_rationale}</p>
                            </div>
                         )}
                         <div className="space-y-4">
                             {(Object.keys(optionsMap) as OptionKey[]).map(key => (
                                <div key={key} className={`p-3 rounded-lg ${key === drill.optimal_choice ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                    <h4 className="font-bold text-[var(--color-text-primary)]">Rationale for Option {key}</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{optionsMap[key].rationale}</p>
                                </div>
                             ))}
                         </div>
                         <button onClick={handleComplete} className="mt-4 w-full px-6 py-3 bg-[var(--color-brand-primary)] text-white font-semibold rounded-md hover:opacity-90 transition-opacity">
                            Finish & Continue
                        </button>
                     </div>
                )}
            </div>
        </>
    );
};

export default DrillExperience;