import { useState } from 'react';
import { ArrowRight, Building2, MapPin, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';

const INDIAN_STATES = [
    'Punjab', 'Delhi', 'Haryana', 'Uttar Pradesh', 'Bihar', 
    'Rajasthan', 'Madhya Pradesh', 'Himachal Pradesh', 'Jammu & Kashmir', 
    'Uttarakhand', 'Maharashtra', 'Gujarat', 'West Bengal', 'Jharkhand', 
    'Odisha', 'Assam', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'
];

export function AccountHome() {
    const { user, setUser } = useApp();
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [orgName, setOrgName] = useState(user?.orgName || '');
    const [gstin, setGstin] = useState(user?.gstin || '');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState(user?.city || 'Ludhiana');
    const [state, setState] = useState(user?.state || 'Punjab');
    const [pincode, setPincode] = useState(user?.pincode || '');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api.patch('/account', { 
                name, 
                phone, 
                orgName, 
                gstin, 
                address, 
                city, 
                state, 
                pincode 
            });
            setUser(r.data.data);
            toast.success('Institution profile & delivery address saved!');
        } catch (e) {
            toast.error(e.message || 'Failed to update profile');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="account-panel">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                    Institution Profile & Dispatch Details
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                    Keep your institutional credentials and freight address updated for seamless quotation generation and bilty dispatch.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '24px' }}>
                <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: '800',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)',
                    border: '2px solid #ffffff'
                }}>
                    {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <strong style={{ fontSize: '16px', color: '#0f172a', display: 'block' }}>{user?.name}</strong>
                    <span style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: '700' }}>{user?.orgName || 'Institutional Client'}</span>
                    <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>{user?.email} {user?.phone ? `· ${user.phone}` : ''}</small>
                </div>
            </div>

            <form onSubmit={submit} className="form-stack profile-form">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <label>
                        Contact Person Name *
                        <input 
                            required 
                            minLength={2} 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Full Name"
                        />
                    </label>

                    <label>
                        Institution / School / Business Name
                        <input 
                            value={orgName} 
                            onChange={e => setOrgName(e.target.value)} 
                            placeholder="e.g. St. Xavier's Convent School / ABC Uniform Store"
                        />
                    </label>

                    <label>
                        Email Address (Account ID)
                        <input disabled value={user?.email || ''} style={{ background: '#f1f5f9', color: '#64748b' }} />
                    </label>

                    <label>
                        WhatsApp Phone Number *
                        <input 
                            value={phone} 
                            onChange={e => setPhone(e.target.value)} 
                            placeholder="+91-9876543210"
                        />
                    </label>

                    <label>
                        GSTIN Number (for Tax Invoices)
                        <input 
                            value={gstin} 
                            onChange={e => setGstin(e.target.value.toUpperCase())} 
                            placeholder="e.g. 03XXXXXXXXXX1Z5"
                        />
                    </label>

                    <label>
                        PIN Code
                        <input 
                            value={pincode} 
                            maxLength="6"
                            onChange={e => setPincode(e.target.value)} 
                            placeholder="e.g. 141001"
                        />
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            Delivery / Campus Dispatch Address
                            <input 
                                value={address} 
                                onChange={e => setAddress(e.target.value)} 
                                placeholder="Street, Building, Campus Landmark"
                            />
                        </label>
                    </div>

                    <label>
                        City
                        <input 
                            value={city} 
                            onChange={e => setCity(e.target.value)} 
                            placeholder="City"
                        />
                    </label>

                    <label>
                        State
                        <select 
                            value={state} 
                            onChange={e => setState(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                        >
                            {INDIAN_STATES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <button 
                        type="submit" 
                        className="btn btn-gold" 
                        disabled={busy}
                        style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        {busy ? 'Saving...' : 'Save Profile & Address'} <ArrowRight size={17} />
                    </button>
                </div>
            </form>
        </div>
    );
}
