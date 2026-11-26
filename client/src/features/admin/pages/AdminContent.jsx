import { useState } from 'react';
import { FileText, ChevronRight, Save, Layers, Tag, Info, Sliders, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useFetch } from '../../../components/UI';
import { AdminHeading, Modal, ImageField } from '../components/AdminShared';

const defaultSlides = [
    {
        badge: 'GST: 03AWNPV3468J1ZX · MSME UDYAM CERTIFIED',
        title: "India's Trusted Manufacturer of School Uniforms & Winter Knitwear",
        subtitle: 'Direct factory production from Ludhiana, Punjab. Specialized in acrylic-wool sweaters, blazers, tracksuits, hoodies, and customized institutional uniforms.',
        ctaPrimaryText: 'Explore Product Catalog',
        ctaPrimaryLink: '/menu',
        ctaSecondaryText: 'Request Bulk Quote',
        ctaSecondaryLink: '/booking',
        image: '/vww/branding/Vijay Woollen Works Apparel Solutions.png',
        tagline: 'LUDHIANA KNITWEAR HUB · 100+ CLIENTS ACROSS INDIA'
    },
    {
        badge: 'SPECIAL SEASONAL DISCOUNTS AVAILABLE NOW',
        title: 'Annual Bumper Wholesale Offer on Winter Sweaters',
        subtitle: 'Special wholesale bulk pricing for school dealers, distributors, and academies. Sizes 20 to 36 ready for immediate production and dispatched securely by railway/road cargo.',
        ctaPrimaryText: 'View Wholesale Offers',
        ctaPrimaryLink: '#offers',
        ctaSecondaryText: 'WhatsApp Inquiry',
        ctaSecondaryLink: 'https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20I%20want%20to%20know%20about%20the%20Annual%20Bumper%20Wholesale%20Offer.',
        image: '/vww/offers/Vijay Woollen Works Annual Bumper Offer (1).png',
        tagline: 'FACTORY DIRECT WHOLESALE · TRANSPARENT DISPATCH'
    },
    {
        badge: 'CORPORATE · INDUSTRIAL · SPORTSWEAR SOLUTIONS',
        title: 'Custom Uniforms, Computerized Embroidery & Private Label',
        subtitle: 'Tailored executive blazers, thermal industrial winter jackets, active sports tracksuits, and complete private label packaging with your brand woven neck labels.',
        ctaPrimaryText: 'Custom Manufacturing',
        ctaPrimaryLink: '/about',
        ctaSecondaryText: 'Call: +91 84272 57106',
        ctaSecondaryLink: 'tel:+918427257106',
        image: '/vww/categories/Vijay Woollen Works Uniform Solutions.png',
        tagline: 'PREMIUM QUALITY YARN · TESTED DURABILITY'
    }
];

const defaultOffers = {
    tagline: 'Seasonal Wholesale Promotions',
    title: 'Daily Offers & Annual Bumper Deals',
    subtitle: 'Factory-direct discounts on bulk bookings for schools, institutions, and dealers across India.',
    card1: {
        badge: 'ANNUAL BUMPER OFFER',
        title: 'Annual Bumper Wholesale Offer',
        subtitle: 'Heavy-duty school woollen sweaters, pullovers & cardigans in bulk batches.',
        moq: 'MOQ: 50+',
        image: '/vww/offers/Vijay Woollen Works Annual Bumper Offer (1).png',
        whatsappMsg: 'Hi Vijay Woollen Works, please share details for the Annual Bumper Offer.'
    },
    card2: {
        badge: 'PRE-WINTER DISCOUNT',
        title: 'Pre-Winter Bulk Booking Rate',
        subtitle: 'Early bird factory production booking for schools and institutions.',
        moq: 'MOQ: 100+',
        image: '/vww/offers/Vijay Woollen Works Wholesale Offer.png',
        whatsappMsg: 'Hi Vijay Woollen Works, please share details for Pre-Winter Bulk Booking.'
    }
};

