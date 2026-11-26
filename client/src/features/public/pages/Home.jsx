import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ArrowRight, ArrowUpRight, Phone, MessageCircle, ShieldCheck, 
    Truck, Award, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, 
    Download, Factory, Tag, Layers, Star, Maximize2, X
} from 'lucide-react';
import { useFetch, Loading, ErrorState } from '../../../components/UI';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';
import { api } from '../../../api';

// Default Hero Slider Data
const defaultHeroSlides = [
    {
        badge: 'GST: 03AWNPV3468J1ZX · MSME UDYAM CERTIFIED',
        title: "India's Trusted Manufacturer of School Uniforms & Winter Knitwear",
        subtitle: 'Direct factory production from Ludhiana, Punjab. Specialized in acrylic-wool sweaters, blazers, tracksuits, hoodies, and customized institutional uniforms.',
        ctaPrimary: { text: 'Explore Product Catalog', to: '/menu' },
        ctaSecondary: { text: 'Request Bulk Quote', to: '/booking' },
        image: '/vww/branding/Vijay Woollen Works Apparel Solutions.png',
        tagline: 'LUDHIANA KNITWEAR HUB · 100+ CLIENTS ACROSS INDIA'
    },
    {
        badge: 'SPECIAL SEASONAL DISCOUNTS AVAILABLE NOW',
        title: 'Annual Bumper Wholesale Offer on Winter Sweaters',
        subtitle: 'Special wholesale bulk pricing for school dealers, distributors, and academies. Sizes 20 to 36 ready for immediate production and dispatched securely by railway/road cargo.',
        ctaPrimary: { text: 'View Wholesale Offers', to: '#offers' },
        ctaSecondary: { text: 'WhatsApp Inquiry', href: 'https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20I%20want%20to%20know%20about%20the%20Annual%20Bumper%20Wholesale%20Offer.' },
        image: '/vww/offers/Vijay Woollen Works Annual Bumper Offer (1).png',
        tagline: 'FACTORY DIRECT WHOLESALE · TRANSPARENT DISPATCH'
    },
    {
        badge: 'CORPORATE · INDUSTRIAL · SPORTSWEAR SOLUTIONS',
        title: 'Custom Uniforms, Computerized Embroidery & Private Label',
        subtitle: 'Tailored executive blazers, thermal industrial winter jackets, active sports tracksuits, and complete private label packaging with your brand woven neck labels.',
        ctaPrimary: { text: 'Custom Manufacturing', to: '/about' },
        ctaSecondary: { text: 'Call: +91 84272 57106', href: 'tel:+918427257106' },
        image: '/vww/categories/Vijay Woollen Works Uniform Solutions.png',
        tagline: 'PREMIUM QUALITY YARN · TESTED DURABILITY'
    }
];

const defaultOffersData = {
    tagline: 'Seasonal Wholesale Promotions',
    title: 'Daily Offers & Annual Bumper Deals',
    subtitle: 'Factory-direct discounts on bulk bookings for schools, institutions, and dealers across India.',
    card1: {
        badge: 'LIMITED TIME DEAL',
        title: 'Annual Bumper Wholesale Offer',
        subtitle: 'Special reduced rate contracts for complete school sets (Sweaters, Blazers, Ties, and Belts). Pre-book your season demand with 50% advance and guaranteed dispatch schedule.',
        moq: 'MOQ: 50+',
        image: '/vww/offers/Vijay Woollen Works Annual Bumper Offer (1).png',
        whatsappMsg: 'Hi Vijay Woollen Works, please share details for the Annual Bumper Offer.'
    },
    card2: {
        badge: 'PRE-WINTER DISCOUNT',
        title: 'Pre-Winter Bulk Booking Rate',
        subtitle: 'Lock in factory rates on V-neck school uniform pullovers and athletic tracksuits before peak season yarn price spikes. Free sample swatch dispatch for institutional committees.',
        moq: 'MOQ: 100+',
        image: '/vww/offers/Vijay Woollen Works Wholesale Offer.png',
        whatsappMsg: 'Hi Vijay Woollen Works, please share details for Pre-Winter Bulk Booking.'
    }
};

