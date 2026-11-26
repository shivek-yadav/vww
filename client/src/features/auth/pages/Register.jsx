import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import { AuthPanel, PasswordInput } from '../components/AuthPanel';

export function Register() {
    const { register, user } = useApp();
    const [form, setForm] = useState({ 
        name: '', 
        orgName: '', 
        email: '', 
        phone: '', 
        city: '', 
        state: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    if (user?.role === 'customer') {
        return <Navigate to="/account" replace />;
    }

    const submit = async (e) => {
        e.preventDefault();
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setBusy(true);
        try {
            await register({
                name: form.name.trim(),
                orgName: form.orgName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                password: form.password
            });
            toast.success('Your wholesale account is ready! Welcome to Vijay Woollen Works.');
            navigate('/account');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <AuthPanel
            title="Register Wholesale Account"
            subtitle="Save your institution details, track wholesale lots in real-time, and request fabric samples."
        >
            <form onSubmit={submit} className="form-stack auth-form">
                <label>
                    Contact Person Name *
                    <input
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder="e.g. Ramesh Gupta (Principal / Admin)"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </label>
                <label>
                    School / Organization / Shop Name *
                    <input
                        required
                        placeholder="e.g. Delhi Public School / Gupta Uniforms"
                        value={form.orgName}
                        onChange={e => setForm({ ...form, orgName: e.target.value })}
                    />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <label>
                        Official Email *
                        <input
                            required
                            type="email"
                            autoComplete="email"
                            placeholder="admin@school.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </label>
                    <label>
                        WhatsApp / Mobile *
                        <input
                            required
                            type="tel"
                            autoComplete="tel"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <label>
                        City / District
                        <input
                            placeholder="e.g. Ludhiana / Jaipur"
                            value={form.city}
                            onChange={e => setForm({ ...form, city: e.target.value })}
                        />
                    </label>
                    <label>
                        State
                        <input
                            placeholder="e.g. Punjab / Rajasthan"
                            value={form.state}
                            onChange={e => setForm({ ...form, state: e.target.value })}
                        />
                    </label>
                </div>
                <label>
                    Password (at least 8 characters) *
                    <PasswordInput
                        value={form.password}
                        onChange={val => setForm({ ...form, password: val })}
                        placeholder="Create a secure password"
                    />
                </label>
                <label>
                    Confirm Password *
                    <PasswordInput
                        value={form.confirmPassword}
                        onChange={val => setForm({ ...form, confirmPassword: val })}
                        placeholder="Repeat your password"
                    />
                </label>
                <button className="btn btn-gold full-width" disabled={busy}>
                    {busy ? 'Creating wholesale account...' : 'Register & Enter Client Portal'} <ArrowRight size={18} />
                </button>
            </form>
            <p className="auth-switch">
                Already registered? <Link to="/login">Sign in to your client account</Link>
            </p>
        </AuthPanel>
    );
}
