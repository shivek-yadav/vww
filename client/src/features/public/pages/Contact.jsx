import { useState } from 'react';
import { ArrowRight, MapPin, Phone, Mail, Clock, MessageCircle, ShieldCheck, Download, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { PageHero } from '../../../components/UI';

export function Contact() {
    const { settings } = useApp();
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        subject: 'Wholesale Order Quotation', 
        message: '' 
    });
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNum, setPhoneNum] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const finalPhone = phoneNum.trim() ? `${countryCode} ${phoneNum.trim()}` : '';
            const r = await api.post('/inquiries', { ...form, phone: finalPhone });
            toast.success('Your message has been sent to Vijay Woollen Works! We will reply promptly.');
            setForm({ name: '', email: '', subject: 'Wholesale Order Quotation', message: '' });
            setPhoneNum('');
        } catch (e) {
            toast.error(e.message || 'Failed to submit message.');
        } finally {
            setBusy(false);
        }
    };

    const phoneNumber = settings.phone || '+91 84272 57106';

    return (
        <>
            <PageHero 
                eyebrow="GET IN TOUCH WITH THE FACTORY" 
                title="Contact & Order Inquiries" 
                description="Direct procurement inquiries for schools, institutions, bulk dealers, and private label apparel."
                image="/vww/branding/Vijay Woollen Works Apparel Solutions.png"
            />

            <section className="section" style={{ background: '#f8fafc', padding: '50px 0 80px' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
                    {/* Left Column: Contact & Bank Info */}
                    <div>
                        <div style={{ color: '#1e3a8a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                            Manufacturing Office & Dispatch
                        </div>
                        <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                            Vijay Woollen Works (VWW)
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '10px', borderRadius: '8px', flexShrink: 0 }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>Factory Address</strong>
                                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                                        Building B-V-1209, Purana Bazaar, Buhrampuri, Ludhiana - 141008, Punjab, India
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '10px', borderRadius: '8px', flexShrink: 0 }}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>Proprietor & Direct Sales</strong>
                                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                                        Vijay Pratap: <a href="tel:+918427257106" style={{ color: '#1e3a8a', fontWeight: '700' }}>+91 84272 57106</a><br />
                                        Office WhatsApp: <a href="tel:+919872989024" style={{ color: '#1e3a8a', fontWeight: '700' }}>+91 98729 89024</a>
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '10px', borderRadius: '8px', flexShrink: 0 }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>Official Email</strong>
                                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                                        <a href="mailto:vijaywoolenwork@gmail.com" style={{ color: '#1e3a8a', fontWeight: '600' }}>
                                            vijaywoolenwork@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '10px', borderRadius: '8px', flexShrink: 0 }}>
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>Factory Timings</strong>
                                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                                        Monday – Saturday: 9:00 AM – 8:00 PM<br />
                                        Sunday: 10:00 AM – 4:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Official Business Credentials */}
                        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>
                                <ShieldCheck size={18} /> Official Business Credentials
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                                Official GST proforma invoices with HSN codes and verified banking details are provided directly on company letterhead:
                            </p>
                            <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#0f172a' }}>
                                <div><strong>Entity:</strong> Vijay Woollen Works</div>
                                <div><strong>Proprietor:</strong> Vijay Pratap</div>
                                <div><strong>GSTIN (Punjab):</strong> 03AWNPV3468J1ZX</div>
                                <div><strong>MSME Reg:</strong> Verified Udyam Manufacturing Unit</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                                    * Bank wire instructions (RTGS/NEFT) are shared securely with verified institutions on approved proforma invoices.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Message Form */}
                    <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                            Send us a Message or Requirement
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px' }}>
                            Looking for custom school pullovers, corporate blazers, or sports tracksuits? Drop your details below.
                        </p>

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                    Full Name / Contact Person *
                                </label>
                                <input 
                                    required 
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })} 
                                    placeholder="e.g. Ramesh Kumar"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        Email Address *
                                    </label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={form.email} 
                                        onChange={e => setForm({ ...form, email: e.target.value })} 
                                        placeholder="you@example.com"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        Country & Phone / WhatsApp *
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '6px' }}>
                                        <select
                                            value={countryCode}
                                            onChange={e => setCountryCode(e.target.value)}
                                            style={{ padding: '10px 4px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#f8fafc', fontWeight: '700', color: '#1e293b' }}
                                        >
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+971">🇦🇪 +971</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+61">🇦🇺 +61</option>
                                            <option value="+65">🇸🇬 +65</option>
                                            <option value="+966">🇸🇦 +966</option>
                                            <option value="+974">🇶🇦 +974</option>
                                            <option value="+968">🇴🇲 +968</option>
                                            <option value="+977">🇳🇵 +977</option>
                                        </select>
                                        <input 
                                            required
                                            type="tel"
                                            value={phoneNum} 
                                            onChange={e => setPhoneNum(e.target.value)} 
                                            placeholder="98765 43210"
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                    Subject
                                </label>
                                <select 
                                    value={form.subject} 
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
                                >
                                    <option>Wholesale Order Quotation</option>
                                    <option>School Uniform Contract</option>
                                    <option>Sample Swatch Request</option>
                                    <option>Corporate / Industrial Workwear</option>
                                    <option>Private Label Apparel Manufacturing</option>
                                    <option>Other Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                    Message & Product Specifics *
                                </label>
                                <textarea 
                                    required 
                                    rows={5} 
                                    value={form.message} 
                                    onChange={e => setForm({ ...form, message: e.target.value })} 
                                    placeholder="Please describe your product needs, sizes (e.g. 24 to 34), quantity estimates, and required delivery timeline..."
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={busy}
                                style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                {busy ? 'Submitting...' : 'Send Inquiry to Factory'} <ArrowRight size={17} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
