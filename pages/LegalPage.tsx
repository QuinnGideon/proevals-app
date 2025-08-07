
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import useScrollAnimate from '../hooks/useScrollAnimate';
import MetaTags from '../components/seo/MetaTags';

const Highlight: React.FC<{children: React.ReactNode}> = ({ children }) => <strong className="font-semibold text-[var(--color-text-primary)]">{children}</strong>;

const LegalSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <>
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </>
);


const legalContent: { [key: string]: { title: string; description: string; icon: React.ElementType; content: React.ReactNode } } = {
    terms: {
        title: 'Terms of Service',
        description: 'Read the Terms of Service for using the ProEvals platform.',
        icon: FileText,
        content: (
            <>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
                <p>Welcome to ProEvals! These Terms of Service ("Terms") govern your access to and use of the ProEvals website, applications, and services (collectively, the "Service"). Please read these Terms carefully.</p>
                
                <LegalSection title="1. Agreement to Terms">
                    <p>By using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service. If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these terms.</p>
                </LegalSection>

                <LegalSection title="2. Your Account">
                    <p>You are responsible for safeguarding your account and password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                </LegalSection>

                <LegalSection title="3. Subscriptions">
                    <p>ProEvals offers both a free and paid subscription service. By subscribing to a paid plan ("Plus" or "Teams"), you agree to pay the fees specified for that plan. All fees are billed in advance on a monthly or annual basis and are non-refundable.</p>
                    <p>You may cancel your subscription at any time through your account settings. The cancellation will take effect at the end of the current billing period, and you will not be charged for the next period.</p>
                </LegalSection>

                <LegalSection title="4. Content and Ownership">
                     <p><Highlight>Our Content:</Highlight> The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of ProEvals, Inc. and its licensors. Our content is protected by copyright, trademark, and other laws.</p>
                    <p><Highlight>Your Content:</Highlight> You retain ownership of your personal data, such as your drill attempts and performance metrics. By using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and analyze this data to provide and improve the Service, including displaying your performance on leaderboards and providing aggregated peer data.</p>
                </LegalSection>

                <LegalSection title="5. Prohibited Conduct">
                    <p>You agree not to engage in any of the following activities:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Violating any applicable law or regulation.</li>
                        <li>Attempting to reverse-engineer, decompile, or scrape the Service or its data.</li>
                        <li>Using the Service for any fraudulent or illegal purpose.</li>
                        <li>Interfering with or disrupting the integrity or performance of the Service.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="6. Termination">
                    <p>We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    <p>You may terminate your account at any time by using the "Delete Account" feature on your profile page.</p>
                </LegalSection>

                <LegalSection title="7. Disclaimers and Limitation of Liability">
                    <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. ProEvals makes no warranties, expressed or implied, and hereby disclaims all other warranties. The content provided is for training purposes and may contain inaccuracies. All information should be verified for accuracy.</p>
                    <p>In no event shall ProEvals, Inc., nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.</p>
                </LegalSection>
                 <LegalSection title="8. Governing Law">
                    <p>These Terms shall be governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
                </LegalSection>
                 <LegalSection title="9. Contact Information">
                    <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@proevals.com" className="text-[var(--color-brand-primary)]">legal@proevals.com</a>.</p>
                </LegalSection>
            </>
        )
    },
    privacy: {
        title: 'Privacy Policy',
        description: 'Learn how ProEvals collects, uses, and protects your data.',
        icon: Shield,
        content: (
            <>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
                <p>This Privacy Policy describes how ProEvals, Inc. ("we," "us," or "our") collects, uses, and shares information about you when you use our Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
                
                <LegalSection title="1. Information We Collect">
                    <p><Highlight>Information You Provide:</Highlight></p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><Highlight>Account Information:</Highlight> When you register, we collect your name, email address, and your self-identified professional level (e.g., "Product Manager (2-5 Yrs)").</li>
                        <li><Highlight>Performance Data:</Highlight> We collect the choices you make during drills, your stated confidence levels, and the resulting performance metrics like your Calibration Score.</li>
                    </ul>
                    <p className="mt-4"><Highlight>Information We Collect Automatically:</Highlight></p>
                    <ul className="list-disc list-inside space-y-2">
                         <li><Highlight>Usage Data:</Highlight> We may collect information about how you interact with the Service, such as features used and time spent. This application currently stores all data locally on your device; this may change in the future.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="2. How We Use Your Information">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Provide, operate, and maintain our Service.</li>
                        <li>Manage your account and subscription.</li>
                        <li>Calculate your performance metrics, including Calibration Score and streaks.</li>
                        <li>Personalize your experience, for example, by providing drills tailored to your skill level using our spaced repetition algorithm.</li>
                        <li>Display your name and performance on leaderboards if you qualify.</li>
                        <li>Provide anonymized, aggregated peer data to other users for comparison during drills.</li>
                        <li>Communicate with you about your account or our Service.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="3. How We Share Your Information">
                    <p>We do not sell your personal information. We may share information in the following ways:</p>
                     <ul className="list-disc list-inside space-y-2">
                        <li><Highlight>With Other Users:</Highlight> Your name and performance metrics may be visible to other users on leaderboards. If you use the share feature, a public page with your performance card will be created.</li>
                        <li><Highlight>Aggregated Data:</Highlight> We may share aggregated, anonymized data (e.g., average peer choices on a drill) with users. This data cannot be used to identify you.</li>
                        <li><Highlight>For Legal Reasons:</Highlight> We may disclose information if required by law or in response to valid requests by public authorities.</li>
                    </ul>
                </LegalSection>
                
                <LegalSection title="4. Your Rights and Choices">
                    <p>You have rights over your personal information:</p>
                     <ul className="list-disc list-inside space-y-2">
                        <li><Highlight>Access and Update:</Highlight> You can access and update your profile information (such as your PM Level) at any time on your Profile page.</li>
                        <li><Highlight>Deletion:</Highlight> You can delete your account and all associated data at any time via the "Delete Account" function on your Profile page. This action is irreversible.</li>
                    </ul>
                </LegalSection>
                
                <LegalSection title="5. Data Security">
                     <p>We use reasonable measures to help protect your information from loss, theft, misuse, and unauthorized access. However, no electronic transmission or storage is 100% secure.</p>
                </LegalSection>

                <LegalSection title="6. Children's Privacy">
                    <p>Our Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have, we will take steps to delete such information.</p>
                </LegalSection>
                
                 <LegalSection title="7. Contact Us">
                    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@proevals.com" className="text-[var(--color-brand-primary)]">privacy@proevals.com</a>.</p>
                </LegalSection>
            </>
        )
    },
    ccpa: {
        title: 'CCPA Notice',
        description: 'Learn about your rights as a California resident under the CCPA.',
        icon: UserCheck,
        content: (
             <>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
                <p>This notice for California residents supplements the information contained in our Privacy Policy and applies solely to visitors, users, and others who reside in the State of California.</p>
                
                <LegalSection title="1. Your CCPA Rights">
                    <p>The California Consumer Privacy Act (CCPA) provides California residents with specific rights regarding their personal information. You have the right to:</p>
                     <ul className="list-disc list-inside space-y-2">
                        <li><Highlight>Know</Highlight> what personal information is being collected about you.</li>
                        <li><Highlight>Access</Highlight> the personal information we have collected about you.</li>
                        <li><Highlight>Delete</Highlight> your personal information, subject to certain exceptions.</li>
                        <li><Highlight>Not be discriminated against</Highlight> for exercising your CCPA rights.</li>
                    </ul>
                </LegalSection>

                 <LegalSection title="2. How to Exercise Your Rights">
                    <p>You can exercise your right to know and access your information through your account Dashboard and Profile page. You can exercise your right to delete your information by using the "Delete Account" feature on your Profile page.</p>
                    <p>For any other requests or questions regarding your CCPA rights, please contact us at <a href="mailto:privacy@proevals.com" className="text-[var(--color-brand-primary)]">privacy@proevals.com</a>.</p>
                </LegalSection>

                <LegalSection title="3. No Sale of Personal Information">
                    <p>ProEvals does not "sell" your personal information as that term is defined under the CCPA.</p>
                </LegalSection>
            </>
        )
    }
};

