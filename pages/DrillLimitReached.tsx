import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Lock } from 'lucide-react';

interface CooldownTimerProps {
  endTime: string;
  size?: 'small' | 'large';
  onComplete?: () => void;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({ endTime, size = 'large', onComplete }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft as {hours: number, minutes: number, seconds: number};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (Object.keys(newTimeLeft).length === 0 && onComplete) {
                onComplete();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, endTime, onComplete]);

    const hasTimeLeft = timeLeft.hours || timeLeft.minutes || timeLeft.seconds;

    if (!hasTimeLeft) {
        if (size === 'large') {
             return <div className="text-3xl font-mono text-[var(--color-text-primary)]">Unlocking now...</div>;
        }
        return <div className="text-sm font-mono text-[var(--color-text-primary)]">Ready!</div>
    }

    if (size === 'large') {
        return (
            <div className="flex items-end space-x-2 md:space-x-4 text-4xl md:text-5xl font-mono text-[var(--color-text-primary)]">
                <div>
                    <div className="font-bold">{String(timeLeft.hours || 0).padStart(2, '0')}</div>
                    <div className="text-xs tracking-widest uppercase">hours</div>
                </div>
                <div className="font-bold pb-3">:</div>
                <div>
                     <div className="font-bold">{String(timeLeft.minutes || 0).padStart(2, '0')}</div>
                    <div className="text-xs tracking-widest uppercase">minutes</div>
                </div>
                <div className="font-bold pb-3">:</div>
                <div>
                     <div className="font-bold">{String(timeLeft.seconds || 0).padStart(2, '0')}</div>
                    <div className="text-xs tracking-widest uppercase">seconds</div>
                </div>
            </div>
        );
    }

    // Small size for dashboard
    return (
         <div className="flex items-center justify-center space-x-2 text-lg font-mono text-[var(--color-text-primary)]">
            <span>{String(timeLeft.hours || 0).padStart(2, '0')}</span>
            <span className="text-[var(--color-text-secondary)]">:</span>
            <span>{String(timeLeft.minutes || 0).padStart(2, '0')}</span>
            <span className="text-[var(--color-text-secondary)]">:</span>
            <span>{String(timeLeft.seconds || 0).padStart(2, '0')}</span>
        </div>
    );
};


const DrillLimitReached: React.FC<{ cooldownEndTime: string }> = ({ cooldownEndTime }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] py-12 px-4 animate-fade-in-up">
            <div className="relative max-w-lg w-full p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-xl">
                
                <button onClick={() => navigate('/dashboard')} className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors z-20" aria-label="Go to Dashboard">
                    <X size={24} />
                </button>

                <div className="relative z-10 flex flex-col items-center">
                    
                    <Lock className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]" />

                    <h2 className="mt-4 text-3xl font-extrabold text-[var(--color-text-primary)]">Unlock Unlimited Drills</h2>

                    <p className="mt-4 text-lg text-[var(--color-text-secondary)] max-w-md">
                        You've reached your daily limit. Upgrade to ProEvals Plus for unlimited practice, advanced analytics, and your complete drill history.
                    </p>

                    <Link 
                        to="/pricing" 
                        className="mt-8 inline-block w-full max-w-xs px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Upgrade to Plus
                    </Link>

                     <div className="mt-8">
                        <p className="text-sm text-[var(--color-text-tertiary)]">Or wait for your next free drills in:</p>
                        <div className="mt-2">
                            <CooldownTimer endTime={cooldownEndTime} onComplete={() => navigate(0)} size="small" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrillLimitReached;