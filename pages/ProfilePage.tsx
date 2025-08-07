

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { PM_LEVELS } from '../types';
import { PmLevel } from '../types';
import { Loader2, Eye, EyeOff, User, CreditCard, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../App';
import CustomSelect from '../components/CustomSelect';

const SectionCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; }> = ({ icon: Icon, title, children }) => (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-lg">
        <div className="p-6 border-b border-[var(--color-border-primary)]">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center">
                <Icon className="w-6 h-6 mr-3 text-[var(--color-brand-accent)]" />
                {title}
            </h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const PasswordInput: React.FC<{ id: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ id, placeholder, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                name={id}
                type={showPassword ? "text" : "password"}
                required
                value={value}
                onChange={onChange}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] placeholder-[var(--color-text-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] sm:text-sm"
                placeholder={placeholder}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                {showPassword ? <EyeOff /> : <Eye />}
            </button>
        </div>
    );
};

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userEmail: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm, userEmail }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setConfirmationText('');
            setIsDeleting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        // The component will unmount as the user is logged out.
    };

    const isConfirmationMatch = confirmationText === userEmail;

    const modalContent = (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={onClose}>
            <div className="bg-[var(--color-bg-secondary)] w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-extrabold text-red-500 flex items-center">
                    <Trash2 className="mr-3"/> Are you absolutely sure?
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                    This action is irreversible. All of your data, including your profile, drill history, and progress, will be permanently deleted. This cannot be undone.
                </p>
                <div>
                    <label htmlFor="delete-confirm" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Please type <span className="font-bold text-[var(--color-text-primary)]">{userEmail}</span> to confirm.
                    </label>
                    <input
                        id="delete-confirm"
                        type="email"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] placeholder-[var(--color-text-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                </div>
                <div className="flex flex-col sm:flex-row-reverse gap-4">
                     <button
                        onClick={handleConfirm}
                        disabled={!isConfirmationMatch || isDeleting}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isDeleting ? <Loader2 className="animate-spin h-5 w-5"/> : 'I understand, delete my account'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 border border-[var(--color-border-primary)] text-sm font-medium rounded-md text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
         </div>
    );
    
    return createPortal(modalContent, document.body);
};


const ProfilePage: React.FC = () => {
    const { user, updateUserProfile, changeUserPassword, deleteAccount, loading: authLoading } = useAuth();
    
    // Profile form state
    const [pmLevel, setPmLevel] = useState<PmLevel | undefined>(user?.pmLevel);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Delete account state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setPmLevel(user.pmLevel);
        }
    }, [user]);

    if (authLoading || !user) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-[var(--color-brand-primary)]" /></div>;
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);
        if (pmLevel) {
            const originalPmLevel = user.pmLevel;
            const { success, message } = await updateUserProfile({ pmLevel });
            
            if (success && pmLevel !== originalPmLevel) {
                setProfileMessage({ type: 'success', text: `PM Level updated! Your new performance will be tracked at the ${pmLevel} level. You can filter analytics on the dashboard to see your performance at each career stage.`});
            } else {
                 setProfileMessage({ type: success ? 'success' : 'error', text: message });
            }
        }
        setProfileLoading(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setPasswordMessage({ type: 'error', text: "New passwords do not match." });
            return;
        }
        if (newPassword.length < 6) {
             setPasswordMessage({ type: 'error', text: "Password must be at least 6 characters long." });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);
        const { success, message } = await changeUserPassword(currentPassword, newPassword);
        setPasswordMessage({ type: success ? 'success' : 'error', text: message });
        setPasswordLoading(false);
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    };

    return (
        <>
        <div className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] text-center">Profile & Settings</h1>

                    {/* Profile Information */}
                    <SectionCard icon={User} title="Profile Information">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                                <input type="email" name="email" id="email" value={user.email} disabled
                                    className="mt-1 block w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md shadow-sm sm:text-sm text-[var(--color-text-tertiary)] cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label id="pm-level-label" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">PM Level</label>
                                <CustomSelect
                                    labelId="pm-level-label"
                                    options={PM_LEVELS}
                                    value={pmLevel || PM_LEVELS[0]}
                                    onChange={(value) => setPmLevel(value as PmLevel)}
                                />
                            </div>
                            {profileMessage && <Alert type={profileMessage.type} message={profileMessage.text} onClose={() => setProfileMessage(null)} />}
                            <div className="text-right">
                                <button type="submit" disabled={profileLoading} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] hover:opacity-90 disabled:opacity-50">
                                    {profileLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </SectionCard>

                    {/* Subscription */}
                    <SectionCard icon={CreditCard} title="Subscription">
                        <div className="flex items-center justify-between">
                            <p className="text-[var(--color-text-secondary)]">You are currently on the <span className="font-bold text-[var(--color-text-primary)]">{user.plan}</span> plan.</p>
                            {user.plan === 'Free' &&
                                <Link to="/pricing" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] hover:opacity-90">
                                    Upgrade to Plus
                                </Link>
                            }
                        </div>
                    </SectionCard>

                    {/* Change Password */}
                    <SectionCard icon={ShieldCheck} title="Change Password">
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <PasswordInput id="current-password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            <PasswordInput id="new-password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            <PasswordInput id="confirm-new-password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                            {passwordMessage && <Alert type={passwordMessage.type} message={passwordMessage.text} onClose={() => setPasswordMessage(null)} />}
                            <div className="text-right">
                                <button type="submit" disabled={passwordLoading} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] hover:opacity-90 disabled:opacity-50">
                                    {passwordLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </SectionCard>

                    {/* Delete Account */}
                     <SectionCard icon={Trash2} title="Delete Account">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                               <p className="font-semibold text-red-500">This action is permanent.</p>
                               <p className="text-[var(--color-text-secondary)]">Once you delete your account, there is no going back.</p>
                            </div>
                             <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-red-500 text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-500/10"
                            >
                                Delete My Account
                            </button>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
        <DeleteAccountModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteAccount}
            userEmail={user.email}
        />
        </>
    );
};

export default ProfilePage;