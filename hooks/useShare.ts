import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
import { User, UserProgress } from '../types';
import * as dataService from '../services/localDataService';
import { Loader2, X, Download, Link as LinkIcon, Linkedin, Twitter } from 'lucide-react';
import CalibrationScoreCard from '../components/dashboard/CalibrationScoreCard';

// --- Reusable Share Modal ---
interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageDataUrl: string | null;
    loading: boolean;
    shareUrl: string;
    userName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, imageDataUrl, loading, shareUrl, userName }) => {
    if (!isOpen) return null;

    const twitterText = `Check out my verified performance on ProEvals! Sharpen your own product sense and build a track record of your judgment.`;
    const linkedInText = `I'm using ProEvals to sharpen my product management decision-making skills and build a verifiable track record of my judgment. Here's my current calibration score. #ProductManagement #ProEvals`;

    const modalContent = React.createElement('div',
        { className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-up", onClick: onClose },
        React.createElement('div',
            { className: "bg-[var(--color-bg-secondary)] w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-6", onClick: (e: React.MouseEvent) => e.stopPropagation() },
            React.createElement('div', { className: 'flex justify-between items-start' },
                React.createElement('h2', { className: "text-2xl font-extrabold text-[var(--color-text-primary)]" }, 'Share Your Achievement'),
                React.createElement('button', { onClick: onClose, className: "p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors" },
                    React.createElement(X, { size: 24 })
                )
            ),
            React.createElement('div', { className: 'flex justify-center items-center h-48 bg-[var(--color-bg-primary)] rounded-lg' },
                loading && React.createElement(Loader2, { className: 'h-12 w-12 animate-spin text-[var(--color-brand-primary)]' }),
                imageDataUrl && React.createElement('img', { src: imageDataUrl, alt: `${userName}'s calibration card`, className: 'max-h-full max-w-full object-contain rounded-md' })
            ),
            React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                React.createElement('a', { href: imageDataUrl || '#', download: `${userName}-ProEvals-Card.png`, className: `flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] transition-colors ${!imageDataUrl ? 'opacity-50 cursor-not-allowed' : ''}` },
                    React.createElement(Download, { size: 18 }),
                    'Download Image'
                ),
                React.createElement('button', { onClick: () => navigator.clipboard.writeText(shareUrl), className: 'flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] transition-colors' },
                    React.createElement(LinkIcon, { size: 18 }),
                    'Copy Link'
                )
            ),
            React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement('hr', { className: 'flex-grow border-t border-[var(--color-border-primary)]' }),
                React.createElement('span', { className: 'text-sm text-[var(--color-text-secondary)]' }, 'Share directly'),
                React.createElement('hr', { className: 'flex-grow border-t border-[var(--color-border-primary)]' })
            ),
            React.createElement('div', { className: 'flex justify-center gap-4' },
                React.createElement('a', { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(twitterText)}`, target: '_blank', rel: 'noopener noreferrer', className: 'p-3 rounded-full bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30' },
                    React.createElement(Twitter, { size: 24 })
                ),
                React.createElement('a', { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, target: '_blank', rel: 'noopener noreferrer', className: 'p-3 rounded-full bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/30' },
                    React.createElement(Linkedin, { size: 24 })
                )
            )
        )
    );

    return createPortal(modalContent, document.body);
};


const calculateStats = (progress: UserProgress) => {
    const validAttempts = progress.attempts.filter(a => typeof a.calibrationScore === 'number' && !isNaN(a.calibrationScore));
    if (validAttempts.length === 0) return { overallScore: 0, totalAttempts: 0 };
    const totalScore = validAttempts.reduce((sum, attempt) => sum + attempt.calibrationScore, 0);
    return {
        overallScore: Math.round(totalScore / validAttempts.length),
        totalAttempts: validAttempts.length,
    };
};

export const useShare = (user: User | null) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleShare = useCallback(async () => {
        if (!user || !cardRef.current) return;

        setLoading(true);
        // Ensure modal is open on desktop to show loading state
        if (!navigator.share) {
            setIsModalOpen(true);
        }

        const shareUrl = `${window.location.origin}${window.location.pathname}#/share/${user.id}`;
        
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        setImageDataUrl(dataUrl);

        if (navigator.share) {
            try {
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const file = new File([blob], `${user.name}-ProEvals-Card.png`, { type: blob.type });

                await navigator.share({
                    title: `${user.name}'s ProEvals Profile`,
                    text: `Check out my verified performance on ProEvals. My calibration score is ${calculateStats(dataService.getUserProgress(user.id)).overallScore}.`,
                    url: shareUrl,
                    files: [file]
                });
                 setLoading(false);
            } catch (error) {
                console.error('Error sharing:', error);
                // If native share fails (e.g., user cancels), fall back to modal
                setIsModalOpen(true);
                setLoading(false);
            }
        } else {
            // Fallback for desktop already handled
            setLoading(false);
        }
    }, [user]);

    const stats = user ? calculateStats(dataService.getUserProgress(user.id)) : { overallScore: 0, totalAttempts: 0 };

    const ShareCard = React.createElement('div',
        { style: { position: 'fixed', left: '-9999px', top: '-9999px', width: '450px' } },
        React.createElement('div', { ref: cardRef },
            user && React.createElement(CalibrationScoreCard, {
                score: stats.overallScore,
                attempts: stats.totalAttempts,
                userName: user.name,
                pmLevel: user.pmLevel
            })
        )
    );
    
    const ShareModalComponent = React.createElement(ShareModal, {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        imageDataUrl: imageDataUrl,
        loading: loading,
        shareUrl: `${window.location.origin}${window.location.pathname}#/share/${user?.id}`,
        userName: user?.name || 'User'
    });

    return { handleShare, ShareCard, ShareModalComponent, isSharing: loading };
};