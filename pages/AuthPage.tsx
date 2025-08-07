
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { PmLevel } from '../types';
import { PM_LEVELS } from '../types';
import { Loader2, AlertTriangle, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Alert } from '../App';
import CustomSelect from '../components/CustomSelect';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [pmLevel, setPmLevel] = useState<PmLevel>(PM_LEVELS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let success = false;
    if (isLogin) {
      success = await login(email, password);
      if (!success) setError('Invalid email or password.');
    } else {
      success = await signup(name, email, password, pmLevel);
      if (!success) setError('Could not create account. The email might already be in use.');
    }

    setLoading(false);
    if (success) {
      navigate(isLogin ? '/drill' : '/onboarding');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            Or{' '}
            {isLogin ? (
              <Link to="/signup" className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]">
                create a free account
              </Link>
            ) : (
              <Link to="/login" className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]">
                sign in to your existing account
              </Link>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
             <>
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] placeholder-[var(--color-text-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label id="pm-level-label" className="sr-only">PM Level</label>
                 <CustomSelect
                    labelId="pm-level-label"
                    options={PM_LEVELS}
                    value={pmLevel}
                    onChange={(value) => setPmLevel(value as PmLevel)}
                />
              </div>
             </>
          )}
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] placeholder-[var(--color-text-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] placeholder-[var(--color-text-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && <Alert type="error" message={error} />}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-primary)] disabled:opacity-50 transition"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLogin ? <LogIn className="h-5 w-5 text-[var(--color-brand-accent)]" /> : <UserPlus className="h-5 w-5 text-[var(--color-brand-accent)]" />}
                </span>
                {isLogin ? 'Sign in' : 'Create account'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