const defaultAbout = {
    eyebrow: 'MANUFACTURING EXCELLENCE SINCE INCEPTION',
    title: 'About Vijay Woollen Works',
    description: 'Ludhiana’s specialized manufacturer and supplier of School Uniforms, Winter Knitwear, Corporate Attire & Workwear.',
    heroImage: '/vww/branding/Vijay Woollen Works Apparel Solutions.png',
    storyHeading: 'Crafting Durability & Comfort from Ludhiana’s Textile Heartland',
    storyParagraph1: "Located at Purana Bazaar, Buhrampuri, Ludhiana, Vijay Woollen Works (VWW) is a dedicated manufacturer and supplier of premier winter wear and institutional uniforms. Ludhiana is globally celebrated as India's knitwear capital, providing us direct access to high-grade acrylic, wool-blend yarns, and modern textile machinery.",
    storyParagraph2: "From standard V-neck school uniform pullovers and double-ply winter knitwear to heavy-duty industrial safety jackets and college hoodies, every garment undergoes rigorous quality testing for anti-pilling, color-fastness, and stitching strength.",
    gst: '03AWNPV3468J1ZX',
    msme: 'Govt. Registered Enterprise',
    factoryImage: '/vww/categories/Private Label Apparel Manufacturing Infographic.png'
};

