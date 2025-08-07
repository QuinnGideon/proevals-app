
import React from 'react';
import { FAQ_CONTENT } from '../constants';
import { FaqItem } from '../types';
import useScrollAnimate from '../hooks/useScrollAnimate';

export const AccordionItem: React.FC<FaqItem> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border-b border-[var(--color-border-primary)]">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <span className="text-lg font-medium text-[var(--color-text-primary)]">{question}</span>
                <svg className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[48rem]' : 'max-h-0'}`}>
                <div className="pt-2 pb-4 text-[var(--color-text-secondary)]">{answer}</div>
            </div>
        </div>
    );
};

const FaqSection: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLElement>();
    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">Frequently Asked Questions</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)]">
                        Can't find the answer you're looking for? Reach out to our support team.
                    </p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto">
                    {FAQ_CONTENT.map((category, index) => (
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
        </section>
    );
};

const FaqPage: React.FC = () => {
    return (
        <div>
            <FaqSection />
        </div>
    );
};

export default FaqPage;
