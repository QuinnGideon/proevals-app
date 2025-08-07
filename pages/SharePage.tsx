import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import * as dataService from '../services/localDataService';
import { User, UserProgress } from '../types';
import CalibrationScoreCard from '../components/dashboard/CalibrationScoreCard';
import { Loader2, BrainCircuit } from 'lucide-react';
import NotFoundPage from './NotFoundPage';
import MetaTags from '../components/seo/MetaTags';

const calculateStats = (progress: UserProgress) => {
    const validAttempts = progress.attempts.filter(a => typeof a.calibrationScore === 'number' && !isNaN(a.calibrationScore));
    if (validAttempts.length === 0) return { overallScore: 0, totalAttempts: 0 };
    const totalScore = validAttempts.reduce((sum, attempt) => sum + attempt.calibrationScore, 0);
    return {
        overallScore: Math.round(totalScore / validAttempts.length),
        totalAttempts: validAttempts.length,
    };
};

const SharePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<{ overallScore: number; totalAttempts: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            const foundUser = dataService.findUserById(userId);
            if (foundUser) {
                const progress = dataService.getUserProgress(userId);
                setUser(foundUser);
                setStats(calculateStats(progress));
            }
        }
        setLoading(false);
    }, [userId]);

    const title = user && stats ? `${user.name}'s ProEvals Profile | Calibration: ${stats.overallScore}` : 'ProEvals Profile';
    const description = user && stats ? `${user.name} has a calibration score of ${stats.overallScore} on ProEvals. See their verified performance and build your own.` : 'See a verified performance profile from ProEvals.';


    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-[var(--color-brand-primary)]" /></div>;
    }

    if (!user || !stats) {
        return <NotFoundPage />;
    }

    return (
        <>
            <MetaTags
                title={title}
                description={description}
                canonicalPath={location.pathname}
            />
            <div className="py-12 sm:py-20 bg-[var(--color-bg-primary)] min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-8">
                        <div className="w-full">
                            <CalibrationScoreCard
                                score={stats.overallScore}
                                attempts={stats.totalAttempts}
                                userName={user.name}
                                pmLevel={user.pmLevel}
                            />
                        </div>
                        <div className="animate-fade-in-up">
                            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-[var(--color-text-primary)]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center">
                                    <BrainCircuit className="w-5 h-5 text-white" />
                                </div>
                                <span>ProEvals</span>
                            </Link>
                            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">
                                Build Your Own Verifiable Track Record
                            </h1>
                            <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                                Join thousands of professionals sharpening their judgment and proving their skills.
                            </p>
                            <Link to="/signup" className="mt-8 relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[var(--color-brand-primary)] rounded-full overflow-hidden group">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"></span>
                                <span className="absolute w-full h-full duration-500 ease-in-out transform -translate-x-full bg-gradient-to-r from-[var(--color-brand-secondary)] to-[var(--color-brand-accent)] group-hover:translate-x-0"></span>
                                <span className="relative">Start Your Free Drills</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SharePage;