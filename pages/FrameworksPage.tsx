import React from 'react';
import { FRAMEWORK_CONTENT } from '../constants';
import useScrollAnimate from '../hooks/useScrollAnimate';
import { AccordionItem } from './FaqPage';
import { Library } from 'lucide-react';

const FrameworksPage: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLDivElement>();
    return (
        <div ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <Library className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">Product Management Frameworks</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)]">
                        A collection of popular frameworks and models to help you build better products and make smarter decisions.
                    </p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto">
                    {FRAMEWORK_CONTENT.map((category, index) => (
                        <div key={category.category} className={index > 0 ? 'mt-10' : ''}>
                            <h3 className="text-xl font-semibold text-[var(--color-text-brand)] mb-4">{category.category}</h3>
                            <div className="space-y-4">
                                {category.items.map((item) => (
                                    <AccordionItem key={item.question} question={item.question} answer={item.answer} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FrameworksPage;