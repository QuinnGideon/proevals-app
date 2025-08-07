import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import * as dataService from '../services/localDataService';
import * as drillService from '../services/drillService';
import { SKILL_CATEGORIES } from '../types';
import { SkillCategory, UserProgress, Drill, DrillAttempt, PmLevel, User } from '../types';
import { Loader2, Target, BarChart2, Zap, BrainCircuit, Flame, Crown, Infinity, Clock, Lock, TrendingUp, X, Check, Users, MessageSquare, Bookmark, History, LayoutDashboard, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CooldownTimer } from './DrillLimitReached';
import CalibrationScoreCard from '../components/dashboard/CalibrationScoreCard';
import CustomSelect from '../components/CustomSelect';
import { useShare } from '../hooks/useShare';

type OptionKey = 'A' | 'B' | 'C' | 'D';

// --- Reusable Plus Feature Lock ---
const PlusFeatureLock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="relative group p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-lg animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 text-center flex flex-col items-center">
            <Lock className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)] group-hover:text-sky-400 transition-colors" />
            <h3 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">{title}</h3>
            <div className="mt-2 max-w-md mx-auto text-[var(--color-text-secondary)]">
                {children}
            </div>
            <Link to="/pricing" className="mt-6 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-md hover:opacity-90 transition-opacity">
                Upgrade to Plus
            </Link>
        </div>
    </div>
);


// --- Drill Review Modal ---
interface DrillReviewModalProps {
    drillData: { drill: Drill, attempt?: DrillAttempt };
    onClose: () => void;
}
const DrillReviewModal: React.FC<DrillReviewModalProps> = ({ drillData, onClose }) => {
    const { drill, attempt } = drillData;

    const optionsMap: Record<OptionKey, { text: string; rationale: string; peerData: number; }> = {
        A: { text: drill.option_a, rationale: drill.rationale_for_a, peerData: drill.peer_data_a },
        B: { text: drill.option_b, rationale: drill.rationale_for_b, peerData: drill.peer_data_b },
        C: { text: drill.option_c, rationale: drill.rationale_for_c, peerData: drill.peer_data_c },
        D: { text: drill.option_d, rationale: drill.rationale_for_d, peerData: drill.peer_data_d },
    };

    const modalContent = (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={onClose}>
            <div className="bg-[var(--color-bg-secondary)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 space-y-6" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-sm font-semibold text-[var(--color-brand-accent)]">{drill.target_pm_level} &middot; {drill.skill_category}</span>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">{drill.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scenario */}
                <div>
                     <p className="text-lg text-[var(--color-text-secondary)]">{drill.core_scenario_text}</p>
                </div>
                
                 {/* Stakeholders */}
                <div className="p-4 bg-[var(--color-bg-primary)] rounded-lg space-y-3">
                    <h3 className="font-bold text-lg text-[var(--color-text-primary)] flex items-center"><Users className="mr-2"/>Stakeholder Perspectives</h3>
                    {[drill.stakeholder_1_quote, drill.stakeholder_2_quote, drill.stakeholder_3_quote].map((quote, i) => (
                        <p key={i} className="text-sm text-[var(--color-text-secondary)] italic">"{quote}"</p>
                    ))}
                </div>

                {/* User's Performance */}
                {attempt && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-[var(--color-bg-primary)] rounded-lg">
                            <p className="text-sm text-[var(--color-text-secondary)]">Your Choice</p>
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{attempt.selectedOption}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-primary)] rounded-lg">
                            <p className="text-sm text-[var(--color-text-secondary)]">Your Confidence</p>
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{attempt.confidence}%</p>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-primary)] rounded-lg">
                            <p className="text-sm text-[var(--color-text-secondary)]">Calibration Score</p>
                            <p className="text-2xl font-bold gradient-text">{attempt.calibrationScore}</p>
                        </div>
                    </div>
                )}
                
                {/* Options and Rationales */}
                <div className="space-y-4">
                     <h3 className="font-bold text-lg text-[var(--color-text-primary)] flex items-center"><MessageSquare className="mr-2"/>Options & Rationales</h3>
                     {(Object.keys(optionsMap) as OptionKey[]).map(key => {
                        const isOptimal = drill.optimal_choice === key;
                        const isStrategicAlt = drill.strategic_alternative === key;
                        const wasSelected = attempt?.selectedOption === key;

                        let borderClass = 'border-transparent';
                        if (isOptimal) borderClass = 'border-green-500/50';
                        else if (isStrategicAlt) borderClass = 'border-sky-500/50';
                        
                        if (wasSelected && !isOptimal && !isStrategicAlt) borderClass = 'border-red-500/50';

                        return (
                            <div key={key} className={`p-4 rounded-lg border-2 ${borderClass} bg-[var(--color-bg-primary)]`}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center font-bold mr-3">{key}</div>
                                    <p className="flex-1 font-semibold text-[var(--color-text-primary)]">{optionsMap[key].text}</p>
                                    {isOptimal && <Check className="text-green-400 ml-2 flex-shrink-0"/>}
                                    {isStrategicAlt && <span className="ml-2 text-xs font-bold text-sky-400 bg-sky-500/20 px-2 py-1 rounded-full">STRATEGIC ALT</span>}
                                    {wasSelected && !isOptimal && !isStrategicAlt && <X className="text-red-400 ml-2 flex-shrink-0"/>}
                                </div>
                                <p className="mt-2 text-sm text-[var(--color-text-secondary)] pl-9">{optionsMap[key].rationale}</p>
                            </div>
                        );
                     })}
                </div>

                {drill.strategic_alternative_rationale && (
                    <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <h4 className="font-bold text-sky-300 flex items-center"><Star className="mr-2"/>Strategic Alternative Rationale (Option {drill.strategic_alternative})</h4>
                        <p className="mt-2 text-sm text-sky-400">{drill.strategic_alternative_rationale}</p>
                    </div>
                )}
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};


