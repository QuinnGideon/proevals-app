import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

// Define the event type, as it's not standard in all TS lib versions
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

const InstallPWA: React.FC = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
            if (sessionStorage.getItem('proevals_install_dismissed') !== 'true') {
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        window.addEventListener('appinstalled', () => {
            setIsVisible(false);
            setInstallPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            return;
        }
        await installPrompt.prompt();
        // The userChoice property returns a Promise that resolves to an object with an outcome property
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // The prompt can only be used once.
        setInstallPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('proevals_install_dismissed', 'true');
    };

    if (!isVisible || !installPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 z-[100] animate-fade-in-up" role="dialog" aria-labelledby="install-title">
            <div className="bg-[var(--color-bg-secondary)] rounded-t-2xl sm:rounded-2xl border border-[var(--color-border-primary)] shadow-2xl p-4 max-w-md mx-auto flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                    <p id="install-title" className="font-bold text-[var(--color-text-primary)]">Install ProEvals</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Get the full app experience with offline access.</p>
                </div>
                <button
                    onClick={handleInstallClick}
                    className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
                    aria-label="Install ProEvals App"
                >
                    Install
                </button>
                 <button
                    onClick={handleDismiss}
                    className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    aria-label="Dismiss install prompt"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default InstallPWA;
