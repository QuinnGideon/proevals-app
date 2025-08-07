import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as leaderboardService from '../services/leaderboardService';
import { Loader2, Crown, Trophy, Info, Lock, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SKILL_CATEGORIES } from '../types';
import { SkillCategory } from '../types';

export const LeaderboardPage: React.FC = () => {
    const { user } = useAuth();
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
    const [leaderboard, setLeaderboard] = useState<leaderboardService.LeaderboardEntry[]>([]);
    const [userStatus, setUserStatus] = useState<leaderboardService.UserLeaderboardStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedSkill, setSelectedSkill] = useState<SkillCategory>(SKILL_CATEGORIES[0]);
    const [skillLeaderboard, setSkillLeaderboard] = useState<leaderboardService.LeaderboardEntry[]>([]);
    const [userSkillStatus, setUserSkillStatus] = useState<leaderboardService.UserLeaderboardStatus | null>(null);
    const [skillLoading, setSkillLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const data = leaderboardService.getLeaderboardData(period);
            const status = leaderboardService.getUserLeaderboardStatus(user.id, period);
            setLeaderboard(data);
            setUserStatus(status);
            setLoading(false);
        }
    }, [user, period]);
    
    useEffect(() => {
        if (user && (user.plan === 'Plus' || user.plan === 'Teams')) {
            setSkillLoading(true);
            setTimeout(() => {
                const data = leaderboardService.getSkillLeaderboardData(selectedSkill);
                const status = leaderboardService.getUserSkillLeaderboardStatus(user.id, selectedSkill);
                setSkillLeaderboard(data);
                setUserSkillStatus(status);
                setSkillLoading(false);
            }, 0);
        }
    }, [user, selectedSkill]);

    const renderRank = (rank: number) => {
        if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />;
        if (rank === 2) return <Trophy className="h-6 w-6 text-slate-400" />;
        if (rank === 3) return <Trophy className="h-6 w-6 text-amber-600" />;
        return <span className="text-lg font-semibold text-[var(--color-text-secondary)]">{rank}</span>;
    };
    
    const isPlusUser = user?.plan === 'Plus' || user?.plan === 'Teams';

    return (
        <div className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Crown className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">Leaderboards</h1>
                        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                            See how you stack up against the best.
                        </p>
                    </div>

                    <div className="flex justify-center mb-8 border-b border-[var(--color-border-primary)]">
                        <button onClick={() => setPeriod('weekly')} className={`px-6 py-3 text-lg font-semibold transition-colors ${period === 'weekly' ? 'text-[var(--color-brand-primary)] border-b-2 border-[var(--color-brand-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Weekly</button>
                        <button onClick={() => setPeriod('monthly')} className={`px-6 py-3 text-lg font-semibold transition-colors ${period === 'monthly' ? 'text-[var(--color-brand-primary)] border-b-2 border-[var(--color-brand-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Monthly</button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-[var(--color-brand-primary)]" />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in-up">
                            {userStatus && !userStatus.isRanked && (
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                                    <h3 className="font-semibold text-blue-300">You're not on the leaderboard yet.</h3>
                                    <p className="text-sm text-blue-400">Complete {userStatus.drillsNeeded} more drill{userStatus.drillsNeeded > 1 ? 's' : ''} this {period === 'weekly' ? 'week' : 'month'} to get ranked!</p>
                                </div>
                            )}

                            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-lg overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 font-bold text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-border-primary)]">
                                    <div className="col-span-1 text-center">Rank</div>
                                    <div className="col-span-6">User</div>
                                    <div className="col-span-3 text-center">Avg. Cal. Score</div>
                                    <div className="col-span-2 text-center">Drills</div>
                                </div>
                                <div className="divide-y divide-[var(--color-border-primary)]">
                                    {leaderboard.length > 0 ? leaderboard.map(entry => (
                                        <div key={entry.userId} className={`grid grid-cols-12 gap-4 p-4 items-center transition-all ${entry.userId === user?.id ? 'bg-[var(--color-brand-primary)]/10' : ''}`}>
                                            <div className="col-span-1 flex justify-center items-center h-6 w-6 mx-auto">{renderRank(entry.rank)}</div>
                                            <div className="col-span-6 font-semibold text-[var(--color-text-primary)]">{entry.name} {entry.userId === user?.id && '(You)'}</div>
                                            <div className="col-span-3 text-center text-xl font-bold gradient-text">{entry.avgCalibrationScore}</div>
                                            <div className="col-span-2 text-center text-md text-[var(--color-text-secondary)]">{entry.drillsCompleted}</div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-[var(--color-text-secondary)]">No ranked users for this period yet. Be the first!</div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-4 mt-8 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-primary)] flex items-start space-x-3">
                                <Info className="h-5 w-5 mt-0.5 text-[var(--color-text-secondary)] flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-[var(--color-text-primary)]">How It Works</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Ranking is based on your Average Calibration Score for the period. You must complete at least 5 drills to be eligible. In case of a tie, the user with more completed drills is ranked higher.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-12">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center justify-center gap-3">
                                        <BarChart2 className="h-8 w-8 text-[var(--color-brand-accent)]" />
                                        All-Time Skill Leaderboards
                                    </h2>
                                    <p className="mt-2 text-md text-[var(--color-text-secondary)]">Prove your mastery in a specific competency.</p>
                                </div>
                                
                                {!isPlusUser ? (
                                    <div className="relative group p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-lg">
                                        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative z-10 text-center flex flex-col items-center">
                                                <Lock className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)] group-hover:text-sky-400 transition-colors" />
                                                <h3 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">This is a ProEvals Plus Feature</h3>
                                                <p className="mt-2 max-w-md mx-auto text-[var(--color-text-secondary)]">Upgrade to unlock all-time leaderboards for every skill category and see how your expertise truly ranks against top performers.</p>
                                                <Link to="/pricing" className="mt-6 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-md hover:opacity-90 transition-opacity">
                                                    Upgrade to Plus
                                                </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                                            {SKILL_CATEGORIES.map(skill => (
                                                <button 
                                                    key={skill}
                                                    onClick={() => setSelectedSkill(skill)}
                                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedSkill === skill ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]'}`}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                    
                                        {skillLoading ? (
                                            <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-[var(--color-brand-primary)]" /></div>
                                        ) : (
                                            <div className="animate-fade-in-up">
                                                {userSkillStatus && !userSkillStatus.isRanked && (
                                                    <div className="p-4 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                                                        <h3 className="font-semibold text-blue-300">You're not on this leaderboard yet.</h3>
                                                        <p className="text-sm text-blue-400">Complete {userSkillStatus.drillsNeeded} more '{selectedSkill}' drill{userSkillStatus.drillsNeeded > 1 ? 's' : ''} to get ranked!</p>
                                                    </div>
                                                )}
                    
                                                <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-lg overflow-hidden">
                                                    <div className="grid grid-cols-12 gap-4 p-4 font-bold text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-border-primary)]">
                                                        <div className="col-span-1 text-center">Rank</div>
                                                        <div className="col-span-6">User</div>
                                                        <div className="col-span-3 text-center">Avg. Cal. Score</div>
                                                        <div className="col-span-2 text-center">Drills</div>
                                                    </div>
                                                    <div className="divide-y divide-[var(--color-border-primary)]">
                                                        {skillLeaderboard.length > 0 ? skillLeaderboard.map(entry => (
                                                            <div key={entry.userId} className={`grid grid-cols-12 gap-4 p-4 items-center transition-all ${entry.userId === user?.id ? 'bg-[var(--color-brand-primary)]/10' : ''}`}>
                                                                <div className="col-span-1 flex justify-center items-center h-6 w-6 mx-auto">{renderRank(entry.rank)}</div>
                                                                <div className="col-span-6 font-semibold text-[var(--color-text-primary)]">{entry.name} {entry.userId === user?.id && '(You)'}</div>
                                                                <div className="col-span-3 text-center text-xl font-bold gradient-text">{entry.avgCalibrationScore}</div>
                                                                <div className="col-span-2 text-center text-md text-[var(--color-text-secondary)]">{entry.drillsCompleted}</div>
                                                            </div>
                                                        )) : (
                                                            <div className="p-8 text-center text-[var(--color-text-secondary)]">No one has ranked for '{selectedSkill}' yet. Be the first!</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-center mt-2 text-[var(--color-text-secondary)]">All-time ranking requires at least 10 completed drills in a category.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};