import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';

export function AdminLogin() {
    const { login, user } = useApp();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    const submit = async (e) => {
        if (e) e.preventDefault();
        setBusy(true);
        try {
            await login(form, true);
            toast.success('Welcome back, Admin!');
            navigate('/admin', { replace: true });
        } catch (e) {
            toast.error(e.message || 'Invalid admin credentials');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="admin-login-screen">
            <div className="admin-login-brand">
                <div className="brand-logo-wrap">
                    <img
                        src="/vww/branding/Vijay Woollen Works Logo.png"
                        alt="Vijay Woollen Works"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
                <span>Vijay Woollen Works</span>
                <small>Factory Management & CRM Console</small>
            </div>

            <div className="admin-login-card">
                <div className="admin-badge-pill">
                    <ShieldCheck size={14} />
                    <span>Authorized Personnel Only</span>
                </div>

                <h1>Welcome Back</h1>
                <p>Sign in to manage catalog items, wholesale production, orders, quotations, and client CRM.</p>

                <form onSubmit={submit}>
                    <div className="admin-input-group">
                        <label htmlFor="admin-email">Admin Email</label>
                        <div className="admin-input-field">
                            <span className="admin-input-icon"><Mail size={18} /></span>
                            <input
                                id="admin-email"
                                type="email"
                                required
                                autoComplete="username"
                                placeholder="admin@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="admin-input-group">
                        <label htmlFor="admin-password">Password</label>
                        <div className="admin-input-field">
                            <span className="admin-input-icon"><Lock size={18} /></span>
                            <input
                                id="admin-password"
                                type={showPass ? 'text' : 'password'}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="admin-input-toggle"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button disabled={busy} type="submit" className="admin-btn-primary">
                        {busy ? 'Verifying Credentials...' : 'Enter Admin Console'}
                        <ArrowRight size={18} />
                    </button>

                    <div className="admin-login-foot">
                        <div className="admin-security-note">
                            <ShieldCheck size={14} color="#16a34a" />
                            <span>256-bit Encrypted Admin Session</span>
                        </div>
                        <Link to="/" className="admin-back">
                            <ArrowLeft size={16} /> Return to Factory Storefront
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
