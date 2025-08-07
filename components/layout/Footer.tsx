

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDrills } from '../../contexts/DrillContext';

const FooterLink: React.FC<{ to: string; children: React.ReactNode; isDrillActive: boolean; }> = ({ to, children, isDrillActive }) => {
    const classes = "text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]";
    if (isDrillActive) {
        return <span className={`${classes} opacity-50 cursor-not-allowed`}>{children}</span>;
    }
    return <Link to={to} className={classes}>{children}</Link>;
};


const Footer: React.FC = () => {
    const { user } = useAuth();
    const { isDrillActive } = useDrills();
    const drillLink = user ? '/drill' : '/signup';
    const leaderboardLink = user ? '/leaderboard' : '/signup';

    return (
        <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-primary)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wider uppercase">Product</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink to="/features" isDrillActive={isDrillActive}>Features</FooterLink></li>
                            <li><FooterLink to="/pricing" isDrillActive={isDrillActive}>Pricing</FooterLink></li>
                            <li><FooterLink to={drillLink} isDrillActive={isDrillActive}>Start a Drill</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink to="/about" isDrillActive={isDrillActive}>About Us</FooterLink></li>
                            <li><FooterLink to="/careers" isDrillActive={isDrillActive}>Careers</FooterLink></li>
                            <li><FooterLink to="/contact" isDrillActive={isDrillActive}>Contact</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wider uppercase">Resources</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink to="/blog" isDrillActive={isDrillActive}>Blog</FooterLink></li>
                            <li><FooterLink to="/faq" isDrillActive={isDrillActive}>FAQ</FooterLink></li>
                            <li><FooterLink to="/frameworks" isDrillActive={isDrillActive}>Frameworks</FooterLink></li>
                            <li><FooterLink to={leaderboardLink} isDrillActive={isDrillActive}>Leaderboards</FooterLink></li>
                            <li><FooterLink to="/use-cases" isDrillActive={isDrillActive}>Use Cases</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink to="/legal/terms" isDrillActive={isDrillActive}>Terms of Service</FooterLink></li>
                            <li><FooterLink to="/legal/privacy" isDrillActive={isDrillActive}>Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/legal/ccpa" isDrillActive={isDrillActive}>CCPA Notice</FooterLink></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-[var(--color-border-primary)] pt-8 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-base text-[var(--color-text-secondary)]">&copy; {new Date().getFullYear()} ProEvals, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;