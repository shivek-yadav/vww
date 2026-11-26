import { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useFetch, PageHero, Loading, ErrorState } from '../../../components/UI';

export function Gallery() {
    const { data: photos, loading, error } = useFetch('/gallery');
    const [lightbox, setLightbox] = useState(null);
    const [category, setCategory] = useState('all');

    const categories = [...new Set(photos.map(x => x.category))];
    const filtered = photos.filter(x => category === 'all' || x.category === category);

    return (
        <>
            <PageHero 
                eyebrow="MANUFACTURING & PRODUCT PORTFOLIO" 
                title="Uniforms & Apparel Showcase" 
                description="Explore our specialized uniform collections, infographical guides, and production capabilities in Ludhiana."
                image="/vww/branding/Vijay Woollen Works Apparel Solutions.png"
            />

            <section className="section" style={{ background: '#f8fafc', padding: '50px 0 80px' }}>
                <div className="container">
                    {/* Category Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '30px' }}>
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
                            All Showcase Items ({photos.length})
                        </button>
                        {categories.map(x => (
                            <button 
                                key={x}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '50px',
                                    border: category === x ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                                    background: category === x ? '#1e3a8a' : '#ffffff',
                                    color: category === x ? '#ffffff' : '#475569',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                                onClick={() => setCategory(x)}
                            >
                                {x}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <Loading label="Loading showcase..." />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {filtered.map(g => {
                                const imgSrc = g.image || g.url;
                                return (
                                    <div 
                                        key={g._id}
                                        onClick={() => setLightbox(g)}
                                        style={{
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            border: '1px solid #e2e8f0',
                                            background: '#ffffff',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <div style={{ height: 'clamp(240px, 24vw, 360px)', overflow: 'hidden', background: '#0f172a' }}>
                                            <img 
                                                src={imgSrc} 
                                                alt={g.title} 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                loading="lazy"
                                                onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                            />
                                        </div>
                                        <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <small style={{ color: '#1e3a8a', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                                    {g.category}
                                                </small>
                                                <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>
                                                    {g.title}
                                                </strong>
                                            </div>
                                            <span style={{ color: '#1e3a8a' }}><ArrowUpRight size={18} /></span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightbox && (
                <div 
                    onClick={() => setLightbox(null)} 
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                >
                    <button 
                        onClick={() => setLightbox(null)} 
                        aria-label="Close"
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                    >
                        <X size={32} />
                    </button>
                    <img 
                        src={lightbox.image || lightbox.url} 
                        alt={lightbox.title}
                        style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                    />
                    <p style={{ color: '#ffffff', marginTop: '14px', fontSize: '18px', fontWeight: '700' }}>
                        {lightbox.title} ({lightbox.category})
                    </p>
                </div>
            )}
        </>
    );
}
