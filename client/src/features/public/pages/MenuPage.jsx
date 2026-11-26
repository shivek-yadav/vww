import { useMemo, useState, useEffect } from 'react';
import { Search, X, Download, MessageCircle, Phone, ArrowRight, ShieldCheck, Tag, Maximize2 } from 'lucide-react';
import { useFetch, PageHero, Loading, ErrorState, Empty } from '../../../components/UI';
import { useApp } from '../../../context/AppContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function MenuPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { settings, addCart, cart } = useApp();
    const { data: items, loading, error } = useFetch('/menu');
    const { data: categories } = useFetch('/categories');
    const [category, setCategory] = useState(() => searchParams.get('category') || 'all');
    const [search, setSearch] = useState('');
    const [activeModalImage, setActiveModalImage] = useState(null);

    useEffect(() => {
        const qCat = searchParams.get('category');
        if (qCat) {
            setCategory(qCat);
        }
    }, [searchParams]);

    const filtered = useMemo(() => {
        return items.filter(x => {
            const matchesCat = category === 'all' || x.category?._id === category || x.category?.slug === category;
            const matchesSearch = x.name.toLowerCase().includes(search.toLowerCase()) ||
                                  (x.description && x.description.toLowerCase().includes(search.toLowerCase()));
            return matchesCat && matchesSearch;
        });
    }, [items, category, search]);

    return (
        <>
            <PageHero
                eyebrow="FACTORY DIRECT WHOLESALE CATALOG"
                title="Uniforms & Winter Knitwear Range"
                description="Specialized School Uniforms, Sweaters, Hoodies, Corporate Blazers, and Industrial Safety Wear from Ludhiana."
                image="/vww/branding/Vijay Woollen Works Apparel Solutions.png"
            />

            <section className="section" style={{ background: '#f8fafc', padding: '40px 0 70px' }}>
                <div className="container">
                    {/* Header Controls Bar (Left-aligned) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                Browse Catalog ({filtered.length} Items)
                            </h2>
                            <small style={{ color: '#64748b', fontSize: '13px' }}>
                                Factory direct rates · GST: 03AWNPV3468J1ZX · Minimum Order Quantities (MOQ) apply
                            </small>
                        </div>
                        <a 
                            href="/vww/documents/vww_product list.pdf" 
                            target="_blank"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1e3a8a', color: '#ffffff', padding: '9px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
                        >
                            <Download size={15} /> Download PDF Product List
                        </a>
                    </div>

                    {/* Filter controls */}
                    <div className="menu-controls" style={{ marginBottom: '30px' }}>
                        {/* Category pills */}
                        <div className="vww-category-pills" style={{ marginBottom: '16px' }}>
                            <button
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '50px',
                                    border: category === 'all' ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                    background: category === 'all' ? '#1e3a8a' : '#ffffff',
                                    color: category === 'all' ? '#ffffff' : '#475569',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                                onClick={() => setCategory('all')}
                            >
                                All Products ({items.length})
                            </button>
                            {categories.map(c => (
                                <button
                                    key={c._id}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: '50px',
                                        border: category === c._id ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                        background: category === c._id ? '#1e3a8a' : '#ffffff',
                                        color: category === c._id ? '#ffffff' : '#475569',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onClick={() => setCategory(c._id)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>

                        {/* Search input */}
                        <div style={{ position: 'relative', maxWidth: '420px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                placeholder="Search sweaters, blazers, tracksuits, ties..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: '100%', padding: '10px 38px 10px 42px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: '#ffffff' }}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    type="button"
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Grid with Dynamic Image Resizing */}
                    {loading ? (
                        <Loading label="Loading product specifications..." />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : filtered.length === 0 ? (
                        <Empty
                            title="No products matched your search"
                            text="Try another search term or select 'All Products'."
                        />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(290px, 28vw, 400px), 1fr))', gap: '24px' }}>
                            {filtered.map(item => {
                                const inCartItem = cart?.find(x => x.id === item._id);
                                const inCartQty = inCartItem?.quantity || 0;

                                return (
                                    <div 
                                        key={item._id}
                                        style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#ffffff',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                        }}
                                    >
                                        <div 
                                            onClick={() => {
                                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                                navigate(`/product/${item.slug || item._id}`);
                                            }}
                                            title="Click to view product details & select sizes"
                                            style={{ position: 'relative', width: '100%', height: 'clamp(320px, 32vw, 400px)', aspectRatio: '1 / 1', maxHeight: '400px', background: '#f8fafc', overflow: 'hidden', cursor: 'pointer' }}
                                        >
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                                onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                            />
                                            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ background: '#1e3a8a', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>
                                                    MOQ: {item.prepMinutes || 50} pcs
                                                </span>
                                                {item.featured && (
                                                    <span style={{ background: '#d97706', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                                                        POPULAR DEMAND
                                                    </span>
                                                )}
                                            </div>
                                            <div 
                                                onClick={(e) => { e.stopPropagation(); setActiveModalImage({ url: item.image, title: item.name }); }}
                                                style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(15,23,42,0.75)', color: '#ffffff', padding: '3px 7px', borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                                            >
                                                <Maximize2 size={10} /> Enlarge
                                            </div>
                                        </div>

                                        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <small style={{ color: '#1e3a8a', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {item.category?.name || 'School Wear'}
                                            </small>
                                            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '6px 0 8px', lineHeight: '1.4' }}>
                                                <Link to={`/product/${item.slug || item._id}`} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '18px', flex: 1 }}>
                                                {item.description}
                                            </p>

                                            {/* Price row with WhatsApp button */}
                                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                                <div>
                                                    <small style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Wholesale Rate</small>
                                                    <strong style={{ fontSize: '20px', color: '#1e3a8a', fontWeight: '800' }}>
                                                        ₹{item.price} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>/ pc</span>
                                                    </strong>
                                                </div>
                                                <a 
                                                    href={`https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20please%20send%20rate%20card%20and%20sample%20details%20for%20${encodeURIComponent(item.name)}.`}
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Inquire via WhatsApp"
                                                    style={{
                                                        background: '#22c55e',
                                                        color: '#ffffff',
                                                        borderRadius: '6px',
                                                        padding: '8px 14px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '13px',
                                                        fontWeight: '700',
                                                        textDecoration: 'none',
                                                        boxShadow: '0 2px 6px rgba(34,197,94,0.3)'
                                                    }}
                                                >
                                                    <MessageCircle size={15} /> WhatsApp
                                                </a>
                                            </div>

                                            {/* Primary Bottom Action: Select Sizes & Order */}
                                            <Link
                                                to={`/product/${item.slug || item._id}`}
                                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    background: '#1e3a8a',
                                                    color: '#ffffff',
                                                    borderRadius: '8px',
                                                    padding: '12px 16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '800',
                                                    textDecoration: 'none',
                                                    boxShadow: '0 4px 12px rgba(30,58,138,0.22)'
                                                }}
                                            >
                                                Select Sizes & Order <ArrowRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* FULL-SCREEN ZOOM LIGHTBOX MODAL */}
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
        </>
    );
}
