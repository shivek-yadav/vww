import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import { AuthPanel, PasswordInput } from '../components/AuthPanel';

export function Login() {
    const { login, user } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    if (user?.role === 'customer') {
        return <Navigate to={location.state?.from || '/account'} replace />;
    }
    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    const submit = async (e) => {
        if (e) e.preventDefault();
        setBusy(true);
        try {
            await login({ email, password });
            toast.success('Welcome back to Vijay Woollen Works!');
            navigate(location.state?.from || '/account', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <AuthPanel
            title="Welcome back."
            subtitle="Sign in to track wholesale manufacturing orders, bulk inquiries, and quotations."
        >
            <form className="form-stack auth-form" onSubmit={submit}>
                <label>
                    Email Address
                    <input
                        required
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Password
                    <PasswordInput value={password} onChange={setPassword} />
                </label>
                <div className="auth-row-links">
                    <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
                </div>
                <button className="btn btn-gold full-width" disabled={busy}>
                    {busy ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
                </button>
            </form>

            <div className="auth-footer-links">
                <p className="auth-switch">
                    New client? <Link to="/register">Create wholesale account</Link>
                </p>
                <p className="auth-admin-link">
                    <Link to="/admin/login"><ShieldCheck size={14} /> Factory Admin Portal</Link>
                </p>
            </div>
        </AuthPanel>
    );
}
