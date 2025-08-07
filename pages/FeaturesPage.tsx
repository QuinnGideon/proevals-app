
import React from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimate from '../hooks/useScrollAnimate';
import { Target, Scale, TrendingUp, CheckCircle } from 'lucide-react';
import InteractiveDrillPreview from '../components/marketing/InteractiveDrillPreview';
import MockLeaderboard from '../components/marketing/MockLeaderboard';
import SkillHeatmapFeature from '../components/marketing/SkillHeatmapFeature';

// --- Page-Specific Components ---

const HeroSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-12 items-center">
                    <div className="md:col-span-2">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                            The Flight Simulator for Product Judgment.
                        </h1>
                        <p className="mt-6 text-lg text-[var(--color-text-secondary)]">
                            ProEvals isn't just about learning; it's about practicing, calibrating, and proving your decision-making skills under pressure. See how it works.
                        </p>
                    </div>
                    <div className="md:col-span-3 min-h-[420px]">
                        <InteractiveDrillPreview />
                    </div>
                </div>
            </div>
        </section>
    );
}

const CorePillarsSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    const pillars = [
        {
            icon: Target,
            title: "Practice with Realistic Drills",
            description: "Face high-fidelity scenarios tailored to your experience level. Get instant feedback with expert analysis and peer performance data."
        },
        {
            icon: Scale,
            title: "Calibrate Your Intuition",
            description: "Go beyond 'right' or 'wrong'. Our unique Calibration Score measures how well your confidence matches your accuracy, a critical skill for any leader."
        },
        {
            icon: TrendingUp,
            title: "Build a Verifiable Track Record",
            description: "Turn your practice into proof. Your Skill Heatmap and performance history create a data-backed record of your judgment to share with hiring managers."
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 sm:py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                     <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Three Pillars of Elite Performance</h2>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {pillars.map(pillar => (
                        <div key={pillar.title} className="p-8 text-center bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-primary)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <pillar.icon className="mx-auto h-12 w-12 text-[var(--color-brand-accent)]" />
                            <h3 className="mt-6 text-xl font-bold text-[var(--color-text-primary)]">{pillar.title}</h3>
                            <p className="mt-2 text-[var(--color-text-secondary)]">{pillar.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const SkillHeatmapSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                 <SkillHeatmapFeature />
            </div>
        </section>
    );
};

const LeaderboardSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="min-h-[400px]">
                        <MockLeaderboard />
                    </div>
                    <div className="md:order-first">
                         <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Compete and Climb the Ranks</h2>
                        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                            Benchmark your skills against a global community of peers. Rise through weekly, monthly, and all-time leaderboards to establish yourself as a top performer.
                        </p>
                        <Link to="/pricing" className="mt-6 inline-block text-lg font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)] transition-colors">
                            Skill-specific leaderboards available on Plus →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

const AllFeaturesSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    const features = [
        "Level-Adaptive Scenarios",
        "Expert Rationale for Every Option",
        "Peer Performance Benchmarks",
        "Personal Calibration Score",
        "Skill-Category Heatmaps",
        "Daily Streaks & Performance History",
        "Spaced Repetition Algorithm",
        "Unlimited Drills (Plus Plan)",
        "Verified Performance Reports (Plus Plan)",
        "Skill-Specific Leaderboards (Plus Plan)",
    ];

    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">A Complete Toolkit for Mastery</h2>
                    <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                        Every feature is designed to provide a clear, objective signal of your professional judgment.
                    </p>
                 </div>
                 <div className="mt-12 max-w-4xl mx-auto">
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                        {features.map(feature => (
                            <div key={feature} className="flex items-center p-2">
                                <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400 mr-3" />
                                <span className="text-[var(--color-text-primary)]">{feature}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </section>
    );
}

const AnimatedButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link to={to} className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[var(--color-brand-primary)] rounded-full overflow-hidden group">
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"></span>
        <span className="absolute w-full h-full duration-500 ease-in-out transform -translate-x-full bg-gradient-to-r from-[var(--color-brand-secondary)] to-[var(--color-brand-accent)] group-hover:translate-x-0"></span>
        <span className="relative">{children}</span>
    </Link>
);

const FinalCtaSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Ready to Prove Your Skills?</h2>
                 <p className="mt-4 max-w-xl mx-auto text-lg text-[var(--color-text-secondary)]">
                    Start with free daily drills and see where you stand. No credit card required.
                </p>
                <div className="mt-10">
                    <AnimatedButton to="/signup">Start Your Free Drills</AnimatedButton>
                </div>
            </div>
        </section>
    );
}

// --- Main FeaturesPage Component ---

const FeaturesPage: React.FC = () => {
    return (
        <div>
            <HeroSection />
            <CorePillarsSection />
            <SkillHeatmapSection />
            <LeaderboardSection />
            <AllFeaturesSection />
            <FinalCtaSection />
        </div>
    );
};

export default FeaturesPage;
