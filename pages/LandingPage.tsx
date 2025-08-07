


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimate from '../hooks/useScrollAnimate';
import { TESTIMONIALS, FAQ_CONTENT } from '../constants';
import { BrainCircuit, CheckCircle, Scale, TrendingUp, Users, Target, Briefcase } from 'lucide-react';
import InteractiveDrillPreview from '../components/marketing/InteractiveDrillPreview';
import CompanyLogos from '../components/marketing/CompanyLogos';
import SkillHeatmapFeature from '../components/marketing/SkillHeatmapFeature';
import MockCalibrationCard from '../components/marketing/MockCalibrationCard';
import { AccordionItem } from './FaqPage';

const AnimatedButton = ({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) => (
    <Link to={to} className={`relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[var(--color-brand-primary)] rounded-full overflow-hidden group ${className}`}>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"></span>
        <span className="absolute w-full h-full duration-500 ease-in-out transform -translate-x-full bg-gradient-to-r from-[var(--color-brand-secondary)] to-[var(--color-brand-accent)] group-hover:translate-x-0"></span>
        <span className="relative">{children}</span>
    </Link>
);

const HeroSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[var(--color-text-primary)]">
                            Build Elite Judgment. <span className="gradient-text">Prove Your Skills.</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg md:text-xl text-[var(--color-text-secondary)]">
                            ProEvals is a training ground for Product Managers. Sharpen your decision-making with realistic scenarios and build a verifiable track record of your product sense.
                        </p>
                        <div className="mt-10">
                            <AnimatedButton to="/signup">Start Your Free Drills</AnimatedButton>
                        </div>
                    </div>
                    <div className="min-h-[420px]">
                        <InteractiveDrillPreview />
                    </div>
                </div>
            </div>
        </section>
    );
};

const SocialProofSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();

    return (
        <section ref={sectionRef} className="py-20 sm:py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-sm font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">Trusted by professionals at</h2>
                    <CompanyLogos />
                </div>
                <div className="mt-12 testimonial-scroller group">
                    <div className="testimonial-scroller-track">
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, index) => (
                             <div key={index} className="testimonial-card">
                                <p className="text-lg text-[var(--color-text-primary)]">"{testimonial.quote}"</p>
                                <p className="mt-6 font-semibold text-right text-[var(--color-text-brand)]">- {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const HowItWorksSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    const steps = [
        { icon: BrainCircuit, title: "Practice with Daily Drills", description: "Tackle realistic, 5-minute scenarios designed to test your decision-making under pressure." },
        { icon: Scale, title: "Calibrate Your Instincts", description: "Get instant feedback with an expert analysis, peer data, and a personal Calibration Score." },
        { icon: TrendingUp, title: "Prove Your Expertise", description: "Build a verifiable track record of your skills with a personal heatmap and performance analytics." },
    ];
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">A Smarter Way to Level Up</h2>
                    <p className="mt-4 text-lg text-[var(--color-text-secondary)]">The path to elite judgment is a simple, powerful loop.</p>
                </div>
                <div className="mt-16 grid md:grid-cols-3 gap-8 md:gap-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--color-border-primary)] hidden md:block"></div>
                    <div className="absolute top-1/2 left-0 w-full flex justify-around hidden md:block">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]"></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]"></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]"></div>
                    </div>
                    {steps.map((step, index) => (
                        <div key={step.title} className="text-center relative bg-[var(--color-bg-primary)] px-4">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)]/20 to-[var(--color-brand-accent)]/20 mb-4 border-2 border-[var(--color-brand-primary)]/30">
                                <step.icon className="h-8 w-8 text-[var(--color-brand-primary)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{step.title}</h3>
                            <p className="mt-2 text-[var(--color-text-secondary)]">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const KeyFeaturesSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Turn Practice Into Proof</h2>
                        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">Go beyond theory with powerful, data-backed tools that create a verifiable record of your professional judgment.</p>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-6 w-6 text-green-400 mr-3 mt-1" /><span><span className="font-semibold text-[var(--color-text-primary)]">Personal Calibration Score:</span> A unique metric measuring how well your confidence aligns with your accuracy.</span></li>
                            <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-6 w-6 text-green-400 mr-3 mt-1" /><span><span className="font-semibold text-[var(--color-text-primary)]">Skill Heatmap:</span> Pinpoint strengths and weaknesses across core competencies.</span></li>
                            <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-6 w-6 text-green-400 mr-3 mt-1" /><span><span className="font-semibold text-[var(--color-text-primary)]">Leaderboards:</span> Benchmark your skills against a global community of your peers.</span></li>
                        </ul>
                         <AnimatedButton to="/features" className="mt-8 text-base px-6 py-3">Explore All Features</AnimatedButton>
                    </div>
                    <div className="min-h-[350px]">
                         <MockCalibrationCard />
                    </div>
                </div>
            </div>
        </section>
    );
};

const ForEveryStageSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    const stages = [
        { icon: Target, title: "Aspiring & Associate PMs", description: "Build foundational skills and the confidence to get promoted." },
        { icon: Briefcase, title: "Senior & Principal PMs", description: "Sharpen your strategic edge and prepare for leadership roles." },
        { icon: Users, title: "Hiring Managers & Teams", description: "Benchmark talent and cultivate a culture of elite judgment." },
    ];
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">Designed for Every Stage of Your Career</h2>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {stages.map(stage => (
                        <div key={stage.title} className="p-8 text-center bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <stage.icon className="mx-auto h-10 w-10 text-[var(--color-brand-accent)]" />
                            <h3 className="mt-6 text-xl font-bold text-[var(--color-text-primary)]">{stage.title}</h3>
                            <p className="mt-2 text-[var(--color-text-secondary)]">{stage.description}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                     <Link to="/use-cases" className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]">
                        Learn how ProEvals helps you succeed &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
};

const FaqSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    const faqItems = FAQ_CONTENT.flatMap(cat => cat.items).slice(0, 4);
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">Frequently Asked Questions</h2>
                </div>
                <div className="mt-12 max-w-3xl mx-auto">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} question={item.question} answer={item.answer} />
                    ))}
                </div>
                <div className="text-center mt-12">
                     <Link to="/faq" className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]">
                        See all FAQs &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
};

const FinalCtaSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-28 scroll-reveal">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Ready to Prove Your Skills?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)]">
                    Your journey to elite, verifiable judgment starts now. Get instant access to daily drills, a personal Calibration Score, and leaderboards.
                </p>
                <div className="mt-10">
                    <AnimatedButton to="/signup">Start for Free</AnimatedButton>
                </div>
            </div>
        </section>
    );
}

const LandingPage: React.FC = () => {
    return (
        <div>
            <HeroSection />
            <SocialProofSection />
            <HowItWorksSection />
            <KeyFeaturesSection />
            <ForEveryStageSection />
            <FaqSection />
            <FinalCtaSection />
        </div>
    );
};

export default LandingPage;