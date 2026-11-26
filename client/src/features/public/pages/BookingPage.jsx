import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, MessageCircle, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { PageHero } from '../../../components/UI';

export function BookingPage() {
    const { user, settings } = useApp();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        orgName: '',
        cityState: '',
        category: 'School Uniform Sweaters',
        quantity: '100 pcs',
        sizes: '24, 26, 28',
        notes: ''
    });
    const [busy, setBusy] = useState(false);
    const [success, setSuccess] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            if (user) {
                await api.post('/bookings', {
                    name: form.name,
                    email: form.email || user.email,
                    phone: form.phone,
                    occasion: `${form.category} (${form.quantity}) - ${form.orgName}`,
                    notes: `Location: ${form.cityState}. Sizes: ${form.sizes}. Notes: ${form.notes}`
                });
            } else {
                await api.post('/inquiries', {
                    name: form.name,
                    email: form.email || 'quote@client.com',
                    phone: form.phone,
                    subject: `Order Quotation: ${form.category} (${form.quantity}) - ${form.orgName}`,
                    message: `Organization/School: ${form.orgName}\nLocation: ${form.cityState}\nCategory: ${form.category}\nEstimated Quantity: ${form.quantity}\nSizes Required: ${form.sizes}\nNotes/Specifications: ${form.notes}`
                });
            }
            setSuccess(true);
            toast.success('Quotation request submitted successfully!');
        } catch (e) {
            toast.error(e.message || 'Error submitting quotation.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <PageHero 
                eyebrow="FACTORY DIRECT QUOTATION & SAMPLES" 
                title="Request Bulk Order Quotation" 
                description="Get accurate rates, fabric specs, and estimated delivery timelines for school uniforms, sweaters, and corporate wear."
                image="/vww/branding/Vijay Woollen Works Apparel Solutions.png"
            />

            <section className="section" style={{ background: '#f8fafc', padding: '50px 0 80px' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
                    <div>
                        <div style={{ color: '#1e3a8a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                            Order Process & Terms
                        </div>
                        <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginBottom: '18px' }}>
                            Transparent Pricing & Pan-India Dispatch
                        </h2>
                        <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '20px' }}>
                            At <strong>Vijay Woollen Works</strong>, every order quotation is drafted transparently detailing yarn composition, rate per piece, 5% GST breakdown, and estimated railway parcel or road cargo transport charges.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '14px', color: '#334155' }}>
                                    <strong>50% Advance Booking:</strong> Production and sizing allocation begins immediately upon receipt of 50% order advance.
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '14px', color: '#334155' }}>
                                    <strong>Production + Delivery Timeline:</strong> Approximately 7 days production + 7 days transit across India (total ~14 days).
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '14px', color: '#334155' }}>
                                    <strong>Sample Swatch Verification:</strong> Physical knitted fabric swatches and sample pullovers can be dispatched prior to production.
                                </span>
                            </div>
                        </div>

                        {/* Direct Contact Options */}
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
                            <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a', marginBottom: '8px' }}>
                                Need Immediate Assistance?
                            </strong>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                                Discuss sizing, bulk discounts, or urgent school reopening dates directly with our proprietor.
                            </p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <a 
                                    href="tel:+918427257106"
                                    style={{ background: '#1e3a8a', color: '#ffffff', padding: '9px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Phone size={14} /> Call: +91 84272 57106
                                </a>
                                <a 
                                    href="https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20I%20would%20like%20to%20request%20an%20urgent%20order%20quotation."
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ background: '#22c55e', color: '#ffffff', padding: '9px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <MessageCircle size={14} /> WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quotation Request Card */}
                    <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                                <CheckCircle2 size={64} style={{ color: '#22c55e', margin: '0 auto 16px' }} />
                                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                                    Quotation Request Received!
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                                    Thank you, <strong>{form.name}</strong>. Our factory manager will review your size breakdown and send the formal quotation with freight details to <strong>{form.phone}</strong>.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    style={{ background: '#1e3a8a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                                    Submit Your Requirements
                                </h3>
                                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px' }}>
                                    We generate customized per-piece rates based on your fabric grade and volume.
                                </p>

                                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Contact Person *
                                            </label>
                                            <input 
                                                required 
                                                value={form.name} 
                                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                                placeholder="Your Name"
                                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                School / Organization *
                                            </label>
                                            <input 
                                                required 
                                                value={form.orgName} 
                                                onChange={e => setForm({ ...form, orgName: e.target.value })} 
                                                placeholder="e.g. Model Public School"
                                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Phone / WhatsApp *
                                            </label>
                                            <input 
                                                required 
                                                value={form.phone} 
                                                onChange={e => setForm({ ...form, phone: e.target.value })} 
                                                placeholder="+91 98765 43210"
                                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                City & State *
                                            </label>
                                            <input 
                                                required 
                                                value={form.cityState} 
                                                onChange={e => setForm({ ...form, cityState: e.target.value })} 
                                                placeholder="e.g. Guwahati, Assam"
                                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Uniform Category
                                            </label>
                                            <select 
                                                value={form.category} 
                                                onChange={e => setForm({ ...form, category: e.target.value })}
                                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
                                            >
                                                <option>School Uniform Sweaters</option>
                                                <option>School Blazers & Tracksuits</option>
                                                <option>College / Academy Hoodies</option>
                                                <option>Corporate Uniforms & Polos</option>
                                                <option>Industrial Safety Jackets</option>
                                                <option>Accessories (Ties, Belts, Caps)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Estimated Quantity
                                            </label>
                                            <select 
                                                value={form.quantity} 
                                                onChange={e => setForm({ ...form, quantity: e.target.value })}
                                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
                                            >
                                                <option>30 - 50 pcs (Sample)</option>
                                                <option>50 - 150 pcs</option>
                                                <option>150 - 500 pcs</option>
                                                <option>500 - 1000 pcs</option>
                                                <option>1000+ pcs</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                            Sizes Required
                                        </label>
                                        <input 
                                            value={form.sizes} 
                                            onChange={e => setForm({ ...form, sizes: e.target.value })} 
                                            placeholder="e.g. 24 (30 pcs), 26 (70 pcs), 28 (40 pcs)"
                                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                            Special Instructions (Embroidery / Yarn / Delivery Target)
                                        </label>
                                        <textarea 
                                            rows={3} 
                                            value={form.notes} 
                                            onChange={e => setForm({ ...form, notes: e.target.value })} 
                                            placeholder="Any logo embroidery, school color matching, or specific packaging requirements..."
                                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={busy}
                                        style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}
                                    >
                                        {busy ? 'Submitting...' : 'Request Official Quotation'} <ArrowRight size={17} />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
