import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, ShoppingBag, CheckCircle, Shield, Truck, 
    Factory, Phone, MessageCircle, Maximize2, X, Plus, 
    Minus, RotateCcw, AlertTriangle, Layers, Award, Sparkles,
    ClipboardList, CheckCircle2, Building2, MapPin, ShieldCheck,
    LogIn, UserPlus, Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, money } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { Loading } from '../../../components/UI';

// Size sets for institutional knitwear & apparel
const NUMERIC_SIZES = [
    { label: 'Size 20', sub: 'Age 3-4 (Nursery)' },
    { label: 'Size 22', sub: 'Age 5-6 (KG / Class 1)' },
    { label: 'Size 24', sub: 'Age 7-8 (Class 2-3)' },
    { label: 'Size 26', sub: 'Age 9-10 (Class 4-5)' },
    { label: 'Size 28', sub: 'Age 11-12 (Class 6-7)' },
    { label: 'Size 30', sub: 'Age 13-14 (Class 8-9)' },
    { label: 'Size 32', sub: 'Age 15-16 (Class 10-11)' },
    { label: 'Size 34', sub: 'Adult XS / Class 12' },
    { label: 'Size 36', sub: 'Adult S (Chest 36")' },
    { label: 'Size 38', sub: 'Adult M (Chest 38")' },
    { label: 'Size 40', sub: 'Adult L (Chest 40")' },
    { label: 'Size 42', sub: 'Adult XL (Chest 42")' }
];

const ALPHA_SIZES = [
    { label: 'S (36)', sub: 'Chest 36"' },
    { label: 'M (38)', sub: 'Chest 38"' },
    { label: 'L (40)', sub: 'Chest 40"' },
    { label: 'XL (42)', sub: 'Chest 42"' },
    { label: 'XXL (44)', sub: 'Chest 44"' },
    { label: '3XL (46)', sub: 'Chest 46"' }
];

const ACCESSORY_SIZES = [
    { label: 'Standard / Free Size', sub: 'Universal Fit' }
];

const STANDARD_COLORS = [
    { name: 'Navy Blue', hex: '#1e3a8a' },
    { name: 'Maroon', hex: '#831843' },
    { name: 'Bottle Green', hex: '#14532d' },
    { name: 'Black', hex: '#0f172a' },
    { name: 'Royal Blue', hex: '#2563eb' },
    { name: 'Steel Grey', hex: '#475569' },
    { name: 'Camel / Brown', hex: '#78350f' },
    { name: 'White / Cream', hex: '#f8fafc' }
];

