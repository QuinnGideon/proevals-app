

import React from 'react';
import useScrollAnimate from '../hooks/useScrollAnimate';
import { BrainCircuit } from 'lucide-react';

const AboutUsPage: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLDivElement>();

    const Highlight = ({ children }: { children: React.ReactNode }) => (
        <span className="text-[var(--color-text-brand)] font-semibold">{children}</span>
    );

    return (
        <div className="py-20 sm:py-28">
            <div ref={sectionRef} className="container mx-auto px-4 max-w-3xl scroll-reveal">
                <div className="text-center mb-16">
                     <BrainCircuit className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">About ProEvals</h1>
                    <p className="mt-4 text-lg text-[var(--color-text-secondary)]">Our mission and the motivation behind the platform.</p>
                </div>

                <div className="space-y-8 text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    <p className="text-xl text-[var(--color-text-primary)]">
                        Your entire career can be judged in a brief moment—a single answer in a high-stakes interview, a single decision on a critical project. We think that’s wrong.
                    </p>
                    <p>
                        The resume is a record of the past. Your network is a graph of connections. The interview is often just a test of storytelling. For too long, ambitious professionals have had to operate in the dark, with no flight simulator to practice critical decisions, no mirror to see their own biases, and no objective way to prove what matters most: the <Highlight>quality of their judgment under pressure</Highlight>.
                    </p>
                    <p className="font-bold text-[var(--color-text-primary)] text-center text-2xl py-4">
                        We believe there's a better way.
                    </p>
                    <p>
                        In a world where judgment is the new currency, you deserve a platform that recognizes your true capabilities. That’s why we built ProEvals. It’s not just another learning tool; it's an <Highlight>engine for generating proof of skill</Highlight>. Through daily 5-minute drills, we help you <Highlight>practice, measure, and calibrate</Highlight> your decision-making skills against realistic scenarios and expert benchmarks.
                    </p>
                    <blockquote className="border-l-4 border-[var(--color-brand-primary)] pl-6 my-6 italic text-[var(--color-text-primary)]">
                        Our mission is simple: To <Highlight>transform how professionals are valued by calibrating instinct into a measurable, verifiable skill</Highlight>.
                    </blockquote>
                    <p>
                        ProEvals is created with love by a very small team with a very ambitious goal: to build <Highlight>the system of record for professional judgment</Highlight>. We're glad you're here to join us on this journey.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;