// Factory Highlights
const factoryHighlights = [
    {
        icon: Factory,
        title: 'Ludhiana Manufacturing Base',
        description: 'Direct factory dispatch from India’s knitwear capital, eliminating middlemen.'
    },
    {
        icon: ShieldCheck,
        title: 'GST & MSME Registered',
        description: 'GSTIN: 03AWNPV3468J1ZX with 100% compliant business and invoicing.'
    },
    {
        icon: Layers,
        title: 'Computerized Embroidery',
        description: 'High-precision school crest and company logo multi-head embroidery.'
    },
    {
        icon: Truck,
        title: 'Pan-India Cargo Dispatch',
        description: 'Fast, moisture-proof packed shipments via railway and express transport.'
    }
];

export function Home() {
    const navigate = useNavigate();
    const { settings } = useApp();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeModalImage, setActiveModalImage] = useState(null);

    // Fetch products, categories, and custom page content
    const { data: pageData } = useFetch('/pages/home');
    const { data: products, loading: prodLoading, error: prodError } = useFetch('/menu');
    const { data: categories } = useFetch('/categories');
    const { data: reviews } = useFetch('/testimonials');
    const { data: faqs } = useFetch('/faqs');

    // Merge custom admin slides and offers if available
    let heroSlides = defaultHeroSlides;
    let offersData = defaultOffersData;
    if (pageData?.body) {
        try {
            const parsed = typeof pageData.body === 'string' ? JSON.parse(pageData.body) : pageData.body;
            if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                heroSlides = parsed.slides.map((s, idx) => ({
                    badge: s.badge || defaultHeroSlides[idx]?.badge || '',
                    title: s.title || defaultHeroSlides[idx]?.title || '',
                    subtitle: s.subtitle || defaultHeroSlides[idx]?.subtitle || '',
                    tagline: s.tagline || defaultHeroSlides[idx]?.tagline || '',
                    image: s.image || defaultHeroSlides[idx]?.image || '',
                    ctaPrimary: {
                        text: s.ctaPrimaryText || defaultHeroSlides[idx]?.ctaPrimary?.text || 'Explore Product Catalog',
                        to: s.ctaPrimaryLink || defaultHeroSlides[idx]?.ctaPrimary?.to || '/menu'
                    },
                    ctaSecondary: {
                        text: s.ctaSecondaryText || defaultHeroSlides[idx]?.ctaSecondary?.text || 'Request Bulk Quote',
                        ...(s.ctaSecondaryLink?.startsWith('http') || s.ctaSecondaryLink?.startsWith('tel:')
                            ? { href: s.ctaSecondaryLink }
                            : { to: s.ctaSecondaryLink || '/booking' })
                    }
                }));
            }
            if (parsed.offers) {
                offersData = {
                    tagline: parsed.offers.tagline || defaultOffersData.tagline,
                    title: parsed.offers.title || defaultOffersData.title,
                    subtitle: parsed.offers.subtitle || defaultOffersData.subtitle,
                    card1: {
                        ...defaultOffersData.card1,
                        ...(parsed.offers.card1 || {})
                    },
                    card2: {
                        ...defaultOffersData.card2,
                        ...(parsed.offers.card2 || {})
                    }
                };
            }
        } catch {
            // keep defaults
        }
    }

    // Quick Quote Form State
    const [quoteForm, setQuoteForm] = useState({
        name: '',
        orgName: '',
        phone: '',
        category: 'School Uniforms & Sweaters',
        quantity: '100 - 250 pcs',
        message: ''
    });
    const [submittingQuote, setSubmittingQuote] = useState(false);

    // Auto-advance slider every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

    // Filter products category-wise
    const filteredProducts = products.filter(p => {
        if (selectedCategory === 'all') return true;
        return p.category?._id === selectedCategory || p.category?.slug === selectedCategory;
    });

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        setSubmittingQuote(true);
        try {
            await api.post('/inquiries', {
                name: quoteForm.name,
                email: 'inquiry@vwwclient.com',
                phone: quoteForm.phone,
                subject: `Bulk Quote: ${quoteForm.category} (${quoteForm.quantity}) for ${quoteForm.orgName}`,
                message: `Organization: ${quoteForm.orgName}\nCategory: ${quoteForm.category}\nEstimated Quantity: ${quoteForm.quantity}\nRequirements: ${quoteForm.message}`
            });
            toast.success('Your quotation request has been sent! Our team will contact you shortly.');
            setQuoteForm({
                name: '',
                orgName: '',
                phone: '',
                category: 'School Uniforms & Sweaters',
                quantity: '100 - 250 pcs',
                message: ''
            });
        } catch (err) {
            toast.error(err.message || 'Failed to submit inquiry. Please call us directly.');
        } finally {
            setSubmittingQuote(false);
        }
    };

    const activeSlide = heroSlides[currentSlide];

    return (
        <div className="vww-home-container" style={{ width: '100%', overflowX: 'hidden' }}>
            {/* HERO SLIDER SECTION (RESPONSIVE SPLIT LAYOUT WITH LARGE DYNAMIC IMAGE) */}
            <section className="vww-hero-slider" style={{ position: 'relative', background: '#0b1329', color: '#ffffff', minHeight: '580px', overflow: 'hidden' }}>
                {/* Ambient Soft Backdrop Glow */}
                <div 
                    className="vww-slide-backdrop"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `radial-gradient(circle at 75% 50%, rgba(30,58,138,0.4) 0%, rgba(11,19,41,0.96) 70%), url('${activeSlide.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(30px) opacity(0.25)',
                        transform: 'scale(1.1)',
                        transition: 'all 0.7s ease-in-out'
                    }}
                />

                <div className="container" style={{ position: 'relative', zIndex: 2, padding: 'clamp(40px, 5vw, 65px) 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 45vw, 540px), 1fr))', gap: 'clamp(24px, 4vw, 44px)', alignItems: 'center' }}>
                    {/* Left Column: Text Content */}
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(217,119,6,0.2)', border: '1px solid #d97706', color: '#fbbf24', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', marginBottom: '18px', letterSpacing: '0.04em' }}>
                            <Sparkles size={14} />
                            {activeSlide.badge}
                        </div>

                        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', lineHeight: '1.2', color: '#ffffff', marginBottom: '18px', letterSpacing: '-0.02em' }}>
                            {activeSlide.title}
                        </h1>

                        <p style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: '1.65', color: '#cbd5e1', marginBottom: '30px' }}>
                            {activeSlide.subtitle}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '32px' }}>
                            {activeSlide.ctaPrimary.to ? (
                                <Link to={activeSlide.ctaPrimary.to} className="btn" style={{ background: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                                    {activeSlide.ctaPrimary.text} <ArrowRight size={18} />
                                </Link>
                            ) : null}

                            {activeSlide.ctaSecondary.href ? (
                                <a href={activeSlide.ctaSecondary.href} target="_blank" rel="noreferrer" className="btn" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', padding: '12px 22px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                    {activeSlide.ctaSecondary.text}
                                </a>
                            ) : activeSlide.ctaSecondary.to ? (
                                <Link to={activeSlide.ctaSecondary.to} className="btn" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', padding: '12px 22px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                    {activeSlide.ctaSecondary.text}
                                </Link>
                            ) : null}
                        </div>

                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.05em' }}>
                            {activeSlide.tagline}
                        </div>
                    </div>

                    {/* Right Column: Large Dynamic Showcase Image Adjusting to Screen Size */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div 
                            onClick={() => setActiveModalImage({ url: activeSlide.image, title: activeSlide.title })}
                            title="Click to view full screen"
                            style={{ 
                                width: '100%', 
                                maxWidth: '580px', 
                                height: 'clamp(280px, 34vw, 440px)', 
                                background: 'rgba(15, 23, 42, 0.85)', 
                                border: '1px solid rgba(255, 255, 255, 0.18)', 
                                borderRadius: '16px', 
                                padding: '10px', 
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', 
                                overflow: 'hidden',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}
                        >
                            <img 
                                src={activeSlide.image} 
                                alt={activeSlide.title} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain', 
                                    borderRadius: '10px',
                                    transition: 'transform 0.4s ease'
                                }} 
                            />
                            <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', color: '#ffffff', padding: '5px 9px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Maximize2 size={12} /> Full Screen
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slider Navigation Arrows & Dots */}
                <button 
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                >
                    <ChevronLeft size={22} />
                </button>
                <button 
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                >
                    <ChevronRight size={22} />
                </button>

                {/* Slide Indicators */}
                <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            style={{
                                width: idx === currentSlide ? '28px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: idx === currentSlide ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* FACTORY TRUST HIGHLIGHTS */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '24px 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
                    {factoryHighlights.map((feat, i) => (
                        <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '12px', borderRadius: '8px', flexShrink: 0 }}>
                                <feat.icon size={22} />
                            </div>
                            <div>
                                <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>
                                    {feat.title}
                                </strong>
                                <small style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4', display: 'block', marginTop: '2px' }}>
                                    {feat.description}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DAILY OFFERS & BUMPER DEALS SECTION WITH DYNAMIC RESIZING */}
            <section id="offers" className="section" style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7', padding: '50px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            <Tag size={16} /> {offersData.tagline || 'Seasonal Wholesale Promotions'}
                        </span>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#78350f', marginTop: '6px' }}>
                            {offersData.title || 'Daily Offers & Annual Bumper Deals'}
                        </h2>
                        <p style={{ color: '#92400e', fontSize: '15px' }}>
                            {offersData.subtitle || 'Factory-direct discounts on bulk bookings for schools, institutions, and dealers across India.'}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 42vw, 540px), 1fr))', gap: '26px' }}>
                        {/* Offer Card 1 */}
                        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #fde68a', overflow: 'hidden', boxShadow: '0 8px 24px rgba(217,119,6,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div 
                                onClick={() => setActiveModalImage({ url: offersData.card1?.image || '/vww/offers/Vijay Woollen Works Annual Bumper Offer (1).png', title: offersData.card1?.title || 'Annual Bumper Wholesale Offer' })}
                                title="Click to view full screen"
                                style={{ position: 'relative', width: '100%', height: 'clamp(280px, 30vw, 420px)', background: '#0f172a', cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <img 
                                    src={offersData.card1?.image || '/vww/offers/Vijay Woollen Works Annual Bumper Offer (1).png'} 
                                    alt={offersData.card1?.title || 'Annual Bumper Offer'} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#dc2626', color: '#ffffff', padding: '5px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>
                                    {offersData.card1?.badge || 'LIMITED TIME DEAL'}
                                </span>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(15,23,42,0.85)', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Maximize2 size={12} /> Click to Enlarge
                                </div>
                            </div>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                        {offersData.card1?.title || 'Annual Bumper Wholesale Offer'}
                                    </h3>
                                    <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                        {offersData.card1?.moq || 'MOQ: 50+'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
                                    {offersData.card1?.subtitle || 'Special reduced rate contracts for complete school sets (Sweaters, Blazers, Ties, and Belts). Pre-book your season demand with 50% advance and guaranteed dispatch schedule.'}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <a 
                                            href={`https://wa.me/918427257106?text=${encodeURIComponent(offersData.card1?.whatsappMsg || 'Hi Vijay Woollen Works, please share details for the Annual Bumper Offer.')}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            style={{ flex: 1, textAlign: 'center', background: '#22c55e', color: '#ffffff', padding: '11px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                        >
                                            <MessageCircle size={15} /> Claim on WhatsApp
                                        </a>
                                        <Link 
                                            to="/booking"
                                            style={{ textAlign: 'center', background: '#1e3a8a', color: '#ffffff', padding: '11px 18px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
                                        >
                                            Quote
                                        </Link>
                                    </div>
                                    <Link 
                                        to="/menu?category=school-uniforms-and-sweaters"
                                        style={{ textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', padding: '9px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        Explore School Uniform Sweaters Range <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Offer Card 2 */}
                        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #fde68a', overflow: 'hidden', boxShadow: '0 8px 24px rgba(217,119,6,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div 
                                onClick={() => setActiveModalImage({ url: offersData.card2?.image || '/vww/offers/Vijay Woollen Works Wholesale Offer.png', title: offersData.card2?.title || 'Pre-Winter Bulk Booking Rate' })}
                                title="Click to view full screen"
                                style={{ position: 'relative', width: '100%', height: 'clamp(280px, 30vw, 420px)', background: '#0f172a', cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <img 
                                    src={offersData.card2?.image || '/vww/offers/Vijay Woollen Works Wholesale Offer.png'} 
                                    alt={offersData.card2?.title || 'Wholesale Offer'} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#2563eb', color: '#ffffff', padding: '5px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>
                                    {offersData.card2?.badge || 'PRE-WINTER DISCOUNT'}
                                </span>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(15,23,42,0.85)', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Maximize2 size={12} /> Click to Enlarge
                                </div>
                            </div>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                        {offersData.card2?.title || 'Pre-Winter Bulk Booking Rate'}
                                    </h3>
                                    <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                        {offersData.card2?.moq || 'Direct Dispatch'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
                                    {offersData.card2?.subtitle || 'Lock in factory rates on V-neck school uniform pullovers and athletic tracksuits before peak season yarn price spikes. Free sample swatch dispatch for institutional committees.'}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <a 
                                        href={`https://wa.me/918427257106?text=${encodeURIComponent(offersData.card2?.whatsappMsg || 'Hi Vijay Woollen Works, please share details for Pre-Winter Bulk Booking.')}`}
                                        target="_blank" 
                                        rel="noreferrer"
                                        style={{ textAlign: 'center', background: '#22c55e', color: '#ffffff', padding: '11px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <MessageCircle size={15} /> Claim on WhatsApp
                                    </a>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <a 
                                            href="tel:+918427257106"
                                            style={{ flex: 1, textAlign: 'center', background: '#1e3a8a', color: '#ffffff', padding: '11px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                        >
                                            <Phone size={15} /> Call Factory
                                        </a>
                                        <Link 
                                            to="/vww/documents/vww_product list.pdf" 
                                            target="_blank"
                                            style={{ textAlign: 'center', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '11px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <Download size={14} /> Catalog PDF
                                        </Link>
                                    </div>
                                    <Link 
                                        to="/menu?category=college-and-academy-wear"
                                        style={{ textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', padding: '9px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        Explore Hoodies & Academy Wear Range <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY-WISE PRODUCT SHOWCASE WITH RESPONSIVE PRODUCT IMAGES */}
            <section id="products" className="section" style={{ padding: '60px 0', background: '#ffffff' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                        <div>
                            <span style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Complete Product Range
                            </span>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                                Explore Products by Category
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '15px' }}>
                                High-durability winter wear, school uniforms, and corporate workwear manufactured to exact specifications.
                            </p>
                        </div>
                        <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
                            View Full Catalog ({products.length} Products) <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    {/* Responsive Category Pills (Wraps on desktop, smooth on mobile) */}
                    <div className="vww-category-pills" style={{ marginBottom: '30px' }}>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '50px',
                                border: selectedCategory === 'all' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                background: selectedCategory === 'all' ? '#1e3a8a' : '#f8fafc',
                                color: selectedCategory === 'all' ? '#ffffff' : '#475569',
                                fontWeight: '700',
                                fontSize: '13px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            All Categories
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '50px',
                                    border: selectedCategory === cat._id ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                    background: selectedCategory === cat._id ? '#1e3a8a' : '#f8fafc',
                                    color: selectedCategory === cat._id ? '#ffffff' : '#475569',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid with Dynamic Image Heights */}
                    {prodLoading ? (
                        <Loading label="Loading factory catalog..." />
                    ) : prodError ? (
                        <ErrorState message={prodError} />
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            No items found in this category.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(290px, 28vw, 400px), 1fr))', gap: '24px' }}>
                            {filteredProducts.slice(0, 8).map(item => (
                                <div 
                                    key={item._id}
                                    onClick={() => {
                                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                        navigate(`/product/${item.slug || item._id}`);
                                    }}
                                    title="Click to view details, select sizes & calculate wholesale total"
                                    style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: '#ffffff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
                                >
                                    {/* Responsive 400x400 Aspect Image Container */}
                                    <div 
                                        style={{ position: 'relative', width: '100%', height: 'clamp(320px, 32vw, 400px)', aspectRatio: '1 / 1', maxHeight: '400px', background: '#f8fafc', overflow: 'hidden' }}
                                    >
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                            onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                        />
                                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#1e3a8a', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>
                                            MOQ: {item.prepMinutes || 50} pcs
                                        </span>
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); setActiveModalImage({ url: item.image, title: item.name }); }}
                                            title="Click to enlarge image"
                                            style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(15,23,42,0.75)', color: '#ffffff', padding: '3px 7px', borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                                        >
                                            <Maximize2 size={10} /> Enlarge
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <small style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                                            {item.category?.name || 'Uniform Wear'}
                                        </small>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '6px 0 8px', lineHeight: '1.4' }}>
                                            {item.name}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginBottom: '12px' }}>
                                            <div>
                                                <small style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Wholesale Rate</small>
                                                <strong style={{ fontSize: '18px', color: '#1e3a8a', fontWeight: '800' }}>₹{item.price} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>/ pc</span></strong>
                                            </div>
                                            <a 
                                                href={`https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20I%20am%20interested%20in%20quotation%20for%20${encodeURIComponent(item.name)}.`}
                                                target="_blank" 
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                title="Inquire via WhatsApp"
                                                style={{ background: '#22c55e', color: '#ffffff', borderRadius: '6px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 2px 6px rgba(34,197,94,0.3)' }}
                                            >
                                                <MessageCircle size={14} /> WhatsApp
                                            </a>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                                navigate(`/product/${item.slug || item._id}`); 
                                            }}
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                background: '#1e3a8a',
                                                color: '#ffffff',
                                                border: 'none',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                boxShadow: '0 4px 12px rgba(30,58,138,0.22)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            Select Sizes & Order <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '36px' }}>
                        <Link 
                            to="/menu"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1e3a8a', color: '#ffffff', padding: '12px 28px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}
                        >
                            Browse All {products.length} Products & Size Charts <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* QUICK BULK QUOTATION & CONTACT SECTION */}
            <section className="section" style={{ background: '#0f172a', color: '#ffffff', padding: '60px 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: '#fbbf24', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                            Direct Factory Procurement
                        </div>
                        <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', color: '#ffffff', marginBottom: '18px' }}>
                            Need Custom Uniforms or Bulk Winter Knitwear?
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
                            Whether you need school pullovers with customized crest embroidery, corporate jackets for staff, or sports tracksuits, our Ludhiana manufacturing unit delivers certified quality at direct factory prices.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '14px' }}>
                                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                <span>Minimum Order Quantity (MOQ) starting from just 30 - 50 pcs</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '14px' }}>
                                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                <span>Multi-head computerized embroidery for school crests and corporate logos</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '14px' }}>
                                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                <span>Moisture-proof parcel packing and transparent railway / road dispatch</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            <a 
                                href="tel:+918427257106"
                                style={{ background: '#2563eb', color: '#ffffff', padding: '12px 22px', borderRadius: '6px', fontWeight: '700', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                            >
                                <Phone size={16} /> Call Vijay Pratap: +91 84272 57106
                            </a>
                            <a 
                                href="/vww/documents/vww_product list.pdf" 
                                target="_blank"
                                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                            >
                                <Download size={16} /> Download Product List (PDF)
                            </a>
                        </div>
                    </div>

                    {/* Quotation Request Form */}
                    <div style={{ background: '#ffffff', color: '#0f172a', padding: '32px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>
                            Request Factory Quotation
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                            Fill out the details below. Our factory representative will contact you with a customized quotation and dispatch timeline.
                        </p>

                        <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        Contact Person *
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={quoteForm.name}
                                        onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                        placeholder="Your Name"
                                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        School / Org Name *
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={quoteForm.orgName}
                                        onChange={e => setQuoteForm({ ...quoteForm, orgName: e.target.value })}
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
                                        type="tel" 
                                        required 
                                        value={quoteForm.phone}
                                        onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                        Quantity Estimate
                                    </label>
                                    <select 
                                        value={quoteForm.quantity}
                                        onChange={e => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
                                    >
                                        <option>30 - 50 pcs (Sample Order)</option>
                                        <option>50 - 150 pcs</option>
                                        <option>150 - 500 pcs</option>
                                        <option>500 - 1000 pcs</option>
                                        <option>1000+ pcs (Wholesale)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                    Product Category
                                </label>
                                <select 
                                    value={quoteForm.category}
                                    onChange={e => setQuoteForm({ ...quoteForm, category: e.target.value })}
                                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
                                >
                                    <option>School Uniforms & Sweaters</option>
                                    <option>College & Academy Wear (Hoodies / Tracksuits)</option>
                                    <option>Corporate Blazers & Uniforms</option>
                                    <option>Industrial Workwear & Jackets</option>
                                    <option>Uniform Accessories (Ties / Caps / Socks)</option>
                                    <option>Private Label Apparel Manufacturing</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                                    Specific Sizes or Requirements
                                </label>
                                <textarea 
                                    rows={3} 
                                    value={quoteForm.message}
                                    onChange={e => setQuoteForm({ ...quoteForm, message: e.target.value })}
                                    placeholder="Enter sizes (e.g. 24, 26, 28), colors, logo embroidery needs, etc."
                                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submittingQuote}
                                style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}
                            >
                                {submittingQuote ? 'Submitting...' : 'Submit Quotation Request'} <ArrowRight size={17} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* VERIFIED CLIENT TESTIMONIALS */}
            {reviews.length > 0 && (
                <section className="section" style={{ background: '#f8fafc', padding: '60px 0' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
                            <span style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Verified Buyer Experiences
                            </span>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                                Trusted by Institutions Across India
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '15px' }}>
                                Hear from institutional buyers, sports academies, and uniform dealers who procure directly from our Ludhiana manufacturing unit.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                            {reviews.map(rev => (
                                <div 
                                    key={rev._id}
                                    style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ display: 'flex', gap: '3px', color: '#d97706', marginBottom: '14px' }}>
                                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#334155', fontStyle: 'italic', marginBottom: '20px', flex: 1 }}>
                                        “{rev.comment || rev.quote}”
                                    </p>
                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#eff6ff', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>
                                            {rev.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{rev.name}</strong>
                                            <small style={{ color: '#64748b', fontSize: '12px' }}>{rev.role || 'Verified Wholesale Buyer'}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FREQUENTLY ASKED QUESTIONS */}
            {faqs.length > 0 && (
                <section className="section" style={{ padding: '60px 0', background: '#ffffff' }}>
                    <div className="container" style={{ maxWidth: '850px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                            <span style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Everything You Need to Know
                            </span>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {faqs.map(faq => (
                                <details 
                                    key={faq._id}
                                    style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 20px', background: '#f8fafc', cursor: 'pointer' }}
                                >
                                    <summary style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                                        {faq.question}
                                    </summary>
                                    <p style={{ marginTop: '12px', fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FULL-SCREEN ZOOM LIGHTBOX MODAL (Largest view according to screen size) */}
            {activeModalImage && (
                <div 
                    onClick={() => setActiveModalImage(null)} 
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                >
                    <button 
                        onClick={() => setActiveModalImage(null)} 
                        aria-label="Close"
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <X size={26} />
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
