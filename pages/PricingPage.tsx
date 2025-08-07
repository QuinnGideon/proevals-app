
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PRICING_PLANS } from '../constants';
import useScrollAnimate from '../hooks/useScrollAnimate';

const PricingSection: React.FC = () => {
    const [billingCycle, setBillingCycle] = React.useState('monthly');
    const sectionRef = useScrollAnimate<HTMLElement>();

    return (
        <section ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">Find Your Edge</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)]">
                    Start for free. Upgrade when you're ready to accelerate.
                </p>
                <div className="mt-8 flex justify-center items-center space-x-4">
                    <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Bill Monthly</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')} />
                        <div className="w-11 h-6 bg-[var(--color-bg-tertiary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-primary)]"></div>
                    </label>
                    <span className={`text-sm font-medium ${billingCycle === 'annually' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Bill Annually</span>
                    <span className="ml-2 text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Save 20%</span>
                </div>

                <div className="mt-12 grid max-w-md mx-auto gap-8 md:max-w-none md:grid-cols-3">
                    {PRICING_PLANS.map((plan) => (
                        <div key={plan.name} className={`p-8 rounded-2xl border ${plan.recommended ? 'border-[var(--color-brand-primary)]' : 'border-[var(--color-border-primary)]'} bg-[var(--color-bg-secondary)] flex flex-col`}>
                            <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">{plan.name}</h3>
                            <p className="mt-4 text-[var(--color-text-secondary)]">{plan.description}</p>
                            <div className="mt-6">
                                <span className="text-4xl font-extrabold text-[var(--color-text-primary)]">${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}</span>
                                <span className="text-base font-medium text-[var(--color-text-secondary)]">
                                    {plan.name !== 'Free' ? (billingCycle === 'monthly' ? '/month' : '/month, billed annually') : ''}
                                </span>
                            </div>
                            <ul className="mt-8 space-y-4 text-left flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-400 mr-3" />
                                        <span className="text-[var(--color-text-secondary)]">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link to="/signup" className={`w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md ${plan.recommended ? 'text-white bg-[var(--color-brand-primary)] hover:opacity-90' : 'text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)]'} transition`}>
                                    {plan.ctaText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mt-12 max-w-4xl mx-auto text-xs text-[var(--color-text-tertiary)]">
                    <p>
                        Prices are exclusive of applicable taxes, which may be added at checkout depending on your location. 
                        ProEvals is partially powered by large language models. This technology can occasionally make mistakes or generate inaccurate information; all content should be verified for accuracy.
                    </p>
                </div>
            </div>
        </section>
    );
};

const PricingPage: React.FC = () => {
    return (
        <div>
            <PricingSection />
        </div>
    );
};

export default PricingPage;