export function AdminContent() {
    const { data = [], reload } = useFetch('/admin/content');
    const [selected, setSelected] = useState(null);
    const [busy, setBusy] = useState(false);
    const [activeTab, setActiveTab] = useState('slides'); // For home: slides | offers | general; For about: story | credentials | general

    // State for Home Page
    const [homeData, setHomeData] = useState({
        title: '',
        subtitle: '',
        description: '',
        published: true,
        slides: defaultSlides,
        offers: defaultOffers
    });

    // State for About Page
    const [aboutData, setAboutData] = useState({
        ...defaultAbout,
        published: true
    });

    // Generic form for other custom pages
    const [genericForm, setGenericForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        heroImage: '',
        body: '',
        published: true
    });

    // Remove 'menu' page per user request, keep 'home', 'about', and any other custom page
    const pages = ['home', 'about', ...data.map(x => x.slug).filter(s => s !== 'home' && s !== 'about' && s !== 'menu')];

    const openPage = (slug) => {
        setSelected(slug);
        const record = data.find(x => x.slug === slug);
        let parsedBody = {};
        if (record?.body) {
            try {
                parsedBody = JSON.parse(record.body);
            } catch {
                parsedBody = {};
            }
        }

        if (slug === 'home') {
            setActiveTab('slides');
            setHomeData({
                title: record?.title || "India's Trusted Manufacturer of School Uniforms",
                subtitle: record?.subtitle || 'Ludhiana Knitwear Hub',
                description: record?.description || 'Factory direct uniform and sweater supply',
                published: record?.published ?? true,
                slides: (parsedBody.slides && parsedBody.slides.length === 3) ? parsedBody.slides : defaultSlides,
                offers: parsedBody.offers ? {
                    ...defaultOffers,
                    ...parsedBody.offers,
                    card1: { ...defaultOffers.card1, ...(parsedBody.offers?.card1 || {}) },
                    card2: { ...defaultOffers.card2, ...(parsedBody.offers?.card2 || {}) }
                } : defaultOffers
            });
        } else if (slug === 'about') {
            setActiveTab('story');
            setAboutData({
                eyebrow: record?.subtitle || parsedBody.eyebrow || defaultAbout.eyebrow,
                title: record?.title || defaultAbout.title,
                description: record?.description || defaultAbout.description,
                heroImage: record?.heroImage || defaultAbout.heroImage,
                storyHeading: parsedBody.storyHeading || defaultAbout.storyHeading,
                storyParagraph1: parsedBody.storyParagraph1 || defaultAbout.storyParagraph1,
                storyParagraph2: parsedBody.storyParagraph2 || defaultAbout.storyParagraph2,
                gst: parsedBody.gst || defaultAbout.gst,
                msme: parsedBody.msme || defaultAbout.msme,
                factoryImage: parsedBody.factoryImage || defaultAbout.factoryImage,
                published: record?.published ?? true
            });
        } else {
            setActiveTab('general');
            setGenericForm({
                title: record?.title || '',
                subtitle: record?.subtitle || '',
                description: record?.description || '',
                heroImage: record?.heroImage || '',
                body: record?.body || '',
                published: record?.published ?? true
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            let payload = {};
            if (selected === 'home') {
                payload = {
                    title: homeData.title,
                    subtitle: homeData.subtitle,
                    description: homeData.description,
                    published: homeData.published,
                    body: JSON.stringify({
                        slides: homeData.slides,
                        offers: homeData.offers
                    })
                };
            } else if (selected === 'about') {
                payload = {
                    title: aboutData.title,
                    subtitle: aboutData.eyebrow,
                    description: aboutData.description,
                    heroImage: aboutData.heroImage,
                    published: aboutData.published,
                    body: JSON.stringify({
                        eyebrow: aboutData.eyebrow,
                        storyHeading: aboutData.storyHeading,
                        storyParagraph1: aboutData.storyParagraph1,
                        storyParagraph2: aboutData.storyParagraph2,
                        gst: aboutData.gst,
                        msme: aboutData.msme,
                        factoryImage: aboutData.factoryImage
                    })
                };
            } else {
                payload = genericForm;
            }

            await api.put(`/admin/content/${selected}`, payload);
            toast.success(`${selected.toUpperCase()} page content updated successfully`);
            setSelected(null);
            reload();
        } catch (err) {
            toast.error(err.message || 'Failed to update page');
        } finally {
            setBusy(false);
        }
    };

    // Slide update helper
    const updateSlide = (index, field, value) => {
        setHomeData(prev => {
            const nextSlides = [...prev.slides];
            nextSlides[index] = { ...nextSlides[index], [field]: value };
            return { ...prev, slides: nextSlides };
        });
    };

    // Offer update helper
    const updateOfferCard = (cardKey, field, value) => {
        setHomeData(prev => ({
            ...prev,
            offers: {
                ...prev.offers,
                [cardKey]: {
                    ...prev.offers[cardKey],
                    [field]: value
                }
            }
        }));
    };

    return (
        <>
            <AdminHeading
                title="Page Content Management"
                subtitle="Customize banner slides, wholesale offer sections, and company heritage details across your website."
            />

            <div className="content-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {pages.map(slug => {
                    const isHome = slug === 'home';
                    const isAbout = slug === 'about';
                    return (
                        <button
                            key={slug}
                            type="button"
                            onClick={() => openPage(slug)}
                            className="content-card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '22px',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '12px',
                                background: isHome ? '#eff6ff' : isAbout ? '#ecfdf5' : '#f8fafc',
                                color: isHome ? '#1e3a8a' : isAbout ? '#059669' : '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {isHome ? <Layers size={26} /> : isAbout ? <Info size={26} /> : <FileText size={26} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong style={{ display: 'block', fontSize: '17px', color: '#0f172a', marginBottom: '3px' }}>
                                    {isHome ? 'Home Page' : isAbout ? 'About Us Page' : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Page`}
                                </strong>
                                <span style={{ fontSize: '13px', color: '#64748b' }}>
                                    {isHome ? 'Hero slides, bumper offers & deals' : isAbout ? 'Factory heritage, GST, MSME & story' : 'Manage page content and visuals'}
                                </span>
                            </div>
                            <ChevronRight size={18} color="#94a3b8" />
                        </button>
                    );
                })}
            </div>

            {/* Modal for editing Home Page */}
            {selected === 'home' && (
                <Modal title="Edit Home Page (Slides & Bumper Offers)" onClose={() => setSelected(null)}>
                    <form className="form-stack" onSubmit={handleSave}>
                        {/* Navigation Tabs */}
                        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '8px', marginBottom: '20px' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('slides')}
                                style={{
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: activeTab === 'slides' ? '2px solid #1e3a8a' : 'none',
                                    color: activeTab === 'slides' ? '#1e3a8a' : '#64748b',
                                    marginBottom: '-2px'
                                }}
                            >
                                <Layers size={16} /> Hero Slides (3)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('offers')}
                                style={{
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: activeTab === 'offers' ? '2px solid #1e3a8a' : 'none',
                                    color: activeTab === 'offers' ? '#1e3a8a' : '#64748b',
                                    marginBottom: '-2px'
                                }}
                            >
                                <Tag size={16} /> Bumper Offers Section
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('general')}
                                style={{
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: activeTab === 'general' ? '2px solid #1e3a8a' : 'none',
                                    color: activeTab === 'general' ? '#1e3a8a' : '#64748b',
                                    marginBottom: '-2px'
                                }}
                            >
                                <Sliders size={16} /> SEO & Visibility
                            </button>
                        </div>

                        {/* TAB 1: SLIDES */}
                        {activeTab === 'slides' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {homeData.slides.map((slide, idx) => (
                                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Layers size={18} /> Hero Slide #{idx + 1}
                                            </h4>
                                            <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                                                Slide {idx + 1} of 3
                                            </span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                            <label>
                                                Badge / Top Kicker
                                                <input
                                                    type="text"
                                                    value={slide.badge || ''}
                                                    onChange={e => updateSlide(idx, 'badge', e.target.value)}
                                                    placeholder="e.g. GST: 03AWNPV3468J1ZX · MSME UDYAM CERTIFIED"
                                                />
                                            </label>

                                            <label>
                                                Main Slide Headline *
                                                <input
                                                    required
                                                    type="text"
                                                    value={slide.title || ''}
                                                    onChange={e => updateSlide(idx, 'title', e.target.value)}
                                                    placeholder="Main bold headline"
                                                />
                                            </label>

                                            <label>
                                                Slide Subtitle / Paragraph Description
                                                <textarea
                                                    rows={2}
                                                    value={slide.subtitle || ''}
                                                    onChange={e => updateSlide(idx, 'subtitle', e.target.value)}
                                                    placeholder="Details about knitwear manufacturing, bulk supply, etc."
                                                />
                                            </label>

                                            <label>
                                                Bottom Tagline
                                                <input
                                                    type="text"
                                                    value={slide.tagline || ''}
                                                    onChange={e => updateSlide(idx, 'tagline', e.target.value)}
                                                    placeholder="e.g. LUDHIANA KNITWEAR HUB · 100+ CLIENTS ACROSS INDIA"
                                                />
                                            </label>

                                            <ImageField
                                                label={`Slide #${idx + 1} Image Visual`}
                                                value={slide.image || ''}
                                                onChange={v => updateSlide(idx, 'image', v)}
                                            />

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <label>
                                                    Primary Button Text
                                                    <input
                                                        type="text"
                                                        value={slide.ctaPrimaryText || ''}
                                                        onChange={e => updateSlide(idx, 'ctaPrimaryText', e.target.value)}
                                                        placeholder="Explore Product Catalog"
                                                    />
                                                </label>
                                                <label>
                                                    Primary Button Link
                                                    <input
                                                        type="text"
                                                        value={slide.ctaPrimaryLink || ''}
                                                        onChange={e => updateSlide(idx, 'ctaPrimaryLink', e.target.value)}
                                                        placeholder="/menu"
                                                    />
                                                </label>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <label>
                                                    Secondary Button Text
                                                    <input
                                                        type="text"
                                                        value={slide.ctaSecondaryText || ''}
                                                        onChange={e => updateSlide(idx, 'ctaSecondaryText', e.target.value)}
                                                        placeholder="Request Bulk Quote"
                                                    />
                                                </label>
                                                <label>
                                                    Secondary Button Link
                                                    <input
                                                        type="text"
                                                        value={slide.ctaSecondaryLink || ''}
                                                        onChange={e => updateSlide(idx, 'ctaSecondaryLink', e.target.value)}
                                                        placeholder="/booking or WhatsApp link"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB 2: OFFERS */}
                        {activeTab === 'offers' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                                <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '16px' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#854d0e' }}>
                                        Offers Section Header Settings
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                        <label>
                                            Section Eyebrow Tagline
                                            <input
                                                type="text"
                                                value={homeData.offers.tagline || ''}
                                                onChange={e => setHomeData(p => ({ ...p, offers: { ...p.offers, tagline: e.target.value } }))}
                                                placeholder="Seasonal Wholesale Promotions"
                                            />
                                        </label>
                                        <label>
                                            Section Headline *
                                            <input
                                                required
                                                type="text"
                                                value={homeData.offers.title || ''}
                                                onChange={e => setHomeData(p => ({ ...p, offers: { ...p.offers, title: e.target.value } }))}
                                                placeholder="Daily Offers & Annual Bumper Deals"
                                            />
                                        </label>
                                        <label>
                                            Section Subtitle Description
                                            <textarea
                                                rows={2}
                                                value={homeData.offers.subtitle || ''}
                                                onChange={e => setHomeData(p => ({ ...p, offers: { ...p.offers, subtitle: e.target.value } }))}
                                                placeholder="Factory-direct discounts on bulk bookings..."
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Offer Card 1 */}
                                <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#c2410c' }}>
                                        Offer Card #1 (Annual Bumper Wholesale Offer)
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <label>
                                                Offer Badge Text
                                                <input
                                                    type="text"
                                                    value={homeData.offers.card1?.badge || ''}
                                                    onChange={e => updateOfferCard('card1', 'badge', e.target.value)}
                                                    placeholder="ANNUAL BUMPER OFFER"
                                                />
                                            </label>
                                            <label>
                                                MOQ Requirement Tag
                                                <input
                                                    type="text"
                                                    value={homeData.offers.card1?.moq || ''}
                                                    onChange={e => updateOfferCard('card1', 'moq', e.target.value)}
                                                    placeholder="MOQ: 50+"
                                                />
                                            </label>
                                        </div>
                                        <label>
                                            Offer Headline
                                            <input
                                                type="text"
                                                value={homeData.offers.card1?.title || ''}
                                                onChange={e => updateOfferCard('card1', 'title', e.target.value)}
                                                placeholder="Annual Bumper Wholesale Offer"
                                            />
                                        </label>
                                        <label>
                                            Offer Subtitle
                                            <input
                                                type="text"
                                                value={homeData.offers.card1?.subtitle || ''}
                                                onChange={e => updateOfferCard('card1', 'subtitle', e.target.value)}
                                                placeholder="School sweaters, pullovers & cardigans in bulk batches."
                                            />
                                        </label>
                                        <ImageField
                                            label="Offer Card #1 Banner Image"
                                            value={homeData.offers.card1?.image || ''}
                                            onChange={v => updateOfferCard('card1', 'image', v)}
                                        />
                                        <label>
                                            WhatsApp Claim Message Template
                                            <input
                                                type="text"
                                                value={homeData.offers.card1?.whatsappMsg || ''}
                                                onChange={e => updateOfferCard('card1', 'whatsappMsg', e.target.value)}
                                                placeholder="Message prefilled when client taps WhatsApp"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Offer Card 2 */}
                                <div style={{ background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1d4ed8' }}>
                                        Offer Card #2 (Pre-Winter Bulk Booking Rate)
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <label>
                                                Offer Badge Text
                                                <input
                                                    type="text"
                                                    value={homeData.offers.card2?.badge || ''}
                                                    onChange={e => updateOfferCard('card2', 'badge', e.target.value)}
                                                    placeholder="PRE-WINTER DISCOUNT"
                                                />
                                            </label>
                                            <label>
                                                MOQ Requirement Tag
                                                <input
                                                    type="text"
                                                    value={homeData.offers.card2?.moq || ''}
                                                    onChange={e => updateOfferCard('card2', 'moq', e.target.value)}
                                                    placeholder="MOQ: 100+"
                                                />
                                            </label>
                                        </div>
                                        <label>
                                            Offer Headline
                                            <input
                                                type="text"
                                                value={homeData.offers.card2?.title || ''}
                                                onChange={e => updateOfferCard('card2', 'title', e.target.value)}
                                                placeholder="Pre-Winter Bulk Booking Rate"
                                            />
                                        </label>
                                        <label>
                                            Offer Subtitle
                                            <input
                                                type="text"
                                                value={homeData.offers.card2?.subtitle || ''}
                                                onChange={e => updateOfferCard('card2', 'subtitle', e.target.value)}
                                                placeholder="Early bird factory production booking for institutions."
                                            />
                                        </label>
                                        <ImageField
                                            label="Offer Card #2 Banner Image"
                                            value={homeData.offers.card2?.image || ''}
                                            onChange={v => updateOfferCard('card2', 'image', v)}
                                        />
                                        <label>
                                            WhatsApp Claim Message Template
                                            <input
                                                type="text"
                                                value={homeData.offers.card2?.whatsappMsg || ''}
                                                onChange={e => updateOfferCard('card2', 'whatsappMsg', e.target.value)}
                                                placeholder="Message prefilled when client taps WhatsApp"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: GENERAL */}
                        {activeTab === 'general' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <label>
                                    Page Title (Browser & SEO)
                                    <input
                                        type="text"
                                        value={homeData.title}
                                        onChange={e => setHomeData(p => ({ ...p, title: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Eyebrow / Subtitle
                                    <input
                                        type="text"
                                        value={homeData.subtitle}
                                        onChange={e => setHomeData(p => ({ ...p, subtitle: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Meta Description
                                    <textarea
                                        rows={3}
                                        value={homeData.description}
                                        onChange={e => setHomeData(p => ({ ...p, description: e.target.value }))}
                                    />
                                </label>
                                <label className="admin-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={homeData.published}
                                        onChange={e => setHomeData(p => ({ ...p, published: e.target.checked }))}
                                    />
                                    <span>Page is Published & Live</span>
                                </label>
                            </div>
                        )}

                        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="admin-secondary" onClick={() => setSelected(null)}>Cancel</button>
                            <button disabled={busy} className="admin-primary" type="submit">
                                <Save size={17} /> {busy ? 'Saving...' : 'Save Home Page Content'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Modal for editing About Us Page */}
            {selected === 'about' && (
                <Modal title="Edit About Us Page" onClose={() => setSelected(null)}>
                    <form className="form-stack" onSubmit={handleSave}>
                        {/* Navigation Tabs */}
                        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '8px', marginBottom: '20px' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('story')}
                                style={{
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: activeTab === 'story' ? '2px solid #1e3a8a' : 'none',
                                    color: activeTab === 'story' ? '#1e3a8a' : '#64748b',
                                    marginBottom: '-2px'
                                }}
                            >
                                <Info size={16} /> Heritage & Story
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('credentials')}
                                style={{
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: activeTab === 'credentials' ? '2px solid #1e3a8a' : 'none',
                                    color: activeTab === 'credentials' ? '#1e3a8a' : '#64748b',
                                    marginBottom: '-2px'
                                }}
                            >
                                <ShieldCheck size={16} /> GST & MSME Credentials
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('general')}
                                style={{
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: activeTab === 'general' ? '2px solid #1e3a8a' : 'none',
                                    color: activeTab === 'general' ? '#1e3a8a' : '#64748b',
                                    marginBottom: '-2px'
                                }}
                            >
                                <Sliders size={16} /> Hero Visual & Status
                            </button>
                        </div>

                        {/* TAB 1: STORY */}
                        {activeTab === 'story' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <label>
                                    Page Eyebrow / Kicker
                                    <input
                                        type="text"
                                        value={aboutData.eyebrow}
                                        onChange={e => setAboutData(p => ({ ...p, eyebrow: e.target.value }))}
                                        placeholder="MANUFACTURING EXCELLENCE SINCE INCEPTION"
                                    />
                                </label>
                                <label>
                                    Page Title *
                                    <input
                                        required
                                        type="text"
                                        value={aboutData.title}
                                        onChange={e => setAboutData(p => ({ ...p, title: e.target.value }))}
                                        placeholder="About Vijay Woollen Works"
                                    />
                                </label>
                                <label>
                                    Overview Description
                                    <textarea
                                        rows={2}
                                        value={aboutData.description}
                                        onChange={e => setAboutData(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Ludhiana’s specialized manufacturer and supplier..."
                                    />
                                </label>
                                <label>
                                    Heritage Section Heading
                                    <input
                                        type="text"
                                        value={aboutData.storyHeading}
                                        onChange={e => setAboutData(p => ({ ...p, storyHeading: e.target.value }))}
                                        placeholder="Crafting Durability & Comfort from Ludhiana’s Textile Heartland"
                                    />
                                </label>
                                <label>
                                    Story Paragraph 1 (Factory Location & Infrastructure)
                                    <textarea
                                        rows={3}
                                        value={aboutData.storyParagraph1}
                                        onChange={e => setAboutData(p => ({ ...p, storyParagraph1: e.target.value }))}
                                        placeholder="Located at Purana Bazaar, Buhrampuri, Ludhiana..."
                                    />
                                </label>
                                <label>
                                    Story Paragraph 2 (Quality & Production Capacity)
                                    <textarea
                                        rows={3}
                                        value={aboutData.storyParagraph2}
                                        onChange={e => setAboutData(p => ({ ...p, storyParagraph2: e.target.value }))}
                                        placeholder="From standard V-neck school uniform pullovers..."
                                    />
                                </label>
                                <ImageField
                                    label="Factory Infrastructure / Process Infographic"
                                    value={aboutData.factoryImage}
                                    onChange={v => setAboutData(p => ({ ...p, factoryImage: v }))}
                                />
                            </div>
                        )}

                        {/* TAB 2: CREDENTIALS */}
                        {activeTab === 'credentials' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e3a8a' }}>
                                        Tax & Enterprise Registrations
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                        <label>
                                            GSTIN Number
                                            <input
                                                type="text"
                                                value={aboutData.gst}
                                                onChange={e => setAboutData(p => ({ ...p, gst: e.target.value }))}
                                                placeholder="03AWNPV3468J1ZX"
                                            />
                                        </label>
                                        <label>
                                            MSME / Udyam Certification Status
                                            <input
                                                type="text"
                                                value={aboutData.msme}
                                                onChange={e => setAboutData(p => ({ ...p, msme: e.target.value }))}
                                                placeholder="Govt. Registered Enterprise"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: GENERAL */}
                        {activeTab === 'general' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <ImageField
                                    label="About Us Hero Top Banner Image"
                                    value={aboutData.heroImage}
                                    onChange={v => setAboutData(p => ({ ...p, heroImage: v }))}
                                />
                                <label className="admin-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={aboutData.published}
                                        onChange={e => setAboutData(p => ({ ...p, published: e.target.checked }))}
                                    />
                                    <span>About Page is Published & Live</span>
                                </label>
                            </div>
                        )}

                        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="admin-secondary" onClick={() => setSelected(null)}>Cancel</button>
                            <button disabled={busy} className="admin-primary" type="submit">
                                <Save size={17} /> {busy ? 'Saving...' : 'Save About Page Content'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Modal for any other custom page */}
            {selected && selected !== 'home' && selected !== 'about' && (
                <Modal title={`Edit ${selected} page`} onClose={() => setSelected(null)}>
                    <form className="form-stack" onSubmit={handleSave}>
                        <label>
                            Page Title *
                            <input
                                required
                                type="text"
                                value={genericForm.title}
                                onChange={e => setGenericForm(p => ({ ...p, title: e.target.value }))}
                            />
                        </label>
                        <label>
                            Eyebrow / Kicker
                            <input
                                type="text"
                                value={genericForm.subtitle}
                                onChange={e => setGenericForm(p => ({ ...p, subtitle: e.target.value }))}
                            />
                        </label>
                        <label>
                            Description
                            <textarea
                                rows={3}
                                value={genericForm.description}
                                onChange={e => setGenericForm(p => ({ ...p, description: e.target.value }))}
                            />
                        </label>
                        <ImageField
                            label="Hero Image"
                            value={genericForm.heroImage}
                            onChange={v => setGenericForm(p => ({ ...p, heroImage: v }))}
                        />
                        <label>
                            Additional Text / Content
                            <textarea
                                rows={5}
                                value={genericForm.body}
                                onChange={e => setGenericForm(p => ({ ...p, body: e.target.value }))}
                            />
                        </label>
                        <label className="admin-checkbox">
                            <input
                                type="checkbox"
                                checked={genericForm.published}
                                onChange={e => setGenericForm(p => ({ ...p, published: e.target.checked }))}
                            />
                            <span>Published</span>
                        </label>
                        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="admin-secondary" onClick={() => setSelected(null)}>Cancel</button>
                            <button disabled={busy} className="admin-primary" type="submit">
                                <Save size={17} /> {busy ? 'Saving...' : 'Save Page'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