const LegalPage: React.FC = () => {
    const { page } = useParams<{ page: string }>();
    const sectionRef = useScrollAnimate<HTMLDivElement>();
    const content = page ? legalContent[page] : null;

    if (!content) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
                <AlertTriangle className="w-16 h-16 text-[var(--color-brand-accent)]" />
                <h1 className="mt-6 text-5xl font-extrabold text-[var(--color-text-primary)]">404 - Document Not Found</h1>
                <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                    The legal document you're looking for doesn't exist.
                </p>
                <Link to="/" className="mt-8 px-6 py-3 text-base font-medium text-white bg-[var(--color-brand-primary)] rounded-md hover:opacity-90 transition-opacity">
                    Go back home
                </Link>
            </div>
        );
    }
    
    const { title, description, icon: Icon, content: pageContent } = content;

    return (
        <>
            <MetaTags
                title={`${title} | ProEvals`}
                description={description}
                canonicalPath={`/legal/${page}`}
            />
            <div className="py-20 sm:py-28">
                <div ref={sectionRef} className="container mx-auto px-4 max-w-3xl scroll-reveal">
                    <div className="text-center mb-16">
                         <Icon className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">{title}</h1>
                    </div>
                     <div className="p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] space-y-6 text-lg text-[var(--color-text-secondary)] leading-relaxed">
                       {pageContent}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LegalPage;