

import React from 'react';
import useScrollAnimate from '../hooks/useScrollAnimate';
import { Rocket, Target, Users, Shuffle, GraduationCap, Lightbulb } from 'lucide-react';

const useCases = [
    {
        icon: Rocket,
        title: "For the Aspiring Product Manager",
        subtitle: "Build Confidence and Accelerate Your Career Growth",
        description: [
            "Are you an Associate PM looking to level up? Move beyond theory and build a strong foundation of practical skills. ProEvals provides a safe environment to practice the daily decisions you face, from bug prioritization to feature scoping.",
            "Sharpen your instincts, get real-time feedback with a personal Calibration Score, and build the verifiable track record you need to prove you're ready for your next promotion. Start making decisions with confidence."
        ]
    },
    {
        icon: Target,
        title: "For the Experienced Professional",
        subtitle: "Sharpen Your Strategy and Ace High-Stakes Interviews",
        description: [
            "For Senior PMs, the challenges are more ambiguous and the stakes are higher. ProEvals is your strategic sparring partner. Use our advanced analytics and Skill Heatmap to identify hidden biases and pinpoint areas for improvement in your strategic thinking.",
            "Prepare for your next leadership role by running targeted drills on complex topics like monetization, market analysis, and technical strategy. Stop just telling recruiters you have great judgment—prove it with a data-backed Verified Performance Report."
        ]
    },
    {
        icon: Users,
        title: "For the Talent-Focused Leader",
        subtitle: "Develop a High-Performance Product Team",
        description: [
            "Tired of hiring based on gut feelings and polished resumes? ProEvals gives you the tools to build and develop an elite product organization. Use our platform for effective team training, providing your PMs with continuous, scalable practice.",
            "With our team analytics, you can get an objective, at-a-glance view of your team's decision-making capabilities, identify skill gaps, and provide targeted coaching. Make smarter hiring decisions and cultivate a culture of elite judgment."
        ]
    },
    {
        icon: Shuffle,
        title: "For the Career Switcher",
        subtitle: "Build a Bridge to Your Next Chapter",
        description: [
            "Trying to break into product management from another field? You have deep expertise, but it's hard to translate that into the language of product. ProEvals is your bridge.",
            "Practice the specific decision-making skills that hiring managers look for and build a portfolio of proof that transcends your resume. Go into your interviews with a new kind of confidence, backed by a Verified Performance Report that demonstrates your product acumen.",
            "Stop telling them you can do the job—show them the data."
        ]
    },
    {
        icon: GraduationCap,
        title: "For the Ambitious Student",
        subtitle: "Gain a Definitive Edge Over the Competition",
        description: [
            "Competing for a top-tier internship or your first PM role after graduation? You're up against hundreds of other smart, talented candidates. ProEvals is your competitive advantage.",
            "While others talk theory, you can build \"synthetic experience\" by tackling hundreds of realistic industry scenarios. Use our advanced analytics to identify your strengths, target your weaknesses, and walk into your interviews prepared to discuss complex trade-offs with a level of nuance that no textbook can teach."
        ]
    },
    {
        icon: Lightbulb,
        title: "For the Early-Stage Founder",
        subtitle: "Sharpen Your Instincts and Build Investor Confidence",
        description: [
            "As a founder, you make dozens of critical decisions a day with limited data and immense pressure. ProEvals is your strategic sounding board.",
            "Use our daily drills as a mental warm-up to practice objective decision-making outside the bubble of your own company. Calibrate your gut instinct against expert benchmarks and gain the clarity you need to lead effectively.",
            "A founder with demonstrably high-calibrated judgment isn't just a better leader—they're a much more fundable one."
        ]
    }
];

interface UseCaseCardProps {
    useCase: typeof useCases[0];
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase }) => {
    const { icon: Icon, title, subtitle, description } = useCase;
    return (
        <div className="group flex flex-col p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:border-[var(--color-brand-primary)]">
            <div className="flex-shrink-0">
                <Icon className="h-10 w-10 text-[var(--color-brand-accent)] mb-4" />
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h3>
                <h4 className="mt-1 text-sm font-semibold text-[var(--color-brand-primary)] tracking-wide uppercase">{subtitle}</h4>
            </div>
            <div className="mt-4 text-[var(--color-text-secondary)] flex-grow space-y-4">
                {description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
        </div>
    );
};

const UseCasesPage: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLDivElement>();

    return (
        <div className="py-20 sm:py-28">
            <div ref={sectionRef} className="container mx-auto px-4 scroll-reveal">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                     <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">Who is ProEvals For?</h1>
                     <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                        ProEvals is designed for ambitious professionals at every stage of their career who understand that judgment is their most valuable asset.
                     </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {useCases.map((useCase, index) => (
                        <UseCaseCard key={index} useCase={useCase} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UseCasesPage;