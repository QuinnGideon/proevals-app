

import React, { useState, useEffect, useCallback } from 'react';
import { Drill, PmLevel } from '../types';
import * as drillService from '../services/drillService';
import * as dataService from '../services/localDataService';
import { useAuth } from '../contexts/AuthContext';
import DrillStartScreen from '../components/drill/DrillStartScreen';
import DrillReadyScreen from '../components/drill/DrillReadyScreen';
import DrillExperience from '../components/drill/DrillExperience';
import DrillCompletionScreen, { AttemptResult } from '../components/drill/DrillCompletionScreen';
import DrillLimitReached from './DrillLimitReached';
import { Loader2 } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import { PM_LEVELS } from '../types';
import { useDrills } from '../contexts/DrillContext';

type DrillStatus = 'loading' | 'ready' | 'active' | 'complete' | 'limit_reached' | 'no_more_drills';

const DrillPage: React.FC = () => {
    const { user } = useAuth();
    const { setIsDrillActive } = useDrills();
    const [activeDrill, setActiveDrill] = useState<Drill | null>(null);
    const [status, setStatus] = useState<DrillStatus>('loading');
    const [cooldownEndTime, setCooldownEndTime] = useState<string | null>(null);
    const [hasMoreDrills, setHasMoreDrills] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState<PmLevel | 'My Level'>('My Level');
    const [lastAttemptResult, setLastAttemptResult] = useState<AttemptResult | null>(null);

    const loadNextDrill = useCallback(() => {
        if (user) {
            setStatus('loading');
            
            const progress = dataService.getUserProgress(user.id);
            const dailyStatus = drillService.getDailyDrillStatus(user, progress);

            if (!dailyStatus.isUnlimited && dailyStatus.drillsRemaining <= 0) {
                setCooldownEndTime(dailyStatus.cooldownEndTime);
                setStatus('limit_reached');
                return;
            }
            
            const levelToFetch = selectedLevel === 'My Level' ? undefined : selectedLevel;
            const nextDrill = drillService.getNextDrill(user, levelToFetch);

            if (nextDrill) {
                setActiveDrill(nextDrill);
                setStatus('ready');
            } else {
                setActiveDrill(null);
                setStatus('no_more_drills');
            }
        }
    }, [user, selectedLevel]);

    useEffect(() => {
        loadNextDrill();
    }, [loadNextDrill]);
    
    useEffect(() => {
        const isActive = status === 'active';
        setIsDrillActive(isActive);

        if (isActive) {
            const handleBeforeUnload = (event: BeforeUnloadEvent) => {
                event.preventDefault();
                event.returnValue = 'Are you sure you want to leave? Your drill progress will be lost.';
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [status, setIsDrillActive]);

    const handleDrillComplete = (drill: Drill, selectedOption: 'A' | 'B' | 'C' | 'D', confidence: number) => {
        if (user) {
            const isCorrect = selectedOption === drill.optimal_choice;
            const isStrategicAlt = selectedOption === drill.strategic_alternative;

            let attemptResult: AttemptResult = 'incorrect';
            if (isCorrect) {
                attemptResult = 'correct';
            } else if (isStrategicAlt) {
                attemptResult = 'strategic_alt';
            }
            setLastAttemptResult(attemptResult);

            drillService.recordAttempt(user, {
                drillId: drill.drill_id,
                selectedOption,
                isCorrect,
                confidence,
                attemptedAt: new Date().toISOString(),
            });

            // Check if there are more drills available AFTER this one
            const updatedProgress = dataService.getUserProgress(user.id);
            const newStatus = drillService.getDailyDrillStatus(user, updatedProgress);
            setHasMoreDrills(newStatus.isUnlimited || newStatus.drillsRemaining > 0);
        }
        
        setStatus('complete');
    };
    
    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                        <Loader2 className="h-12 w-12 animate-spin text-[var(--color-brand-primary)]" />
                    </div>
                );
            case 'limit_reached':
                return cooldownEndTime ? <DrillLimitReached cooldownEndTime={cooldownEndTime} /> : null;
            case 'no_more_drills':
                 const levelForMessage = selectedLevel === 'My Level' ? user?.pmLevel : selectedLevel;
                 const message = `You've completed all available drills for the '${levelForMessage}' category. Try another or check back later!`;
                return <DrillStartScreen user={user} message={message} />;
            case 'ready':
                return activeDrill ? (
                    <DrillReadyScreen drill={activeDrill} onStart={() => setStatus('active')} />
                ) : null;
            case 'active':
                 return activeDrill ? (
                     <DrillExperience 
                        drill={activeDrill} 
                        onComplete={(drillId, selectedOption, confidence) => handleDrillComplete(activeDrill, selectedOption, confidence)}
                    />
                 ) : null;
            case 'complete':
                 return activeDrill && lastAttemptResult ? (
                    <div className="py-12 sm:py-16">
                        <div className="container mx-auto px-4">
                             <DrillCompletionScreen
                                drill={activeDrill}
                                attemptResult={lastAttemptResult}
                                onStartNextDrill={loadNextDrill} 
                                hasMoreDrillsToday={hasMoreDrills}
                             />
                        </div>
                    </div>
                 ) : null;
            default:
                return null;
        }
    };
    
    const showSelector = status !== 'active';
    const selectOptions = ['My Level', ...PM_LEVELS];
    const value = selectedLevel === 'My Level' && user ? `My Level (${user.pmLevel})` : selectedLevel;
    const customSelectOptions = selectOptions.map(opt => opt === 'My Level' && user ? `My Level (${user.pmLevel})` : opt);
    
    const handleSelectChange = (displayValue: string) => {
        if (displayValue.startsWith('My Level')) {
            setSelectedLevel('My Level');
        } else {
            setSelectedLevel(displayValue as PmLevel);
        }
    }
    
    return (
        <div className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
                 {user && showSelector && (
                    <div className="max-w-md mx-auto mb-8 text-center animate-fade-in-up">
                        <label htmlFor="level-select" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Select a drill category to practice
                        </label>
                        <CustomSelect 
                            options={customSelectOptions}
                            value={value}
                            onChange={handleSelectChange}
                        />
                    </div>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default DrillPage;