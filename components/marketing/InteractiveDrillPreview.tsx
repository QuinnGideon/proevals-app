
import React from 'react';
import { Check, MessageSquare } from 'lucide-react';

const sampleDrill = {
  title: "Launch Timing Dilemma",
  scenario: "A minor UI bug was just found. Marketing campaign starts next week. Delaying will misalign with marketing, but launching with the bug could lead to user complaints.",
  options: {
    A: "Launch on time with the bug, fast-follow patch next week.",
    B: "Delay the launch by one week to fix the bug.",
    C: "Launch on time, but disable the part of the UI with the bug.",
    D: "Push the team to work overtime to fix the bug before launch.",
  },
  optimalChoice: 'A' as 'A' | 'B' | 'C' | 'D',
  rationale: "This respects the marketing timeline and business momentum while having a clear, low-risk plan to address the quality issue promptly."
};

const DrillOption: React.FC<{
    optionKey: 'A' | 'B' | 'C' | 'D';
    text: string;
    isCorrect: boolean;
}> = ({ optionKey, text, isCorrect }) => {
    
    return (
        <div 
            className={`
                w-full text-left p-2
                flex items-start
                drill-preview-option 
                ${isCorrect ? 'correct' : 'incorrect'}
            `}
        >
            <div className="flex-shrink-0 w-6 font-bold text-[var(--color-text-secondary)] text-left mr-3">{optionKey}</div>
            <p className="flex-1 text-[var(--color-text-primary)] text-sm">{text}</p>
            {isCorrect && (
                <Check className="text-green-400 ml-2 drill-preview-icon" />
            )}
        </div>
    );
};


const InteractiveDrillPreview: React.FC = () => {
    return (
        <div className="p-6 liquid-glass animate-drill-preview-cycle h-full flex flex-col justify-between">
            <div>
                <span className="text-xs font-semibold text-[var(--color-brand-accent)]">Associate PM &middot; Execution</span>
                <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text-primary)]">{sampleDrill.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{sampleDrill.scenario}</p>
            </div>
            
            <div className="mt-4 space-y-2">
                {(Object.keys(sampleDrill.options) as Array<keyof typeof sampleDrill.options>).map(key => (
                    <DrillOption 
                        key={key} 
                        optionKey={key}
                        text={sampleDrill.options[key]}
                        isCorrect={key === sampleDrill.optimalChoice}
                    />
                ))}
            </div>

            <div className="drill-preview-rationale mt-4 pt-4 border-t border-[var(--color-border-primary)]/50">
                <h4 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center"><MessageSquare className="w-4 h-4 mr-2"/>Expert Rationale</h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{sampleDrill.rationale}</p>
            </div>
        </div>
    );
};

export default InteractiveDrillPreview;