export function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addCart, settings, user, login, register } = useApp();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeModalImage, setActiveModalImage] = useState(null);

    // Scroll to top whenever product changes
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [id]);

    // Sizing state
    const [sizeMode, setSizeMode] = useState('numeric'); // 'numeric' | 'alpha' | 'accessory'
    const [sizeQuantities, setSizeQuantities] = useState({});
    const [selectedColor, setSelectedColor] = useState('Navy Blue');
    const [withEmbroidery, setWithEmbroidery] = useState(false);
    const [customNotes, setCustomNotes] = useState('');

    // Sample Request Modal State
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [sampleSize, setSampleSize] = useState('Size 28');
    const [sampleColor, setSampleColor] = useState('Navy Blue');
    const [sampleOrg, setSampleOrg] = useState('');
    const [sampleName, setSampleName] = useState('');
    const [samplePhone, setSamplePhone] = useState('');
    const [sampleEmail, setSampleEmail] = useState('');
    const [sampleAddress, setSampleAddress] = useState('');
    const [sampleCity, setSampleCity] = useState('');
    const [samplePincode, setSamplePincode] = useState('');
    const [sampleNotes, setSampleNotes] = useState('');
    const [sampleSubmitting, setSampleSubmitting] = useState(false);
    const [sampleSuccess, setSampleSuccess] = useState(null);

    // Inline Auth within Sample Modal
    const [sampleAuthTab, setSampleAuthTab] = useState('signin'); // 'signin' | 'register'
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authOrg, setAuthOrg] = useState('');
    const [authPhone, setAuthPhone] = useState('');
    const [authBusy, setAuthBusy] = useState(false);

    const handleModalLogin = async (e) => {
        if (e) e.preventDefault();
        if (!authEmail.trim() || !authPassword.trim()) {
            toast.error('Please enter email and password');
            return;
        }
        setAuthBusy(true);
        try {
            await login({ email: authEmail.trim(), password: authPassword });
            toast.success('Signed in successfully! Continue with your sample request.');
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setAuthBusy(false);
        }
    };

    const handleModalRegister = async (e) => {
        if (e) e.preventDefault();
        if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
            toast.error('Please fill in name, email, and password');
            return;
        }
        if (authPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setAuthBusy(true);
        try {
            await register({
                name: authName.trim(),
                orgName: authOrg.trim(),
                email: authEmail.trim(),
                phone: authPhone.trim(),
                password: authPassword
            });
            toast.success('Account created! Continue with your sample request below.');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setAuthBusy(false);
        }
    };

    // Pre-fill sample form from logged-in user
    useEffect(() => {
        if (user) {
            if (user.name) setSampleName(user.name);
            if (user.phone) setSamplePhone(user.phone);
            if (user.email) setSampleEmail(user.email);
            if (user.orgName) setSampleOrg(user.orgName);
            if (user.address) setSampleAddress(user.address);
            if (user.city) setSampleCity(user.city);
            if (user.pincode) setSamplePincode(user.pincode);
        }
    }, [user]);

    useEffect(() => {
        let active = true;
        setLoading(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        api.get(`/menu/${id}`)
            .then(res => {
                if (!active) return;
                const p = res.data.data;
                setProduct(p);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

                // Determine appropriate size mode based on product name/category
                const text = (p.name + ' ' + (p.category?.name || '')).toLowerCase();
                let mode = 'numeric';
                if (text.includes('cap') || text.includes('tie') || text.includes('muffler') || text.includes('accessory')) {
                    mode = 'accessory';
                } else if (text.includes('hoodie') || text.includes('tracksuit') || text.includes('t-shirt') || text.includes('tshirt') || text.includes('jacket') || text.includes('corporate')) {
                    mode = 'alpha';
                }
                setSizeMode(mode);
                setSampleSize(mode === 'accessory' ? 'Standard / Free Size' : (mode === 'alpha' ? 'M (38)' : 'Size 28'));

                // Set initial default quantity for the mode
                const moq = p.prepMinutes || 50;
                if (mode === 'accessory') {
                    setSizeQuantities({ 'Standard / Free Size': moq });
                } else if (mode === 'alpha') {
                    setSizeQuantities({
                        'M (38)': Math.round(moq * 0.4),
                        'L (40)': Math.round(moq * 0.4),
                        'XL (42)': Math.round(moq * 0.2)
                    });
                } else {
                    // Spread across popular school sizes
                    setSizeQuantities({
                        'Size 26': 10,
                        'Size 28': 15,
                        'Size 30': 15,
                        'Size 32': 10
                    });
                }

                // Fetch related products in the same category
                if (p.category?._id) {
                    api.get(`/menu?category=${p.category._id}`)
                        .then(relRes => {
                            if (active) {
                                setRelatedProducts((relRes.data.data || []).filter(x => x._id !== p._id).slice(0, 4));
                            }
                        })
                        .catch(() => {});
                }
            })
            .catch(err => {
                if (active) {
                    toast.error(err.message || 'Product not found');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loading />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h2>Product Not Found</h2>
                <p style={{ color: '#64748b', margin: '16px 0 24px' }}>
                    The apparel item you are looking for is either discontinued or unavailable.
                </p>
                <Link to="/menu" style={{ background: '#1e3a8a', color: '#ffffff', padding: '10px 24px', borderRadius: '6px', fontWeight: '700', textDecoration: 'none' }}>
                    Browse Product Catalog
                </Link>
            </div>
        );
    }

    const availableSizes = sizeMode === 'accessory' 
        ? ACCESSORY_SIZES 
        : (sizeMode === 'alpha' ? ALPHA_SIZES : NUMERIC_SIZES);

    const moq = product.prepMinutes || 50;
    const totalPieces = Object.values(sizeQuantities).reduce((acc, qty) => acc + (Number(qty) || 0), 0);
    const embroideryCostPerPc = withEmbroidery ? 15 : 0;
    const effectiveUnitPrice = product.price + embroideryCostPerPc;
    const estimatedSubtotal = totalPieces * effectiveUnitPrice;
    const meetsMoq = totalPieces >= moq;

    // Automatically detect size clicked on the page, or default to standard sample size
    const chosenSizeEntry = Object.entries(sizeQuantities).find(([_, qty]) => Number(qty) > 0);
    const effectiveSampleSize = chosenSizeEntry ? chosenSizeEntry[0] : (sizeMode === 'accessory' ? 'Standard / Free Size' : (sizeMode === 'alpha' ? 'M (38)' : 'Size 28'));

    const handleQtyChange = (label, value) => {
        const val = Math.max(0, parseInt(value, 10) || 0);
        setSizeQuantities(prev => ({
            ...prev,
            [label]: val
        }));
    };

    const handleIncrement = (label, step = 5) => {
        setSizeQuantities(prev => ({
            ...prev,
            [label]: (prev[label] || 0) + step
        }));
    };

    const handleDecrement = (label, step = 5) => {
        setSizeQuantities(prev => ({
            ...prev,
            [label]: Math.max(0, (prev[label] || 0) - step)
        }));
    };

    const handleBulkFill = (countPerSize) => {
        const updated = {};
        availableSizes.forEach(s => {
            updated[s.label] = countPerSize;
        });
        setSizeQuantities(updated);
        toast.success(`Set ${countPerSize} pcs across all ${availableSizes.length} sizes`);
    };

    const handleResetSizes = () => {
        setSizeQuantities({});
        toast('Sizes reset');
    };

    const handleAddToCart = (redirectAfter = false) => {
        if (totalPieces <= 0) {
            toast.error('Please enter the number of pieces for at least one size.');
            return;
        }

        const breakdown = {};
        Object.entries(sizeQuantities).forEach(([k, v]) => {
            if (v > 0) breakdown[k] = v;
        });

        const customization = {
            color: selectedColor,
            withEmbroidery,
            notes: customNotes
        };

        addCart(
            { ...product, price: effectiveUnitPrice },
            breakdown,
            totalPieces,
            customization
        );

        toast.success(`Added ${totalPieces} pcs of ${product.name} to wholesale request!`);

        if (redirectAfter) {
            navigate('/checkout');
        }
    };

    // Submit Sample Request
    const handleSampleSubmit = async (e) => {
        e.preventDefault();
        if (!sampleName.trim() || !samplePhone.trim() || !sampleAddress.trim()) {
            toast.error('Please provide contact person, mobile number, and courier address');
            return;
        }

        setSampleSubmitting(true);
        const sampleRef = `VWW-SMP-${Math.floor(1000 + Math.random() * 9000)}`;
        const finalColor = selectedColor || 'Navy Blue';
        const finalSize = effectiveSampleSize;

        try {
            let assignedRef = sampleRef;
            if (user) {
                const bRes = await api.post('/bookings', {
                    bookingNumber: sampleRef,
                    date: new Date().toISOString().slice(0, 10),
                    time: '11:00',
                    guests: 1,
                    name: sampleName.trim(),
                    email: sampleEmail.trim() || user.email,
                    phone: samplePhone.trim(),
                    occasion: `${product.name} (${finalSize}, ${finalColor})`,
                    notes: `Sample Courier Address: ${sampleAddress}, ${sampleCity} - PIN: ${samplePincode}.\nInstitution: ${sampleOrg || 'N/A'}\nNote: ${sampleNotes || 'None'}`
                });
                if (bRes.data?.data?.bookingNumber) {
                    assignedRef = bRes.data.data.bookingNumber;
                }
            } else {
                await api.post('/inquiries', {
                    name: sampleName.trim(),
                    email: sampleEmail.trim() || 'sample@client.com',
                    phone: samplePhone.trim(),
                    subject: `Sample Request: ${product.name} (${finalSize}, ${finalColor}) - ${sampleOrg || sampleName}`,
                    message: `Sample Ref: ${sampleRef}\nProduct: ${product.name}\nSize: ${finalSize}\nColor: ${finalColor}\nInstitution: ${sampleOrg || 'N/A'}\nCourier Destination: ${sampleAddress}, ${sampleCity} (PIN: ${samplePincode})\nNotes: ${sampleNotes || 'N/A'}`
                });
            }

            setSampleSuccess({
                ref: assignedRef,
                product: product.name,
                size: finalSize,
                color: finalColor,
                recipient: sampleName,
                phone: samplePhone,
                address: `${sampleAddress}, ${sampleCity} ${samplePincode}`
            });
            toast.success('Sample request recorded! Our Ludhiana mill desk will contact you.');
        } catch (err) {
            toast.error(err.message || 'Failed to submit sample request');
        } finally {
            setSampleSubmitting(false);
        }
    };

    // Format WhatsApp prefilled message
    const sizeDetailsSummary = Object.entries(sizeQuantities)
        .filter(([_, q]) => q > 0)
        .map(([s, q]) => `${s}: ${q} pcs`)
        .join(', ');

    const waText = encodeURIComponent(
        `Hi Vijay Woollen Works,\nI am interested in placing an order request for:\n*${product.name}*\n` +
        `Category: ${product.category?.name || 'Uniform'}\n` +
        `Total Quantity: ${totalPieces} pcs\n` +
        `Size Breakdown: ${sizeDetailsSummary || 'To be decided'}\n` +
        `Color: ${selectedColor}\n` +
        `Embroidery: ${withEmbroidery ? 'Yes (Logo needed)' : 'Plain / None'}\n` +
        `Estimated Factory Rate: ₹${effectiveUnitPrice}/pc (Total: ₹${estimatedSubtotal.toLocaleString('en-IN')})\n\n` +
        `Please confirm stock / manufacturing lead time and proforma invoice.`
    );

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '90px' }}>
            {/* Top Breadcrumb Bar */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link to="/menu" style={{ color: '#64748b', textDecoration: 'none' }}>Product Catalog</Link>
                        <span>/</span>
                        <span style={{ color: '#1e3a8a', fontWeight: '700' }}>{product.category?.name || 'Uniforms'}</span>
                        <span>/</span>
                        <span style={{ color: '#0f172a', fontWeight: '600' }}>{product.name}</span>
                    </div>

                    <Link 
                        to="/menu" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}
                    >
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                </div>
            </div>

            {/* Main Product Showcase Grid */}
            <div className="container" style={{ marginTop: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '32px', alignItems: 'start' }}>
                    
                    {/* LEFT COLUMN: Large Responsive Image & Manufacturer Specs */}
                    <div>
                        <div 
                            style={{ 
                                background: '#ffffff', 
                                borderRadius: '16px', 
                                border: '1px solid #e2e8f0', 
                                overflow: 'hidden', 
                                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                                position: 'relative'
                            }}
                        >
                            {/* Product Image Container */}
                            <div 
                                onClick={() => setActiveModalImage({ url: product.image, title: product.name })}
                                title="Click to enlarge"
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 'clamp(300px, 36vw, 520px)',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                                    onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                />
                                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ background: '#1e3a8a', color: '#ffffff', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.04em' }}>
                                        FACTORY DIRECT MOQ: {moq} PCS
                                    </span>
                                    <span style={{ background: '#059669', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                                        GENUINE LUDHIANA KNITWEAR
                                    </span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setActiveModalImage({ url: product.image, title: product.name }); }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '16px',
                                        right: '16px',
                                        background: 'rgba(15,23,42,0.85)',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '7px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Maximize2 size={14} /> Enlarge View
                                </button>
                            </div>

                            {/* Manufacturer Credentials Strip */}
                            <div style={{ padding: '18px 20px', background: '#0f172a', color: '#ffffff' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', textAlign: 'center' }}>
                                    <div>
                                        <Factory size={20} color="#60a5fa" style={{ margin: '0 auto 4px' }} />
                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>Direct Ludhiana Mill</div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>B-V-1209, Purana Bazaar</div>
                                    </div>
                                    <div>
                                        <Shield size={20} color="#34d399" style={{ margin: '0 auto 4px' }} />
                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>GSTIN Verified</div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>03AWNPV3468J1ZX</div>
                                    </div>
                                    <div>
                                        <Truck size={20} color="#f59e0b" style={{ margin: '0 auto 4px' }} />
                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>Pan-India Transport</div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Direct Bilty Dispatch</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Manufacturing Specifications */}
                        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '22px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Layers size={18} color="#1e3a8a" /> Technical Knitwear Specifications
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Yarn Blend</span>
                                    <strong style={{ color: '#0f172a' }}>100% Cashmilon / Woollen Blend</strong>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Knitting Gauge</span>
                                    <strong style={{ color: '#0f172a' }}>10GG / 12GG Computerized Flat</strong>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Anti-Pilling Grade</span>
                                    <strong style={{ color: '#0f172a' }}>Grade 4+ Tested (Lint Resistant)</strong>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Dyeing Fastness</span>
                                    <strong style={{ color: '#0f172a' }}>Reactive Fast Colors (No Bleed)</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Wholesale Ordering, Size Matrix & Sample Request */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: 'clamp(18px, 3vw, 32px)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                        {/* Title & Brand Header */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    {product.category?.name || 'Institutional Uniforms'}
                                </span>
                                <span style={{ color: '#059669', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Award size={14} /> Official Vijay Woollen Works Catalog
                                </span>
                            </div>

                            <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '800', color: '#0f172a', margin: '10px 0 8px', lineHeight: '1.3' }}>
                                {product.name}
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '18px' }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Wholesale Price Box */}
                        <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                            <div>
                                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                                    Wholesale Factory Rate
                                </span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <strong style={{ fontSize: '30px', color: '#1e3a8a', fontWeight: '900' }}>
                                        ₹{effectiveUnitPrice}
                                    </strong>
                                    <span style={{ color: '#475569', fontSize: '13px', fontWeight: '600' }}>/ piece (ex-factory)</span>
                                </div>
                                {withEmbroidery && (
                                    <small style={{ color: '#2563eb', fontWeight: '700', fontSize: '11px' }}>
                                        Includes ₹15/pc Computerized Logo Embroidery
                                    </small>
                                )}
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
                                    Min. Order Quantity (MOQ)
                                </span>
                                <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>
                                    {moq} pieces
                                </strong>
                                <span style={{ fontSize: '11px', color: '#059669', display: 'block', fontWeight: '600' }}>
                                    Mix & Match Sizes Allowed
                                </span>
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                1. Select Base Color: <span style={{ color: '#1e3a8a' }}>{selectedColor}</span>
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {STANDARD_COLORS.map(c => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => setSelectedColor(c.name)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            border: selectedColor === c.name ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                            background: selectedColor === c.name ? '#eff6ff' : '#ffffff',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: selectedColor === c.name ? '700' : '500',
                                            color: '#0f172a'
                                        }}
                                    >
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Embroidery Addon */}
                        <div style={{ marginBottom: '22px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                                        School / Institution Logo Embroidery
                                    </strong>
                                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                                        High-precision computerized chest crest or sleeve badge (+ ₹15/pc)
                                    </small>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={withEmbroidery}
                                    onChange={(e) => setWithEmbroidery(e.target.checked)}
                                    id="embroideryCheckbox"
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1e3a8a' }}
                                />
                            </div>
                        </div>

                        {/* INTERACTIVE SIZE & QUANTITY MATRIX */}
                        <div style={{ marginBottom: '22px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        2. Enter Pieces by Size (Size Matrix)
                                    </label>
                                    <small style={{ display: 'block', color: '#64748b', fontSize: '11px' }}>
                                        Input the required pieces for each size tier
                                    </small>
                                </div>

                                {/* Sizing Switcher */}
                                <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '6px', padding: '2px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setSizeMode('numeric')}
                                        style={{
                                            border: 'none',
                                            background: sizeMode === 'numeric' ? '#ffffff' : 'transparent',
                                            color: sizeMode === 'numeric' ? '#1e3a8a' : '#64748b',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Uniform (20-42)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSizeMode('alpha')}
                                        style={{
                                            border: 'none',
                                            background: sizeMode === 'alpha' ? '#ffffff' : 'transparent',
                                            color: sizeMode === 'alpha' ? '#1e3a8a' : '#64748b',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Standard (S-3XL)
                                    </button>
                                </div>
                            </div>

                            {/* Quick Batch Increment Helpers */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Quick Fill:</span>
                                <button type="button" onClick={() => handleBulkFill(10)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+10 each</button>
                                <button type="button" onClick={() => handleBulkFill(25)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+25 each</button>
                                <button type="button" onClick={() => handleBulkFill(50)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+50 each</button>
                                <button type="button" onClick={handleResetSizes} style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <RotateCcw size={11} /> Clear
                                </button>
                            </div>

                            {/* Size Grid Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                                {availableSizes.map(size => {
                                    const qty = sizeQuantities[size.label] || 0;
                                    const hasQty = qty > 0;
                                    return (
                                        <div 
                                            key={size.label}
                                            style={{
                                                border: hasQty ? '2px solid #1e3a8a' : '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                padding: '8px 10px',
                                                background: hasQty ? '#eff6ff' : '#ffffff',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{size.label}</strong>
                                                {hasQty && (
                                                    <span style={{ fontSize: '10px', background: '#1e3a8a', color: '#ffffff', padding: '1px 4px', borderRadius: '3px', fontWeight: '700' }}>
                                                        {qty} pcs
                                                    </span>
                                                )}
                                            </div>
                                            <small style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                                                {size.sub}
                                            </small>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(size.label, 5)}
                                                    style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '800' }}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    value={qty || ''}
                                                    placeholder="0"
                                                    onChange={(e) => handleQtyChange(size.label, e.target.value)}
                                                    style={{ width: '100%', height: '28px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(size.label, 5)}
                                                    style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '800' }}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* LIVE WHOLESALE CALCULATION & MOQ STATUS */}
                        <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '10px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Quantity Selected:</span>
                                <strong style={{ fontSize: '17px', color: '#ffffff' }}>
                                    {totalPieces} Pieces
                                </strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Estimated Wholesale Value:</span>
                                <strong style={{ fontSize: '22px', color: '#38bdf8', fontWeight: '900' }}>
                                    ₹{estimatedSubtotal.toLocaleString('en-IN')}
                                </strong>
                            </div>

                            {/* MOQ Status Banner */}
                            {meetsMoq ? (
                                <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#a7f3d0', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                                    <CheckCircle size={14} color="#34d399" />
                                    Meets MOQ Requirement ({totalPieces} / {moq} pcs qualified for factory wholesale rate)
                                </div>
                            ) : (
                                <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fde68a', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                    <AlertTriangle size={14} color="#fbbf24" />
                                    Minimum Order Quantity is {moq} pcs. Add {moq - totalPieces} more pieces to qualify.
                                </div>
                            )}
                        </div>

                        {/* ORDER & SAMPLE ACTIONS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => handleAddToCart(false)}
                                    style={{
                                        background: '#1e3a8a',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '13px 18px',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
                                    }}
                                >
                                    <ShoppingBag size={17} /> Add to Order Request
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleAddToCart(true)}
                                    style={{
                                        background: '#059669',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '13px 18px',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                                    }}
                                >
                                    Proceed to Checkout →
                                </button>
                            </div>

                            {/* REQUEST FACTORY SAMPLE PIECE BUTTON */}
                            <button
                                type="button"
                                onClick={() => setShowSampleModal(true)}
                                style={{
                                    background: '#ffffff',
                                    color: '#1e3a8a',
                                    border: '2px solid #1e3a8a',
                                    borderRadius: '8px',
                                    padding: '11px 18px',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <ClipboardList size={17} /> Request Fabric & Quality Sample Piece
                            </button>

                            {/* Direct WhatsApp Quote Button */}
                            <a
                                href={`https://wa.me/918427257106?text=${waText}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    background: '#22c55e',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    padding: '11px 18px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    textDecoration: 'none'
                                }}
                            >
                                <MessageCircle size={17} /> Inquire on WhatsApp (+91-8427257106)
                            </a>
                        </div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: '50px', borderTop: '1px solid #e2e8f0', paddingTop: '36px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <span style={{ color: '#1e3a8a', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    Related Products
                                </span>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '2px 0 0' }}>
                                    More {product.category?.name || 'Uniform & Knitwear'} Solutions
                                </h2>
                            </div>
                            <Link to="/menu" style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '12px', textDecoration: 'none' }}>
                                View Full Catalog →
                            </Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                            {relatedProducts.map(rel => (
                                <Link 
                                    to={`/product/${rel.slug || rel._id}`} 
                                    key={rel._id}
                                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                    style={{
                                        textDecoration: 'none',
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                >
                                    <div style={{ height: '180px', background: '#f8fafc', overflow: 'hidden' }}>
                                        <img 
                                            src={rel.image} 
                                            alt={rel.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                        />
                                    </div>
                                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <small style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                                            MOQ: {rel.prepMinutes || 50} pcs
                                        </small>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '3px 0 6px' }}>
                                            {rel.name}
                                        </h4>
                                        <strong style={{ marginTop: 'auto', color: '#1e3a8a', fontSize: '15px', fontWeight: '800' }}>
                                            ₹{rel.price} <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>/ pc</span>
                                        </strong>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* SAMPLE REQUEST MODAL */}
            {showSampleModal && (
                <div 
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        overflowY: 'auto'
                    }}
                >
                    <div 
                        style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            maxWidth: '560px',
                            width: '100%',
                            padding: '24px',
                            position: 'relative',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => { setShowSampleModal(false); setSampleSuccess(null); }}
                            style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <X size={18} />
                        </button>

                        {sampleSuccess ? (
                            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                    <CheckCircle2 size={36} color="#15803d" />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                                    Sample Request Received!
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                                    Reference ID: <strong style={{ color: '#1e3a8a' }}>{sampleSuccess.ref}</strong>. Our Ludhiana mill team will verify sample availability and dispatch via courier.
                                </p>
                                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', fontSize: '12px', textAlign: 'left', marginBottom: '18px' }}>
                                    <div><strong>Product:</strong> {sampleSuccess.product}</div>
                                    <div><strong>Sample Size:</strong> {sampleSuccess.size}</div>
                                    <div><strong>Color:</strong> {sampleSuccess.color}</div>
                                    <div><strong>Courier Destination:</strong> {sampleSuccess.address}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Link
                                        to="/account/bookings"
                                        onClick={() => { setShowSampleModal(false); setSampleSuccess(null); }}
                                        style={{ background: '#1e3a8a', color: '#ffffff', padding: '10px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <Package size={16} /> Track in Client Portal (/account/bookings)
                                    </Link>
                                    <a
                                        href={`https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20I%20requested%20sample%20ref%20${sampleSuccess.ref}%20for%20${encodeURIComponent(sampleSuccess.product)}.`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ background: '#22c55e', color: '#ffffff', padding: '10px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <MessageCircle size={16} /> Confirm on WhatsApp (+91-8427257106)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => { setShowSampleModal(false); setSampleSuccess(null); }}
                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '9px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : !user ? (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', marginBottom: '6px' }}>
                                    <ShieldCheck size={22} color="#1e3a8a" />
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                        Client Sign In Required
                                    </h3>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px', lineHeight: '1.5' }}>
                                    Please sign in or register your school / institution before requesting a sample piece of <strong>{product.name}</strong>. This allows you to track courier dispatches, get factory updates, and manage bulk quotes in your client portal.
                                </p>

                                {/* Tab switcher: Sign In vs Register */}
                                <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setSampleAuthTab('signin')}
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: sampleAuthTab === 'signin' ? '#ffffff' : 'transparent',
                                            color: sampleAuthTab === 'signin' ? '#1e3a8a' : '#64748b',
                                            fontWeight: '700',
                                            fontSize: '12px',
                                            boxShadow: sampleAuthTab === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <LogIn size={14} /> Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSampleAuthTab('register')}
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: sampleAuthTab === 'register' ? '#ffffff' : 'transparent',
                                            color: sampleAuthTab === 'register' ? '#1e3a8a' : '#64748b',
                                            fontWeight: '700',
                                            fontSize: '12px',
                                            boxShadow: sampleAuthTab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <UserPlus size={14} /> Register Institution
                                    </button>
                                </div>

                                {sampleAuthTab === 'signin' ? (
                                    <form onSubmit={handleModalLogin}>
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Email Address: *
                                            </label>
                                            <input 
                                                type="email"
                                                required
                                                placeholder="institutional@school.edu.in"
                                                value={authEmail}
                                                onChange={(e) => setAuthEmail(e.target.value)}
                                                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Password: *
                                            </label>
                                            <input 
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={authPassword}
                                                onChange={(e) => setAuthPassword(e.target.value)}
                                                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={authBusy}
                                            style={{
                                                width: '100%',
                                                background: '#1e3a8a',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '11px',
                                                fontWeight: '700',
                                                fontSize: '13px',
                                                cursor: authBusy ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {authBusy ? 'Signing in...' : 'Sign In & Continue to Sample Form'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleModalRegister}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                    Your Name: *
                                                </label>
                                                <input 
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Ramesh Kumar"
                                                    value={authName}
                                                    onChange={(e) => setAuthName(e.target.value)}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                    Institution / School Name:
                                                </label>
                                                <input 
                                                    type="text"
                                                    placeholder="e.g. Delhi Public School"
                                                    value={authOrg}
                                                    onChange={(e) => setAuthOrg(e.target.value)}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                    Email Address: *
                                                </label>
                                                <input 
                                                    type="email"
                                                    required
                                                    placeholder="principal@school.com"
                                                    value={authEmail}
                                                    onChange={(e) => setAuthEmail(e.target.value)}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                    WhatsApp / Mobile: *
                                                </label>
                                                <input 
                                                    type="tel"
                                                    required
                                                    placeholder="+91-9876543210"
                                                    value={authPhone}
                                                    onChange={(e) => setAuthPhone(e.target.value)}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '14px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                                Password (min 8 characters): *
                                            </label>
                                            <input 
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={authPassword}
                                                onChange={(e) => setAuthPassword(e.target.value)}
                                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={authBusy}
                                            style={{
                                                width: '100%',
                                                background: '#1e3a8a',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '11px',
                                                fontWeight: '700',
                                                fontSize: '13px',
                                                cursor: authBusy ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {authBusy ? 'Creating account...' : 'Register & Continue to Sample Form'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSampleSubmit}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', marginBottom: '4px' }}>
                                    <ClipboardList size={20} />
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                        Request Quality Sample Swatch
                                    </h3>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 12px' }}>
                                    Order a fabric sample piece of <strong>{product.name}</strong> to inspect yarn gauge, weight, and stitch quality before bulk order.
                                </p>

                                {/* Verified Client Banner */}
                                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>
                                            {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#166534' }}>
                                            Client: <strong>{user.name}</strong> {user.orgName ? `(${user.orgName})` : ''}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                                        Verified
                                    </span>
                                </div>

                                {/* Automatically Selected Product & Color Card (No redundant dropdowns) */}
                                <div style={{ 
                                    background: '#eff6ff', 
                                    border: '1.5px solid #bfdbfe', 
                                    borderRadius: '8px', 
                                    padding: '12px 14px', 
                                    marginBottom: '14px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    gap: '12px' 
                                }}>
                                    <div>
                                        <span style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                                            Selected Item For Sample:
                                        </span>
                                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '2px 0 4px' }}>
                                            {product.name}
                                        </h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                                            <span>Base Color: <strong style={{ color: '#1e3a8a' }}>{selectedColor}</strong></span>
                                            <span>·</span>
                                            <span>Sample Size: <strong style={{ color: '#1e3a8a' }}>{effectiveSampleSize}</strong></span>
                                        </div>
                                    </div>
                                    <div 
                                        style={{ 
                                            width: '36px', 
                                            height: '36px', 
                                            borderRadius: '50%', 
                                            background: (STANDARD_COLORS.find(c => c.name === selectedColor)?.hex || '#1e3a8a'), 
                                            border: '3px solid #ffffff', 
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.18)', 
                                            flexShrink: 0 
                                        }} 
                                        title={`Selected Color: ${selectedColor}`} 
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                            Institution / School Name:
                                        </label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. St. Xavier's Convent"
                                            value={sampleOrg}
                                            onChange={(e) => setSampleOrg(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                            Contact Person Name: *
                                        </label>
                                        <input 
                                            type="text"
                                            required
                                            placeholder="Full Name"
                                            value={sampleName}
                                            onChange={(e) => setSampleName(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                            WhatsApp Mobile Number: *
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px' }}>
                                            <select
                                                style={{ padding: '8px 4px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', background: '#f8fafc', fontWeight: '700' }}
                                                defaultValue="+91"
                                                onChange={(e) => {
                                                    const code = e.target.value;
                                                    setSamplePhone(prev => {
                                                        const clean = prev.replace(/^\+[0-9]+\s*/, '');
                                                        return `${code} ${clean}`.trim();
                                                    });
                                                }}
                                            >
                                                <option value="+91">🇮🇳 +91</option>
                                                <option value="+971">🇦🇪 +971</option>
                                                <option value="+1">🇺🇸 +1</option>
                                                <option value="+44">🇬🇧 +44</option>
                                                <option value="+61">🇦🇺 +61</option>
                                                <option value="+65">🇸🇬 +65</option>
                                            </select>
                                            <input 
                                                type="tel"
                                                required
                                                placeholder="9876543210"
                                                value={samplePhone.replace(/^\+[0-9]+\s*/, '')}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setSamplePhone(val.startsWith('+') ? val : `+91 ${val}`);
                                                }}
                                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                            Email Address:
                                        </label>
                                        <input 
                                            type="email"
                                            placeholder="sample@school.edu.in"
                                            value={sampleEmail}
                                            onChange={(e) => setSampleEmail(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        Courier Delivery Address: *
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Street Address, Campus / Office Landmark"
                                        value={sampleAddress}
                                        onChange={(e) => setSampleAddress(e.target.value)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '8px' }}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <input 
                                            type="text"
                                            placeholder="City"
                                            value={sampleCity}
                                            onChange={(e) => setSampleCity(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                        />
                                        <input 
                                            type="text"
                                            placeholder="PIN Code"
                                            value={samplePincode}
                                            onChange={(e) => setSamplePincode(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        Specific Pattern or Logo Details:
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Include school crest patch / 2-stripe collar"
                                        value={sampleNotes}
                                        onChange={(e) => setSampleNotes(e.target.value)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sampleSubmitting}
                                    style={{
                                        width: '100%',
                                        background: sampleSubmitting ? '#94a3b8' : '#1e3a8a',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        fontWeight: '800',
                                        fontSize: '14px',
                                        cursor: sampleSubmitting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {sampleSubmitting ? 'Submitting Sample Request...' : 'Submit Sample Request to Mill'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* MOBILE FLOATING ACTION BAR (< 768px) */}
            <div className="product-mobile-bar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#ffffff',
                borderTop: '1px solid #cbd5e1',
                padding: '10px 16px',
                zIndex: 900,
                display: 'none',
                boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {totalPieces > 0 ? `${totalPieces} pcs selected` : `MOQ: ${moq} pcs`}
                        </div>
                        <strong style={{ fontSize: '16px', color: '#1e3a8a' }}>
                            {totalPieces > 0 ? `₹${estimatedSubtotal.toLocaleString('en-IN')}` : `₹${effectiveUnitPrice}/pc`}
                        </strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => setShowSampleModal(true)}
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #1e3a8a',
                                color: '#1e3a8a',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Sample
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAddToCart(true)}
                            style={{
                                background: '#1e3a8a',
                                color: '#ffffff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <ShoppingBag size={14} /> Order
                        </button>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
            {activeModalImage && (
                <div 
                    onClick={() => setActiveModalImage(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.94)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        cursor: 'zoom-out'
                    }}
                >
                    <button
                        onClick={() => setActiveModalImage(null)}
                        aria-label="Close fullscreen view"
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>
                    <div style={{ maxWidth: '92vw', maxHeight: '86vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                            src={activeModalImage.url} 
                            alt={activeModalImage.title}
                            style={{ maxWidth: '92vw', maxHeight: '84vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
                        />
                    </div>
                    {activeModalImage.title && (
                        <p style={{ color: '#ffffff', marginTop: '14px', fontSize: '16px', fontWeight: '700', textAlign: 'center' }}>
                            {activeModalImage.title}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
