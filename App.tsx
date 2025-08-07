
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import DrillPage from './pages/DrillPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AboutUsPage from './pages/AboutUsPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ParticleBackground from './components/layout/ParticleBackground';
import { seedInitialData } from './utils/seedData';
import { DrillProvider } from './contexts/DrillContext';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import LegalPage from './pages/LegalPage';
import UseCasesPage from './pages/UseCasesPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import BackButton from './components/layout/BackButton';
import ScrollToTop from './components/layout/ScrollToTop';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { LeaderboardPage } from './pages/LeaderboardPage';
import FrameworksPage from './pages/FrameworksPage';
import SharePage from './pages/SharePage';
import InstallPWA from './components/layout/InstallPWA';
import MetaTags from './components/seo/MetaTags';


interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500/20' : 'bg-red-500/20';
  const borderColor = isSuccess ? 'border-green-500/30' : 'border-red-500/30';
  const textColor = isSuccess ? 'text-green-300' : 'text-red-300';
  const Icon = isSuccess ? CheckCircle : AlertTriangle;

  return (
    <div className={`p-4 rounded-lg flex items-start space-x-3 animate-fade-in-up ${bgColor} ${borderColor} ${textColor} border`}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-grow text-sm">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-current hover:opacity-75 transition-opacity flex-shrink-0">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    return user?.email === 'admin@proevals.com' ? <>{children}</> : <Navigate to="/" />;
}

const metaConfig: Record<string, { title: string, description: string }> = {
    '/': {
      title: 'ProEvals: PM Drills & Calibration to Build Elite Judgment',
      description: 'The training platform for Product Managers. Sharpen decision-making with realistic scenarios, expert analysis, and build a verifiable track record of your product sense.',
    },
    '/about': {
      title: 'About Us | ProEvals',
      description: 'Learn about the mission and motivation behind ProEvals, the platform designed to turn professional judgment into a measurable, verifiable skill.',
    },
    '/features': {
      title: 'Features | ProEvals',
      description: 'Explore the core features of ProEvals, including realistic drills, personal calibration scores, skill heatmaps, and leaderboards to prove your skills.',
    },
    '/pricing': {
      title: 'Pricing Plans | ProEvals',
      description: 'Find the right plan for you. Start for free or upgrade to ProEvals Plus for unlimited drills and advanced analytics.',
    },
    '/faq': {
      title: 'FAQ | ProEvals',
      description: 'Find answers to frequently asked questions about ProEvals, our product management drills, scoring, and subscriptions.',
    },
    '/frameworks': {
      title: 'Product Management Frameworks | ProEvals',
      description: 'A resource library of popular PM frameworks like RICE, Kano, and Jobs to Be Done to help you make smarter decisions.',
    },
    '/use-cases': {
      title: 'Use Cases | ProEvals',
      description: 'Learn how ProEvals helps aspiring PMs, senior leaders, and hiring managers build and benchmark product judgment.',
    },
    '/blog': {
      title: 'Blog | ProEvals',
      description: 'Insights on product management, decision science, and professional growth from the ProEvals team.',
    },
    '/careers': {
      title: 'Careers | ProEvals',
      description: 'Join our mission to build the system of record for professional judgment. See open positions at ProEvals.',
    },
    '/contact': {
      title: 'Contact Us | ProEvals',
      description: 'Get in touch with the ProEvals team for support, feedback, or inquiries.',
    },
    '/login': {
      title: 'Login | ProEvals',
      description: 'Sign in to your ProEvals account to continue your training.',
    },
    '/signup': {
      title: 'Sign Up | ProEvals',
      description: 'Create your ProEvals account and start improving your decision-making skills with free daily drills.',
    },
    '/drill': {
      title: 'Start a Drill | ProEvals',
      description: 'Take a 5-minute drill to test your product management judgment against realistic scenarios.',
    },
    '/dashboard': {
      title: 'Dashboard | ProEvals',
      description: 'View your performance dashboard, including your Calibration Score, Skill Heatmap, and drill history.',
    },
     '/leaderboard': {
      title: 'Leaderboards | ProEvals',
      description: 'See how your product management skills stack up against a global community of peers on the ProEvals leaderboards.',
    },
     '/profile': {
      title: 'Profile & Settings | ProEvals',
      description: 'Manage your ProEvals account, subscription, and profile settings.',
    },
  };

const AppRoutes: React.FC = () => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('fade-in');
    
    // Determine meta tags for the current page
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    const meta = metaConfig[pathname] || null;
    const isSpecialPage = location.pathname.startsWith('/blog/') || location.pathname.startsWith('/share/') || location.pathname.startsWith('/legal/');


    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            setTransitionStage('fade-out');
        }
    }, [location, displayLocation]);

    const isSharePage = location.pathname.startsWith('/share/');

    return (
        <>
            {!isSpecialPage && meta && <MetaTags title={meta.title} description={meta.description} canonicalPath={location.pathname} />}
            <div
                className={`page-transition-wrapper ${transitionStage}`}
                onTransitionEnd={() => {
                    if (transitionStage === 'fade-out') {
                        setDisplayLocation(location);
                        setTransitionStage('fade-in');
                    }
                }}
            >
                <div className="relative z-10 flex flex-col min-h-screen">
                    {!isSharePage && <Header />}
                    <BackButton />
                    <main className="flex-grow">
                        <Routes location={displayLocation}>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/about" element={<AboutUsPage />} />
                            <Route path="/features" element={<FeaturesPage />} />
                            <Route path="/pricing" element={<PricingPage />} />
                            <Route path="/faq" element={<FaqPage />} />
                            <Route path="/frameworks" element={<FrameworksPage />} />
                            <Route path="/legal/:page" element={<LegalPage />} />
                            <Route path="/use-cases" element={<UseCasesPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/blog/:postId" element={<BlogPage />} />
                            <Route path="/careers" element={<CareersPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/login" element={<AuthPage mode="login" />} />
                            <Route path="/signup" element={<AuthPage mode="signup" />} />
                            <Route path="/share/:userId" element={<SharePage />} />
                            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/drill" element={<ProtectedRoute><DrillPage /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                    {!isSharePage && <Footer />}
                </div>
            </div>
        </>
    );
};


function App() {
    useEffect(() => {
        seedInitialData();
    }, []);

    return (
        <HashRouter>
            <AuthProvider>
                <DrillProvider>
                    <ScrollToTop />
                    <ParticleBackground />
                    <AppRoutes />
                    <InstallPWA />
                </DrillProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;