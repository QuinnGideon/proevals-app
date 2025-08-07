
import React from 'react';
import { Trophy, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockUsers = [
  { rank: 1, name: 'Sarah L.', score: 92, trend: 'up' },
  { rank: 2, name: 'Alex T.', score: 89, trend: 'up' },
  { rank: 3, name: 'Chris J.', score: 88, trend: 'down' },
  { rank: 4, name: 'You', score: 85, trend: 'up', isCurrentUser: true },
  { rank: 5, name: 'Priya S.', score: 81, trend: 'down' },
];

const TrendIcon = ({ trend }: { trend: 'up' | 'down' }) => {
    if (trend === 'up') {
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
    }
    return <ArrowDownRight className="h-4 w-4 text-red-400" />;
}

const RankIcon = ({ rank }: { rank: number }) => {
    const colors = ['text-yellow-400', 'text-slate-400', 'text-amber-600'];
    if (rank <= 3) {
        return <Trophy className={`h-5 w-5 ${colors[rank-1]}`} />;
    }
    return <span className="w-5 text-center text-sm font-semibold text-[var(--color-text-secondary)]">{rank}</span>;
}

const MockLeaderboard: React.FC = () => {
    return (
        <div className="p-6 liquid-glass h-full">
            <h3 className="font-bold text-xl text-[var(--color-text-primary)] text-center mb-4">Weekly Leaderboard</h3>
            <div className="space-y-3">
                {mockUsers.map(user => (
                    <div key={user.rank} className={`flex items-center p-3 rounded-lg transition-all ${user.isCurrentUser ? 'bg-[var(--color-brand-primary)]/20 scale-105 shadow-lg' : 'bg-[var(--color-bg-tertiary)]/50'}`}>
                        <div className="w-8">
                            <RankIcon rank={user.rank} />
                        </div>
                        <div className="flex-1 font-semibold text-[var(--color-text-primary)]">{user.name}</div>
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-[var(--color-text-brand)]">{user.score}</span>
                            <TrendIcon trend={user.trend as 'up' | 'down'} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MockLeaderboard;
