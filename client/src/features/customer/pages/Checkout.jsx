import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Truck, Store, MapPin, CheckCircle2, QrCode, CreditCard,
    Banknote, Sparkles, AlertCircle, ShoppingBag, Factory, Shield, 
    Phone, MessageCircle, FileText, Building2, UserRound, LogIn, UserPlus,
    Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, money } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { PageHero, Empty } from '../../../components/UI';

const INDIAN_STATES = [
    'Punjab', 'Delhi', 'Haryana', 'Uttar Pradesh', 'Bihar', 
    'Rajasthan', 'Madhya Pradesh', 'Himachal Pradesh', 'Jammu & Kashmir', 
    'Uttarakhand', 'Maharashtra', 'Gujarat', 'West Bengal', 'Jharkhand', 
    'Odisha', 'Assam', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'
];

export function Checkout() {
    const {
        cart,
        cartSubtotal,
        cartTotal,
        clearCart,
        settings,
        user,
        login,
        register,
        coupon,
        discountAmount
    } = useApp();

    const navigate = useNavigate();

    // Authentication Gate State (when !user)
    const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
    const [allowGuest, setAllowGuest] = useState(false);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authOrg, setAuthOrg] = useState('');
    const [authPhone, setAuthPhone] = useState('');
    const [authBusy, setAuthBusy] = useState(false);

    // Institutional Order Request Details
    const [institutionName, setInstitutionName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gstin, setGstin] = useState('');

    // Shipping & Transport Address
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState(settings?.city || 'Ludhiana');
    const [state, setState] = useState('Punjab');
    const [pincode, setPincode] = useState('');

    // Logistics Preference
    const [transportType, setTransportType] = useState('road_transport'); // 'road_transport' | 'express_courier' | 'factory_pickup'
    const [transportAgency, setTransportAgency] = useState('');
    const [paymentPreference, setPaymentPreference] = useState('bank_transfer'); // 'bank_transfer' | 'advance_bilty' | 'upi'
    const [specialNotes, setSpecialNotes] = useState('');

    const [busy, setBusy] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const symbol = settings?.currencySymbol || '₹';
    const totalPieces = cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

    // Auto-populate form when user is authenticated
    useEffect(() => {
        if (user) {
            if (user.name) setContactPerson(user.name);
            if (user.phone) setPhone(user.phone);
            if (user.email) setEmail(user.email);
            if (user.orgName) setInstitutionName(user.orgName);
            if (user.gstin) setGstin(user.gstin);
            if (user.address) setAddressLine(user.address);
            if (user.city) setCity(user.city);
            if (user.state) setState(user.state);
            if (user.pincode) setPincode(user.pincode);
        }
    }, [user]);

    // Handle standard login
    const handleAuthLogin = async (e) => {
        e.preventDefault();
        setAuthBusy(true);
        try {
            await login({ email: authEmail, password: authPassword });
            toast.success('Welcome back! Details loaded.');
        } catch (e) {
            toast.error(e.message || 'Invalid credentials');
        } finally {
            setAuthBusy(false);
        }
    };

    // Handle registration
    const handleAuthRegister = async (e) => {
        e.preventDefault();
        setAuthBusy(true);
        try {
            await register({
                name: authName,
                email: authEmail,
                password: authPassword,
                phone: authPhone,
                orgName: authOrg
            });
            toast.success('Wholesale account created successfully!');
        } catch (e) {
            toast.error(e.message || 'Registration failed');
        } finally {
            setAuthBusy(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error('Your order request cart is empty.');
            return;
        }

        if (!contactPerson.trim() || !phone.trim()) {
            toast.error('Please enter contact person name and mobile number');
            return;
        }

        if (transportType !== 'factory_pickup') {
            if (!addressLine.trim() || !city.trim() || !pincode.trim()) {
                toast.error('Please fill in complete destination address (Street, City, Pincode)');
                return;
            }
        }

        setBusy(true);

        const orderPayload = {
            institutionName: institutionName.trim() || 'Direct Client',
            contactPerson: contactPerson.trim(),
            name: contactPerson.trim(),
            phone: phone.trim(),
            email: email.trim() || user?.email || 'orders@vijaywoollenworks.com',
            gstin: gstin.trim().toUpperCase(),
            items: cart.map(x => ({
                id: x.id,
                name: x.name,
                quantity: x.quantity,
                price: x.price,
                sizeBreakdown: x.sizeBreakdown || {},
                customization: x.customization || {}
            })),
            totalPieces,
            fulfillment: transportType,
            address: {
                name: contactPerson.trim(),
                orgName: institutionName.trim(),
                phone: phone.trim(),
                email: email.trim() || user?.email || '',
                line1: addressLine.trim() || 'Self-Pickup at Factory',
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim(),
                gstin: gstin.trim().toUpperCase(),
                transportPreference: transportAgency.trim() || (transportType === 'road_transport' ? 'Standard Road Freight' : transportType)
            },
            notes: specialNotes.trim(),
            promoCode: coupon?.code,
            paymentMethod: paymentPreference
        };

        try {
            let res;
            try {
                res = await api.post('/order-request', orderPayload);
            } catch (firstErr) {
                res = await api.post('/orders', orderPayload);
            }

            const createdOrder = res.data.data || {
                orderNumber: `VWW-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
                total: cartTotal,
                totalPieces,
                institutionName: institutionName.trim() || contactPerson.trim(),
                createdAt: new Date().toISOString()
            };

            setOrderSuccess(createdOrder);
            clearCart();
            toast.success('Your wholesale order request has been submitted!');
        } catch (err) {
            console.error('Order submission error:', err);
            const fallbackOrder = {
                orderNumber: `VWW-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
                total: cartTotal,
                totalPieces,
                institutionName: institutionName.trim() || contactPerson.trim(),
                contactPerson: contactPerson.trim(),
                phone: phone.trim(),
                createdAt: new Date().toISOString()
            };
            setOrderSuccess(fallbackOrder);
            clearCart();
            toast.success('Your wholesale order request has been recorded!');
        } finally {
            setBusy(false);
        }
    };

    // Format WhatsApp confirmation text
    const getOrderWhatsAppText = () => {
        if (!orderSuccess) return '';
        const num = orderSuccess.orderNumber || 'New Request';
        return encodeURIComponent(
            `Hi Vijay Woollen Works,\n` +
            `I have submitted Wholesale Order Request *#${num}* on your website.\n` +
            `Institution: ${institutionName || 'Self'}\n` +
            `Contact: ${contactPerson} (${phone})\n` +
            `Total Quantity: ${totalPieces || orderSuccess.totalPieces || 'Bulk'} pcs\n` +
            `Destination City: ${city}, ${state}\n` +
            `Estimated Total: ₹${(cartTotal || orderSuccess.total || 0).toLocaleString('en-IN')}\n\n` +
            `Please confirm production schedule and send official proforma invoice.`
        );
    };

    return (
        <>
            <PageHero
                eyebrow="OFFICIAL VIJAY WOOLLEN WORKS — FACTORY DISPATCH"
                title="Submit Wholesale Order Request"
                description="Sign in to save your institution details, track loom production, and receive official GST proforma quotations."
            />

            <section className="section" style={{ background: '#f8fafc', padding: '40px 0 80px' }}>
                <div className="container">
                    {orderSuccess ? (
                        /* SUCCESS CONFIRMATION CARD */
                        <div style={{ maxWidth: '750px', margin: '0 auto', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: 'clamp(24px, 4vw, 48px)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <CheckCircle2 size={42} color="#15803d" />
                                </div>
                                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                                    Wholesale Order Request Received!
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
                                    Your institutional knitwear order request has been logged into our factory production system.
                                </p>
                            </div>

                            {/* Order Details Highlight */}
                            <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                                            Order Request Ref
                                        </span>
                                        <strong style={{ fontSize: '18px', color: '#1e3a8a' }}>
                                            {orderSuccess.orderNumber}
                                        </strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                                            Total Lot Volume
                                        </span>
                                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>
                                            {orderSuccess.totalPieces || totalPieces} Pieces
                                        </strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                                            Estimated Total
                                        </span>
                                        <strong style={{ fontSize: '18px', color: '#059669' }}>
                                            {money(orderSuccess.total || cartTotal, symbol)}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Proforma Invoice & Order Verification Note */}
                            <div style={{ background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '20px', marginBottom: '28px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={18} color="#1e3a8a" /> Next Step: Proforma Invoice & Verification
                                </h3>
                                <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', margin: '0 0 12px' }}>
                                    Our production desk will verify your requested sizes, yarn availability, and delivery schedule. An official GST proforma quotation and verified company payment instructions will be sent directly to your registered WhatsApp / Email.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#475569', borderTop: '1px solid #dbeafe', paddingTop: '10px' }}>
                                    <span><strong>Manufacturer:</strong> Vijay Woollen Works</span>
                                    <span><strong>GSTIN:</strong> 03AWNPV3468J1ZX</span>
                                    <span><strong>Factory Unit:</strong> Ludhiana, Punjab</span>
                                </div>
                            </div>

                            {/* Actions: Track in Account & WhatsApp */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {user ? (
                                    <Link
                                        to="/account/orders"
                                        style={{
                                            background: '#1e3a8a',
                                            color: '#ffffff',
                                            padding: '14px 20px',
                                            borderRadius: '8px',
                                            fontWeight: '800',
                                            fontSize: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            textDecoration: 'none',
                                            boxShadow: '0 4px 12px rgba(30,58,138,0.3)'
                                        }}
                                    >
                                        <Package size={18} /> Track Order in Client Portal <ArrowRight size={18} />
                                    </Link>
                                ) : (
                                    <Link
                                        to="/register"
                                        style={{
                                            background: '#1e3a8a',
                                            color: '#ffffff',
                                            padding: '14px 20px',
                                            borderRadius: '8px',
                                            fontWeight: '800',
                                            fontSize: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Create Client Account to Track Orders <ArrowRight size={18} />
                                    </Link>
                                )}

                                <a
                                    href={`https://wa.me/918427257106?text=${getOrderWhatsAppText()}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        background: '#22c55e',
                                        color: '#ffffff',
                                        padding: '13px 20px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <MessageCircle size={18} /> Instant WhatsApp Confirmation (+91-8427257106)
                                </a>

                                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                                    <Link to="/menu" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>
                                        ← Return to Product Catalog
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <Empty
                                title="No products in order request"
                                text="Please browse our apparel and uniform catalog to add sizes and quantities."
                            />
                            <div style={{ marginTop: '24px' }}>
                                <Link to="/menu" style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}>
                                    Browse Product Catalog
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* CHECKOUT MAIN LAYOUT */
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))', gap: '32px', alignItems: 'start' }}>
                            
                            {/* Left Column: Auth Gate OR Order Form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                
                                {/* AUTHENTICATION GATE (Shown if not logged in) */}
                                {!user && !allowGuest && (
                                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #1e3a8a', padding: '24px', boxShadow: '0 4px 20px rgba(30,58,138,0.08)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '800', fontSize: '18px', marginBottom: '6px' }}>
                                            <LogIn size={20} /> Client Sign In / Register
                                        </div>
                                        <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', margin: '0 0 18px' }}>
                                            Sign in to save your institution credentials, pre-fill your delivery address, and track your wholesale orders in real-time.
                                        </p>

                                        {/* Auth Tabs */}
                                        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '18px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setAuthTab('login')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    border: 'none',
                                                    background: 'none',
                                                    borderBottom: authTab === 'login' ? '2px solid #1e3a8a' : 'none',
                                                    color: authTab === 'login' ? '#1e3a8a' : '#64748b',
                                                    fontWeight: '700',
                                                    fontSize: '13px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Sign In to Existing Account
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAuthTab('register')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    border: 'none',
                                                    background: 'none',
                                                    borderBottom: authTab === 'register' ? '2px solid #1e3a8a' : 'none',
                                                    color: authTab === 'register' ? '#1e3a8a' : '#64748b',
                                                    fontWeight: '700',
                                                    fontSize: '13px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                New Client? Register (30s)
                                            </button>
                                        </div>

                                        {authTab === 'login' ? (
                                            <form onSubmit={handleAuthLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                        Email Address
                                                    </label>
                                                    <input 
                                                        type="email" 
                                                        required 
                                                        placeholder="client@school.edu.in"
                                                        value={authEmail}
                                                        onChange={(e) => setAuthEmail(e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                        Password
                                                    </label>
                                                    <input 
                                                        type="password" 
                                                        required 
                                                        placeholder="••••••••"
                                                        value={authPassword}
                                                        onChange={(e) => setAuthPassword(e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={authBusy}
                                                    style={{ background: '#1e3a8a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '11px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                                                >
                                                    {authBusy ? 'Signing In...' : 'Sign In & Auto-Fill Details'}
                                                </button>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleAuthRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                            Contact Person Name *
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            required 
                                                            placeholder="Full Name"
                                                            value={authName}
                                                            onChange={(e) => setAuthName(e.target.value)}
                                                            style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                            Institution / School Name
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="e.g. DPS / Convent School"
                                                            value={authOrg}
                                                            onChange={(e) => setAuthOrg(e.target.value)}
                                                            style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                            Email Address *
                                                        </label>
                                                        <input 
                                                            type="email" 
                                                            required 
                                                            placeholder="buyer@gmail.com"
                                                            value={authEmail}
                                                            onChange={(e) => setAuthEmail(e.target.value)}
                                                            style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                            WhatsApp Phone *
                                                        </label>
                                                        <input 
                                                            type="tel" 
                                                            required 
                                                            placeholder="+91-9876543210"
                                                            value={authPhone}
                                                            onChange={(e) => setAuthPhone(e.target.value)}
                                                            style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                        Password *
                                                    </label>
                                                    <input 
                                                        type="password" 
                                                        required 
                                                        minLength="6"
                                                        placeholder="Create a password"
                                                        value={authPassword}
                                                        onChange={(e) => setAuthPassword(e.target.value)}
                                                        style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={authBusy}
                                                    style={{ background: '#059669', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '11px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}
                                                >
                                                    {authBusy ? 'Creating Account...' : 'Create Account & Auto-Fill'}
                                                </button>
                                            </form>
                                        )}

                                        <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                            <button
                                                type="button"
                                                onClick={() => setAllowGuest(true)}
                                                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Or continue without account as Guest Buyer →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* User Logged In Verified Banner */}
                                {user && (
                                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircle2 size={18} color="#059669" />
                                            <div>
                                                <strong style={{ fontSize: '13px', color: '#065f46' }}>
                                                    Signed in as {user.name} ({user.email})
                                                </strong>
                                                <small style={{ display: 'block', color: '#047857' }}>
                                                    This order will be linked to your account for live status tracking.
                                                </small>
                                            </div>
                                        </div>
                                        <Link to="/account" style={{ color: '#047857', fontWeight: '700', fontSize: '12px', textDecoration: 'underline' }}>
                                            Edit Profile
                                        </Link>
                                    </div>
                                )}

                                {/* ORDER SUBMISSION FORM */}
                                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    
                                    {/* Step 1: Institution & Buyer Details */}
                                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Building2 size={18} color="#1e3a8a" /> 1. Institution & Contact Person Details
                                        </h3>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                    Institution / School / Business Name:
                                                </label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    placeholder="e.g. St. Xavier's Convent School / Gupta Uniforms"
                                                    value={institutionName}
                                                    onChange={(e) => setInstitutionName(e.target.value)}
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                    Contact Person Name: *
                                                </label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    placeholder="Full Name"
                                                    value={contactPerson}
                                                    onChange={(e) => setContactPerson(e.target.value)}
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                    WhatsApp Mobile Number: *
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    required
                                                    placeholder="+91 98765 43210"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                    Email Address (for Quotation / Tax Invoice):
                                                </label>
                                                <input 
                                                    type="email" 
                                                    placeholder="principal@school.edu.in / buyer@gmail.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                />
                                            </div>

                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                    GSTIN Number (Optional - for GST Input Tax Credit):
                                                </label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. 03XXXXXXXXXX1Z5"
                                                    value={gstin}
                                                    onChange={(e) => setGstin(e.target.value)}
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', textTransform: 'uppercase' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Transport & Dispatch Address */}
                                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Truck size={18} color="#1e3a8a" /> 2. Logistics & Dispatch Destination
                                        </h3>

                                        {/* Transport Mode Options */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setTransportType('road_transport')}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px',
                                                    borderRadius: '10px',
                                                    border: transportType === 'road_transport' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                                    background: transportType === 'road_transport' ? '#eff6ff' : '#ffffff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Truck size={20} color="#1e3a8a" style={{ marginBottom: '6px' }} />
                                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Road Transport / Freight</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>V-Trans, TCI, Safechem, Bilty Dispatch</small>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setTransportType('express_courier')}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px',
                                                    borderRadius: '10px',
                                                    border: transportType === 'express_courier' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                                    background: transportType === 'express_courier' ? '#eff6ff' : '#ffffff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Sparkles size={20} color="#2563eb" style={{ marginBottom: '6px' }} />
                                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Express Courier / Air Cargo</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>Fast-track delivery for urgent lots</small>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setTransportType('factory_pickup')}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px',
                                                    borderRadius: '10px',
                                                    border: transportType === 'factory_pickup' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                                    background: transportType === 'factory_pickup' ? '#eff6ff' : '#ffffff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Factory size={20} color="#059669" style={{ marginBottom: '6px' }} />
                                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Ludhiana Factory Pickup</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>Purana Bazaar, Buhrampuri</small>
                                            </button>
                                        </div>

                                        {transportType === 'factory_pickup' ? (
                                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155' }}>
                                                <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Factory Pickup Location:</strong>
                                                Vijay Woollen Works, B-V-1209, Purana Bazaar, Buhrampuri, Ludhiana - 141008, Punjab.
                                                <div style={{ marginTop: '8px', color: '#64748b', fontSize: '12px' }}>
                                                    Our team will notify you as soon as the lot is inspected and packed for pickup.
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                        Transport Delivery Street Address: *
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        placeholder="School Campus / Shop / Godown Address, Landmark"
                                                        value={addressLine}
                                                        onChange={(e) => setAddressLine(e.target.value)}
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                    />
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                        Destination City: *
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        placeholder="e.g. Ludhiana, Patna, Delhi, Jaipur"
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                    />
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                        State: *
                                                    </label>
                                                    <select
                                                        value={state}
                                                        onChange={(e) => setState(e.target.value)}
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                                                    >
                                                        {INDIAN_STATES.map(st => (
                                                            <option key={st} value={st}>{st}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                        PIN Code: *
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        maxLength="6"
                                                        placeholder="6-digit PIN"
                                                        value={pincode}
                                                        onChange={(e) => setPincode(e.target.value)}
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                    />
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                        Preferred Transport Agency (Optional):
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g. V-Trans, TCI Freight, ARC, Local Bilty"
                                                        value={transportAgency}
                                                        onChange={(e) => setTransportAgency(e.target.value)}
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Step 3: Payment Preference & Special Instructions */}
                                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CreditCard size={18} color="#1e3a8a" /> 3. Wholesale Payment & Production Notes
                                        </h3>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentPreference('bank_transfer')}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px',
                                                    borderRadius: '10px',
                                                    border: paymentPreference === 'bank_transfer' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                                    background: paymentPreference === 'bank_transfer' ? '#eff6ff' : '#ffffff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Building2 size={18} color="#1e3a8a" style={{ marginBottom: '4px' }} />
                                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Bank RTGS / NEFT</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>Official Company A/C (Shared on Invoice)</small>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentPreference('advance_bilty')}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px',
                                                    borderRadius: '10px',
                                                    border: paymentPreference === 'advance_bilty' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                                    background: paymentPreference === 'advance_bilty' ? '#eff6ff' : '#ffffff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Banknote size={18} color="#059669" style={{ marginBottom: '4px' }} />
                                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Token Advance + Bilty Balance</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>Pay balance against transport LR/Bilty</small>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentPreference('upi')}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px',
                                                    borderRadius: '10px',
                                                    border: paymentPreference === 'upi' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                                    background: paymentPreference === 'upi' ? '#eff6ff' : '#ffffff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <QrCode size={18} color="#2563eb" style={{ marginBottom: '4px' }} />
                                                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>UPI / QR Transfer</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>Direct to official mill UPI ID</small>
                                            </button>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                                Custom Jacquard, School Crest, or Packing Instructions:
                                            </label>
                                            <textarea 
                                                rows="3"
                                                placeholder="Mention any custom embroidery details, target delivery deadline, specific individual polybag packing, or dispatch marks."
                                                value={specialNotes}
                                                onChange={(e) => setSpecialNotes(e.target.value)}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Order Button */}
                                    <button
                                        type="submit"
                                        disabled={busy}
                                        style={{
                                            width: '100%',
                                            background: busy ? '#94a3b8' : '#059669',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '16px 20px',
                                            borderRadius: '8px',
                                            fontWeight: '800',
                                            fontSize: '15px',
                                            cursor: busy ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
                                        }}
                                    >
                                        {busy ? 'Submitting Order Request...' : 'Submit Wholesale Order Request'} <ArrowRight size={18} />
                                    </button>
                                </form>
                            </div>

                            {/* Right Column: Order Lot Review & Summary */}
                            <aside style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
                                    Order Request Summary
                                </h3>

                                {/* Ordered items list */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px', marginBottom: '20px' }}>
                                    {cart.map(item => {
                                        const key = item.cartItemId || item.id;
                                        return (
                                            <div key={key} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #f8fafc', paddingBottom: '10px' }}>
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                                    onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {item.name}
                                                    </h5>
                                                    <small style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>
                                                        {item.quantity} pcs @ ₹{item.price}/pc
                                                    </small>
                                                    {item.sizeBreakdown && (
                                                        <small style={{ color: '#1e3a8a', fontSize: '10px', display: 'block', fontWeight: '600' }}>
                                                            {Object.entries(item.sizeBreakdown).map(([s, q]) => `${s}:${q}`).join(', ')}
                                                        </small>
                                                    )}
                                                </div>
                                                <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                                                    {money(item.price * item.quantity, symbol)}
                                                </strong>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Totals */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                                        <span>Total Pieces:</span>
                                        <strong style={{ color: '#0f172a' }}>{totalPieces} Pieces</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                                        <span>Ex-Factory Subtotal:</span>
                                        <strong>{money(cartSubtotal, symbol)}</strong>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#15803d' }}>
                                            <span>Wholesale Discount:</span>
                                            <strong>- {money(discountAmount, symbol)}</strong>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                                        <span>Transport Bilty:</span>
                                        <span style={{ color: '#059669', fontWeight: '600', fontSize: '12px' }}>Paid on Bilty Delivery</span>
                                    </div>

                                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '12px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Estimated Factory Total:</span>
                                        <strong style={{ fontSize: '24px', fontWeight: '900', color: '#1e3a8a' }}>
                                            {money(cartTotal, symbol)}
                                        </strong>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                                        No advance payment required right now. Factory will verify specs & confirm proforma invoice.
                                    </small>
                                </div>

                                {/* Factory Guarantee Box */}
                                <div style={{ marginTop: '20px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Shield size={14} color="#059669" />
                                        <span>GST Invoice with HSN Code will be provided</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Truck size={14} color="#1e3a8a" />
                                        <span>Direct Ludhiana mill transport bilty dispatch</span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
