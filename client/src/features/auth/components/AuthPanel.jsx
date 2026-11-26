import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Factory, Award, CheckCircle2 } from 'lucide-react';

export function AuthPanel({ title, subtitle, children }) {
    return (
        <div className="auth-wrap">
            <div 
                className="auth-side" 
                style={{ 
                    backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.88), rgba(30, 58, 138, 0.85)), url('/vww/branding/Vijay Woollen Works Apparel Solutions.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#ffffff',
                    padding: '40px'
                }}
            >
                <div>
                    <span className="eyebrow light" style={{ color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '12px' }}>
                        <Factory size={14} /> VIJAY WOOLLEN WORKS · B2B CLIENT PORTAL
                    </span>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.25', margin: '0 0 16px', color: '#ffffff' }}>
                        Direct Ludhiana Mill Rates & Production Tracking
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px' }}>
                        Sign in to save your school or institution profile, request physical fabric swatches, download wholesale GST invoices, and track batch dispatch across India.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={16} color="#22c55e" />
                            <span>MSME & GSTIN Registered Ludhiana Manufacturer</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={16} color="#22c55e" />
                            <span>Real-Time Order & Transport Bilti Tracking</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={16} color="#22c55e" />
                            <span>1-Click Sample Piece Dispatch Requests</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-panel">
                <Link className="back-link" to="/">
                    <ArrowLeft size={16} /> Back to Factory Website
                </Link>
                <div className="auth-form-box">
                    <div className="eyebrow" style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        <span className="eyebrow-rule" />
                        INSTITUTIONAL CLIENT ACCESS
                    </div>
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function PasswordInput({ value, onChange, placeholder = 'Enter your password' }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="password-input">
            <input 
                required 
                minLength={8} 
                type={visible ? 'text' : 'password'} 
                placeholder={placeholder} 
                value={value} 
                onChange={e => onChange(e.target.value)}
            />
            <button 
                type="button" 
                onClick={() => setVisible(!visible)} 
                aria-label="Toggle password visibility"
            >
                {visible ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
        </div>
    );
}
