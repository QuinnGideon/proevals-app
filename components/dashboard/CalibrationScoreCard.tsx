import React, { useRef, useEffect } from 'react';
import { Target, Share2, Loader2 } from 'lucide-react';

interface CalibrationScoreCardProps {
    score: number;
    attempts: number;
    userName: string;
    pmLevel: string;
    onShareClick?: () => void;
    isSharing?: boolean;
    isNewBest?: boolean;
}

const CalibrationScoreCard: React.FC<CalibrationScoreCardProps> = ({ score, attempts, userName, pmLevel, onShareClick, isSharing, isNewBest }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        card.addEventListener('mousemove', handleMouseMove);

        return () => {
            if (card) {
                card.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    return (
        <div ref={cardRef} className="calibration-card h-full">
            <div className="calibration-card-content p-6 h-full flex flex-col justify-between text-white">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-2xl tracking-tighter">{userName}</h3>
                        <p className="text-sm opacity-70">{pmLevel}</p>
                    </div>
                     {onShareClick ? (
                         <button onClick={onShareClick} disabled={isSharing} className="p-2 rounded-full hover:bg-white/20 transition-colors" title="Share your achievement">
                             {isSharing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 size={20} />}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-sm opacity-80">
                            <Target size={16} />
                            ProEvals Verified
                        </div>
                    )}
                </div>

                {/* Score */}
                <div className="text-center my-4">
                    {isNewBest && (
                        <div className="text-green-300 font-bold text-sm tracking-widest animate-fade-in-up mb-1">NEW PERSONAL BEST!</div>
                    )}
                    <div className="calibration-score-text text-8xl md:text-9xl lg:text-[8rem] leading-none">{score}</div>
                    <p className="text-lg font-medium opacity-90 tracking-widest -mt-2">CALIBRATION</p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end text-sm">
                    <p className="opacity-70">Based on {attempts} drills</p>
                    <div className="font-bold text-lg tracking-wider">PROEVALS</div>
                </div>
            </div>
        </div>
    );
};

export default CalibrationScoreCard;