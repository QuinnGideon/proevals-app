import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useDrills } from '../../contexts/DrillContext';
import { Sun, Moon, LogOut, LayoutDashboard, User, Menu, X, BrainCircuit } from 'lucide-react';
import EasterEgg from '../special/EasterEgg';

const Logo: React.FC<{ isDrillActive: boolean }> = ({ isDrillActive }) => {
    const content = (
        <>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">ProEvals</span>
        </>
    );

    if (isDrillActive) {
        return <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">{content}</div>
    }

    return (
        <Link to="/" className="flex items-center space-x-2">
            {content}
        </Link>
    );
};

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { isDrillActive } = useDrills();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Easter Egg State
    const [logoClickCount, setLogoClickCount] = useState(0);
    const [easterEggVisible, setEasterEggVisible] = useState(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navLinkClasses = "px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all";
    const activeNavLinkClasses = "text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)]";

    const navLinks = (
        <>
            {isDrillActive ? (
                <>
                    <span className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Drills</span>
                    <span className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Dashboard</span>
                    <span className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Leaderboards</span>
                    {user?.email === 'admin@proevals.com' && <span className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Admin</span>}
                </>
            ) : (
                <>
                    <NavLink to="/drill" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Drills</NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Dashboard</NavLink>
                    <NavLink to="/leaderboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Leaderboards</NavLink>
                    {user?.email === 'admin@proevals.com' && (
                        <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Admin</NavLink>
                    )}
                </>
            )}
        </>
    );

    const handleLogoClick = () => {
        if (isDrillActive) return;

        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }

        const newClickCount = logoClickCount + 1;
        setLogoClickCount(newClickCount);

        if (newClickCount >= 7) {
            setEasterEggVisible(true);
            setLogoClickCount(0);
        } else {
            clickTimeoutRef.current = setTimeout(() => {
                setLogoClickCount(0);
            }, 1500); // Reset after 1.5 seconds
        }
    };


    return (
        <>
            <header className="sticky top-0 z-50 bg-[var(--color-bg-glass)] backdrop-blur-lg border-b border-[var(--color-border-primary)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <div onClick={handleLogoClick} className="cursor-pointer">
                                <Logo isDrillActive={isDrillActive} />
                            </div>
                            <nav className="hidden md:flex items-center space-x-4">
                                {user && navLinks}
                            </nav>
                        </div>
                        <div className="flex items-center space-x-3">
                            <ThemeToggle />
                            <div className="hidden md:flex items-center space-x-3">
                                {user ? (
                                    <>
                                        {isDrillActive ? (
                                             <span className="p-2 rounded-full text-[var(--color-text-secondary)] opacity-50 cursor-not-allowed" title="Profile unavailable during drill">
                                                <User size={20} />
                                            </span>
                                        ) : (
                                            <Link to="/profile" className="p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors" title="Profile">
                                                <User size={20} />
                                            </Link>
                                        )}
                                        <button onClick={logout} disabled={isDrillActive} className="p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Logout">
                                            <LogOut size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Log In</Link>
                                        <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-md hover:opacity-90 transition-opacity">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} disabled={isDrillActive} className="p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isMenuOpen && !isDrillActive && (
                    <div className="md:hidden pb-4 px-2 space-y-1">
                        {user ? (
                            <>
                            {navLinks}
                                <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Profile</NavLink>
                                <div className="border-t border-[var(--color-border-primary)] pt-4 mt-4 flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-text-secondary)]">{user.name}</span>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 pt-2">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-center text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]">Log In</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-center text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-md hover:opacity-90">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>
            {easterEggVisible && <EasterEgg onClose={() => setEasterEggVisible(false)} />}
        </>
    );
};

export default Header;