// --- Dashboard Sub-Components ---

const OverviewTab: React.FC<{ 
    user: User; 
    allTimeStats: any;
    filteredStats: any;
    progress: UserProgress; 
    drillStatus: any; 
    chartData: any; 
    onRefresh: () => void;
    filterLevel: PmLevel | 'All Time';
    setFilterLevel: (level: PmLevel | 'All Time') => void;
    availableLevels: string[];
    newBests: {
        overallScore: boolean;
        longestDailyStreak: boolean;
        skillScores: Record<SkillCategory, boolean>;
    };
}> = ({ user, allTimeStats, filteredStats, progress, drillStatus, chartData, onRefresh, filterLevel, setFilterLevel, availableLevels, newBests }) => {
    const { handleShare, ShareCard, ShareModalComponent, isSharing } = useShare(user);
    const navigate = useNavigate();
    const isFreeUser = user?.plan === 'Free';

    if (allTimeStats.totalAttempts === 0) {
        return (
             <div className="py-12 sm:py-16 text-center">
                <BrainCircuit className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-primary)]">Welcome, {user?.name}!</h1>
                <p className="mt-2 text-lg text-[var(--color-text-secondary)]">Your journey to elite judgment starts now.</p>
                 <div className="mt-8">
                    <button onClick={() => navigate('/drill')} className="px-8 py-4 text-lg font-bold text-white bg-[var(--color-brand-primary)] rounded-full hover:opacity-90 transition-opacity animate-pulse-subtle">
                        Take Your First Drill
                    </button>
                </div>
            </div>
        );
    }
    
    const canTakeDrill = drillStatus.isUnlimited || drillStatus.drillsRemaining > 0;
    const getScoreColor = (score: number) => {
        if (score >= 85) return 'bg-green-500';
        if (score >= 70) return 'bg-sky-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const AnalyticsChart: React.FC<{ data: { date: Date; score: number }[] }> = ({ data }) => {
        if (data.length < 2) return <div className="flex items-center justify-center h-full text-center text-[var(--color-text-secondary)]"><p>Complete at least two drills in this view to see your performance chart.</p></div>;
        const width = 500, height = 250, margin = { top: 20, right: 20, bottom: 40, left: 35 }, innerWidth = width - margin.left - margin.right, innerHeight = height - margin.top - margin.bottom;
        const minDate = data[0].date, maxDate = data[data.length - 1].date;
        const xScale = (date: Date) => { const timeRange = maxDate.getTime() - minDate.getTime(); if (timeRange === 0) return margin.left; return margin.left + ((date.getTime() - minDate.getTime()) / timeRange) * innerWidth; };
        const yScale = (score: number) => margin.top + innerHeight - (score / 100) * innerHeight;
        const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.date)},${yScale(d.score)}`).join(' ');
        const areaPath = `${linePath} L${xScale(maxDate)},${height - margin.bottom} L${xScale(minDate)},${height - margin.bottom} Z`;
        const yAxisTicks = [0, 25, 50, 75, 100], xAxisTicks = [minDate, data[Math.floor(data.length / 2)].date, maxDate];
        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-label="Calibration score over time chart">
                <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity={0.4}/><stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity={0}/></linearGradient><linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="var(--color-brand-secondary)" /><stop offset="100%" stopColor="var(--color-brand-accent)" /></linearGradient></defs>
                {yAxisTicks.map(tick => (<line key={tick} x1={margin.left} y1={yScale(tick)} x2={width - margin.right} y2={yScale(tick)} stroke="var(--color-border-primary)" strokeWidth="0.5" strokeDasharray="3,3"/>))}
                <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="var(--color-border-secondary)" strokeWidth="1" /><line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="var(--color-border-secondary)" strokeWidth="1" />
                {yAxisTicks.map(tick => (<text key={tick} x={margin.left - 8} y={yScale(tick)} dy="0.32em" textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{tick}</text>))}
                {xAxisTicks.map((tick, i) => (<text key={i} x={xScale(tick)} y={height - margin.bottom + 15} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">{tick.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</text>))}
                <path d={areaPath} fill="url(#areaGradient)" /><path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {data.map((d, i) => (<circle key={i} cx={xScale(d.date)} cy={yScale(d.score)} r="3" fill="var(--color-bg-primary)" stroke="var(--color-brand-primary)" strokeWidth="1.5" />))}
            </svg>
        );
    };

    return (
        <div className="animate-fade-in-up">
            {ShareCard}
            {ShareModalComponent}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-h-[350px]">
                    <CalibrationScoreCard
                        score={allTimeStats.overallScore}
                        attempts={allTimeStats.totalAttempts}
                        userName={user.name}
                        pmLevel={user.pmLevel}
                        onShareClick={handleShare}
                        isSharing={isSharing}
                        isNewBest={newBests.overallScore}
                    />
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] flex flex-col justify-between flex-grow">
                         <div>
                            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center"><Zap className="mr-2"/>Daily Drills</h2>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Drills remaining for today:</p>
                            <div className="my-4 text-center">
                            {drillStatus.isUnlimited ? <Infinity className="h-12 w-12 mx-auto text-[var(--color-brand-primary)]"/> : <span className="text-5xl font-extrabold text-[var(--color-text-primary)]">{drillStatus.drillsRemaining}<span className="text-3xl text-[var(--color-text-secondary)]">/3</span></span>}
                            </div>
                        </div>
                        <button onClick={() => canTakeDrill && navigate('/drill')} disabled={!canTakeDrill} className="w-full mt-4 px-4 py-3 bg-[var(--color-brand-primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed">{canTakeDrill ? 'Take a Drill' : 'Limit Reached'}</button>
                    </div>
                    {!canTakeDrill && !drillStatus.isUnlimited ? (
                        <div className="p-6 bg-gradient-to-br from-sky-600/30 to-indigo-600/30 rounded-2xl border border-[var(--color-brand-primary)]/50 flex flex-col items-center justify-center text-center animate-fade-in-up flex-grow">
                            <Zap className="h-8 w-8 text-yellow-300" /><p className="font-bold text-[var(--color-text-primary)] mt-2">Keep the Momentum Going</p><p className="text-sm text-[var(--color-text-secondary)]">Next drills unlock in:</p>
                            {drillStatus.cooldownEndTime && (<div className="my-2"><CooldownTimer endTime={drillStatus.cooldownEndTime} size="small" onComplete={onRefresh} /></div>)}
                            <Link to="/pricing" className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">Upgrade for Unlimited Drills</Link>
                        </div>
                    ) : (
                       <div className="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] flex flex-col justify-between flex-grow">
                           <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center"><Flame className="mr-2 text-orange-400"/>Your Streaks</h2>
                           <div className="flex justify-around items-end mt-4 text-center">
                                <div><p className="text-4xl font-extrabold text-[var(--color-text-primary)]">{progress.currentDailyStreak}</p><p className="text-xs text-[var(--color-text-secondary)]">Daily Streak</p></div>
                                <div>
                                    <p className="text-4xl font-extrabold text-[var(--color-text-primary)] flex items-center justify-center gap-2">
                                        {progress.longestDailyStreak}
                                        {newBests.longestDailyStreak && <span title="New Best!" className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse-indicator"></span>}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-secondary)]">Longest Daily</p>
                                </div>
                                 <div><p className="text-4xl font-extrabold text-[var(--color-text-primary)]">{progress.currentStreak}</p><p className="text-xs text-[var(--color-text-secondary)]">Session</p></div>
                           </div>
                       </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                     <div>
                         <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Deeper Analytics</h2>
                         <p className="mt-1 text-md text-[var(--color-text-secondary)]">Filter your performance by career stage.</p>
                     </div>
                     <div className="w-full sm:w-60">
                         <CustomSelect
                            options={availableLevels}
                            value={filterLevel}
                            onChange={(val) => setFilterLevel(val as PmLevel | 'All Time')}
                         />
                     </div>
                 </div>

                 {/* Heatmap Section */}
                 <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center mt-6"><BarChart2 className="mr-2"/>Skill Heatmap</h3>
                 <p className="mt-1 text-md text-[var(--color-text-secondary)]">Your average calibration score by skill category for the selected period.</p>
                <div className="relative">
                    <div className={`mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isFreeUser ? 'blur-md select-none pointer-events-none' : ''}`}>
                       {SKILL_CATEGORIES.map(category => {
                            const skill = filteredStats.skillScores[category];
                            const score = isFreeUser ? Math.floor(Math.random() * (90 - 65 + 1)) + 65 : skill.score;
                            return (
                            <div key={category} className="p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-primary)]">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                                        {category}
                                        {newBests.skillScores[category] && <span title="New Best!" className="w-2 h-2 bg-green-400 rounded-full animate-pulse-indicator"></span>}
                                    </h3>
                                    <span className="text-sm text-[var(--color-text-secondary)]">{isFreeUser ? '??' : skill.count} drills</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2"><span className="text-2xl font-bold text-[var(--color-text-primary)] w-8">{score}</span><div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-2.5"><div className={`${getScoreColor(score)} h-2.5 rounded-full transition-all duration-500`} style={{width: `${score}%`}}></div></div></div>
                            </div>);
                       })}
                    </div>
                    {isFreeUser && <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/80 backdrop-blur-sm rounded-2xl mt-6"><PlusFeatureLock title="Unlock Your Skill Heatmap"><p>Upgrade to ProEvals Plus to reveal your detailed scores and track progress.</p></PlusFeatureLock></div>}
                </div>

                {/* Performance Chart Section */}
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center mt-8"><TrendingUp className="mr-2"/>Performance Over Time</h3>
                <p className="mt-1 text-md text-[var(--color-text-secondary)]">Track your calibration score history for the selected period.</p>
                <div className="relative mt-6">
                    <div className={`${isFreeUser ? 'blur-md select-none pointer-events-none' : ''}`}>
                        <div className="p-2 sm:p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] min-h-[280px] flex items-center justify-center">
                            {isFreeUser ? <AnalyticsChart data={[{ date: new Date(Date.now() - 10*864e5), score: 65 },{ date: new Date(Date.now() - 8*864e5), score: 72 },{ date: new Date(Date.now() - 5*864e5), score: 70 },{ date: new Date(Date.now() - 3*864e5), score: 78 },{ date: new Date(Date.now() - 1*864e5), score: 82 }]} /> : <AnalyticsChart data={chartData} />}
                        </div>
                    </div>
                    {isFreeUser && <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/80 backdrop-blur-sm rounded-2xl"><PlusFeatureLock title="Unlock Performance Analytics"><p>Upgrade to see the full picture and identify trends in your decision-making.</p></PlusFeatureLock></div>}
                </div>
            </div>
        </div>
    );
}

const DrillHistoryList: React.FC<{ attempts: DrillAttempt[], drills: Drill[], onReview: (data: any) => void }> = ({ attempts, drills, onReview }) => {
    const drillMap = new Map(drills.map(d => [d.drill_id, d]));
    const sortedAttempts = [...attempts].sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());

    return (
        <div className="space-y-4 animate-fade-in-up">
            {sortedAttempts.map((attempt) => {
                const drill = drillMap.get(attempt.drillId);
                if (!drill) return null;
                const isStrategicAlt = drill.strategic_alternative === attempt.selectedOption;
                return (
                    <div key={attempt.attemptedAt} className="grid grid-cols-12 gap-4 items-center p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-primary)]">
                        <div className="col-span-12 sm:col-span-6">
                            <p className="font-semibold text-[var(--color-text-primary)]">{drill.title}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">{new Date(attempt.attemptedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="col-span-6 sm:col-span-2 text-center">
                            {attempt.isCorrect ? <Check className="h-6 w-6 text-green-400 mx-auto" /> : (isStrategicAlt ? <Star className="h-6 w-6 text-sky-400 mx-auto" /> : <X className="h-6 w-6 text-red-400 mx-auto" />)}
                        </div>
                        <div className="col-span-6 sm:col-span-2 text-center text-xl font-bold gradient-text">{attempt.calibrationScore}</div>
                        <div className="col-span-12 sm:col-span-2 text-center">
                            <button onClick={() => onReview({ drill, attempt })} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-[var(--color-bg-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border-secondary)]">Review</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SavedDrillsList: React.FC<{ savedDrillIds: string[], drills: Drill[], attempts: DrillAttempt[], onReview: (data: any) => void }> = ({ savedDrillIds, drills, attempts, onReview }) => {
    const savedDrills = drills.filter(d => savedDrillIds.includes(d.drill_id));
    
    if (savedDrills.length === 0) {
        return <div className="text-center py-12 text-[var(--color-text-secondary)]">You haven't saved any drills yet. Complete a drill and bookmark it to review later!</div>;
    }

    return (
         <div className="space-y-4 animate-fade-in-up">
            {savedDrills.map((drill) => {
                const lastAttempt = [...attempts].filter(a => a.drillId === drill.drill_id).sort((a,b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0];
                return (
                    <div key={drill.drill_id} className="grid grid-cols-12 gap-4 items-center p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-primary)]">
                        <div className="col-span-12 sm:col-span-9">
                            <p className="font-semibold text-[var(--color-text-primary)]">{drill.title}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">{drill.skill_category}</p>
                        </div>
                        <div className="col-span-12 sm:col-span-3 text-center">
                            <button onClick={() => onReview({ drill, attempt: lastAttempt })} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-[var(--color-bg-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border-secondary)]">Review</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const calculateStatsForAttempts = (attempts: DrillAttempt[], allDrills: Drill[]) => {
    const validAttempts = attempts.filter(a => typeof a.calibrationScore === 'number' && !isNaN(a.calibrationScore));
    const drillMap = new Map(allDrills.map(d => [d.drill_id, d]));
    const totalScore = validAttempts.reduce((sum, attempt) => sum + attempt.calibrationScore, 0);

    const skillScoresData = SKILL_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: { totalScore: 0, count: 0 } }), {} as Record<SkillCategory, { totalScore: number; count: number }>);
    validAttempts.forEach(attempt => {
        const drill = drillMap.get(attempt.drillId);
        if (drill && skillScoresData[drill.skill_category]) {
            skillScoresData[drill.skill_category].totalScore += attempt.calibrationScore;
            skillScoresData[drill.skill_category].count++;
        }
    });

    return {
        overallScore: validAttempts.length > 0 ? Math.round(totalScore / validAttempts.length) : 0,
        totalAttempts: validAttempts.length,
        skillScores: Object.fromEntries(Object.entries(skillScoresData).map(([cat, data]) => [cat, { score: data.count > 0 ? Math.round(data.totalScore / data.count) : 0, count: data.count }]))
    };
};


// --- Main Dashboard Page ---
const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [drillStatus, setDrillStatus] = useState<drillService.DailyDrillStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [allDrills, setAllDrills] = useState<Drill[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'saved'>('overview');
    const [reviewingDrill, setReviewingDrill] = useState<{ drill: Drill, attempt?: DrillAttempt } | null>(null);
    
    const [filterLevel, setFilterLevel] = useState<PmLevel | 'All Time'>('All Time');
    const [availableLevels, setAvailableLevels] = useState<string[]>(['All Time']);

    const [historyFilter, setHistoryFilter] = useState<'30d' | 'all'>('30d');
    
    const [newBests, setNewBests] = useState({
        overallScore: false,
        longestDailyStreak: false,
        skillScores: SKILL_CATEGORIES.reduce((acc, cat) => ({...acc, [cat]: false }), {} as Record<SkillCategory, boolean>)
    });

    const isPlusUser = user?.plan === 'Plus' || user?.plan === 'Teams';

    useEffect(() => {
        if (user) {
            setLoading(true);
            const userProgress = dataService.getUserProgress(user.id);
            const drills = dataService.getDrillBank();
            const dailyStatus = drillService.getDailyDrillStatus(user, userProgress);
            
            const levels = new Set(userProgress.attempts.map(a => a.pmLevelAtAttempt).filter(Boolean));
            setAvailableLevels(['All Time', ...Array.from(levels) as string[]]);

            setAllDrills(drills);
            setProgress(userProgress);
            setDrillStatus(dailyStatus);
            setLoading(false);
        }
    }, [user, refreshKey]);

    const { allTimeStats, filteredStats, filteredChartData } = useMemo(() => {
        if (!progress || !allDrills) return { allTimeStats: null, filteredStats: null, filteredChartData: [] };

        const allStats = calculateStatsForAttempts(progress.attempts, allDrills);

        const filteredAttempts = filterLevel === 'All Time'
            ? progress.attempts
            : progress.attempts.filter(a => a.pmLevelAtAttempt === filterLevel);
        
        const fStats = calculateStatsForAttempts(filteredAttempts, allDrills);
        const fChartData = [...filteredAttempts]
            .sort((a, b) => new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime())
            .map(attempt => ({ date: new Date(attempt.attemptedAt), score: attempt.calibrationScore }));

        return { allTimeStats: allStats, filteredStats: fStats, filteredChartData: fChartData };
    }, [progress, allDrills, filterLevel]);
    
    useEffect(() => {
        if (!user || !progress || !allTimeStats) return;

        const lastSeen = progress.lastSeenStats;

        const currentSkillScores = Object.entries(allTimeStats.skillScores).reduce((acc, [cat, data]) => {
            acc[cat as SkillCategory] = data.score;
            return acc;
        }, {} as Record<SkillCategory, number>);

        if (lastSeen) {
            const bests = {
                overallScore: allTimeStats.overallScore > (lastSeen.overallScore || 0),
                longestDailyStreak: progress.longestDailyStreak > (lastSeen.longestDailyStreak || 0),
                skillScores: Object.keys(currentSkillScores).reduce((acc, cat) => {
                    const category = cat as SkillCategory;
                    acc[category] = currentSkillScores[category] > (lastSeen.skillScores?.[category] ?? -1);
                    return acc;
                }, {} as Record<SkillCategory, boolean>)
            };
            setNewBests(bests);
        }

        return () => {
            if (user && progress && allTimeStats) {
                 const currentSkillScoresForSave = Object.entries(allTimeStats.skillScores).reduce((acc, [cat, data]) => {
                    acc[cat as SkillCategory] = data.score;
                    return acc;
                }, {} as Record<SkillCategory, number>);

                const updatedProgress = { 
                    ...progress, 
                    lastSeenStats: {
                        overallScore: allTimeStats.overallScore,
                        longestDailyStreak: progress.longestDailyStreak,
                        skillScores: currentSkillScoresForSave
                    }
                };
                
                if (JSON.stringify(updatedProgress.lastSeenStats) !== JSON.stringify(progress.lastSeenStats)) {
                     dataService.saveUserProgress(user.id, updatedProgress);
                }
            }
        };
    }, [user, progress, allTimeStats]);

    const filteredHistoryAttempts = useMemo(() => {
        if (!progress) return [];
        if (historyFilter === 'all') {
            return progress.attempts;
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return progress.attempts.filter(a => new Date(a.attemptedAt) >= thirtyDaysAgo);
    }, [progress, historyFilter]);


    if (loading || !filteredStats || !allTimeStats || !progress || !drillStatus) {
        return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Loader2 className="h-12 w-12 animate-spin text-[var(--color-brand-primary)]" /></div>;
    }

    const tabButtonClasses = (tabName: string) => `px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${activeTab === tabName ? 'text-[var(--color-brand-primary)] border-b-2 border-[var(--color-brand-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`;

    return (
        <div className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
                    <p className="mt-2 text-lg text-[var(--color-text-secondary)]">Welcome back, {user?.name}! Here's your performance summary.</p>
                    
                    <div className="mt-8 border-b border-[var(--color-border-primary)] flex space-x-2 sm:space-x-4">
                        <button onClick={() => setActiveTab('overview')} className={tabButtonClasses('overview')}><LayoutDashboard size={18}/> Overview</button>
                        <button onClick={() => setActiveTab('history')} className={tabButtonClasses('history')}><History size={18}/> Drill History</button>
                        <button onClick={() => setActiveTab('saved')} className={tabButtonClasses('saved')}><Bookmark size={18}/> Saved Drills</button>
                    </div>

                    <div className="mt-8">
                        {activeTab === 'overview' && (
                            <OverviewTab 
                                user={user} 
                                allTimeStats={allTimeStats} 
                                filteredStats={filteredStats} 
                                progress={progress} 
                                drillStatus={drillStatus} 
                                chartData={filteredChartData} 
                                onRefresh={() => setRefreshKey(k => k + 1)}
                                filterLevel={filterLevel}
                                setFilterLevel={setFilterLevel}
                                availableLevels={availableLevels}
                                newBests={newBests}
                            />
                        )}
                        {activeTab === 'history' && (
                            isPlusUser ? (
                                <div className="animate-fade-in-up">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                                        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Your Drill History</h3>
                                        <div className="flex items-center gap-2 rounded-full p-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] self-start sm:self-center">
                                            <button
                                                onClick={() => setHistoryFilter('30d')}
                                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${historyFilter === '30d' ? 'bg-[var(--color-brand-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'}`}
                                            >
                                                Last 30 Days
                                            </button>
                                            <button
                                                onClick={() => setHistoryFilter('all')}
                                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${historyFilter === 'all' ? 'bg-[var(--color-brand-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'}`}
                                            >
                                                All Time
                                            </button>
                                        </div>
                                    </div>
                                    {filteredHistoryAttempts.length > 0 ? (
                                        <DrillHistoryList attempts={filteredHistoryAttempts} drills={allDrills} onReview={setReviewingDrill} />
                                    ) : (
                                        <div className="text-center py-12 text-[var(--color-text-secondary)]">
                                            {historyFilter === '30d'
                                                ? "You haven't completed any drills in the last 30 days."
                                                : "No drills completed yet. Go take one!"
                                            }
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <PlusFeatureLock title="Unlock Your Full Drill History">
                                    <p>Track every decision you make. Upgrade to see your complete history and analyze your long-term performance.</p>
                                </PlusFeatureLock>
                            )
                        )}
                        {activeTab === 'saved' && (
                            isPlusUser ?
                                <SavedDrillsList savedDrillIds={progress.savedDrills} drills={allDrills} attempts={progress.attempts} onReview={setReviewingDrill} /> :
                                <PlusFeatureLock title="Unlock Saved Drills">
                                    <p>Bookmark insightful drills and build a personal library of scenarios to review anytime.</p>
                                </PlusFeatureLock>
                        )}
                    </div>
                </div>
            </div>
            {reviewingDrill && <DrillReviewModal drillData={reviewingDrill} onClose={() => setReviewingDrill(null)} />}
        </div>
    );
};

export default DashboardPage;