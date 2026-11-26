import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, Trash2, Plus, Minus, ShoppingBag, 
    Tag, Factory, Shield, Truck, Phone, MessageCircle 
} from 'lucide-react';
import { money, photoFallback } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { PageHero } from '../../../components/UI';

export function Cart() {
    const {
        cart,
        changeQty,
        cartSubtotal,
        cartTotal,
        settings,
        coupon,
        discountAmount,
        applyCoupon,
        removeCoupon
    } = useApp();

    const [couponInput, setCouponInput] = useState('');
    const symbol = settings?.currencySymbol || '₹';

    const totalPieces = cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

    const handleApply = (e) => {
        e.preventDefault();
        if (applyCoupon(couponInput)) {
            setCouponInput('');
        }
    };

    return (
        <>
            <PageHero
                eyebrow="INSTITUTIONAL APPAREL MANUFACTURE"
                title="Wholesale Order Request Cart"
                description="Review your selected uniform & knitwear lots, size breakdowns, and manufacturing quantities."
            />

            <section className="section" style={{ background: '#f8fafc', padding: '40px 0 80px' }}>
                <div className="container">
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', background: '#ffffff', padding: '60px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
                            <ShoppingBag size={64} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
                                Your Order Request Cart is Empty
                            </h2>
                            <p style={{ color: '#64748b', margin: '12px 0 24px', fontSize: '14px', lineHeight: '1.6' }}>
                                Explore our institutional knitwear, school uniforms, pullovers, hoodies, and accessories to select sizes and calculate wholesale prices.
                            </p>
                            <Link 
                                to="/menu" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1e3a8a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}
                            >
                                Browse Product Catalog <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))', gap: '32px', alignItems: 'start' }}>
                            
                            {/* Left Column: Wholesale Lot Items */}
                            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                        Selected Product Lots ({cart.length})
                                    </h3>
                                    <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                                        Total: {totalPieces} Pieces
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {cart.map(item => {
                                        const key = item.cartItemId || item.id;
                                        return (
                                            <div 
                                                key={key}
                                                style={{
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px',
                                                    background: '#ffffff'
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                                                    <img 
                                                        src={item.image || photoFallback} 
                                                        alt={item.name}
                                                        style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                                        onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }}
                                                    />

                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                                                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                                                                <Link to={`/product/${item.slug || item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                                    {item.name}
                                                                </Link>
                                                            </h4>
                                                            <strong style={{ fontSize: '18px', color: '#1e3a8a', fontWeight: '800', whiteSpace: 'nowrap' }}>
                                                                {money(item.price * item.quantity, symbol)}
                                                            </strong>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                                                            <small style={{ color: '#64748b', fontSize: '12px' }}>
                                                                Rate: <strong>{money(item.price, symbol)}</strong> / pc
                                                            </small>
                                                            {item.customization?.color && (
                                                                <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                                                    Color: {item.customization.color}
                                                                </span>
                                                            )}
                                                            {item.customization?.withEmbroidery && (
                                                                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                                                                    ✓ Logo Embroidery Included
                                                                </span>
                                                            )}
                                                        </div>

                                                        {item.customization?.notes && (
                                                            <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px', fontStyle: 'italic' }}>
                                                                Note: "{item.customization.notes}"
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Size Breakdown Pills */}
                                                {item.sizeBreakdown && Object.keys(item.sizeBreakdown).length > 0 && (
                                                    <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                                                            Size Breakdown:
                                                        </span>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                            {Object.entries(item.sizeBreakdown).map(([sz, qty]) => (
                                                                <span 
                                                                    key={sz}
                                                                    style={{
                                                                        background: '#ffffff',
                                                                        border: '1px solid #cbd5e1',
                                                                        borderRadius: '4px',
                                                                        padding: '2px 8px',
                                                                        fontSize: '11px',
                                                                        color: '#0f172a',
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {sz}: <strong style={{ color: '#1e3a8a' }}>{qty} pcs</strong>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Lot Actions */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f8fafc', paddingTop: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '12px', color: '#64748b' }}>Total Lot:</span>
                                                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.quantity} Pieces</strong>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => changeQty(key, 0)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#ef4444',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <Trash2 size={13} /> Remove Lot
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Link 
                                        to="/menu" 
                                        style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
                                    >
                                        ← Add More Products to Quote
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Wholesale Quote Summary */}
                            <aside style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
                                    Order Request Summary
                                </h3>

                                {/* Quick Coupon Code */}
                                <form onSubmit={handleApply} style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                                        Promotional / Wholesale Coupon Code:
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Enter coupon code" 
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', textTransform: 'uppercase' }}
                                        />
                                        <button 
                                            type="submit"
                                            style={{ background: '#1e3a8a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 16px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {coupon && (
                                        <div style={{ marginTop: '8px', background: '#dcfce7', color: '#166534', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><strong>{coupon.code}</strong> applied ({coupon.discountPercent}% off)</span>
                                            <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: '800' }}>×</button>
                                        </div>
                                    )}
                                </form>

                                {/* Cost Breakdown */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '20px' }}>
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
                                        <span>Pan-India Transport / Freight:</span>
                                        <strong style={{ color: '#059669' }}>Calculated at Bilty / Dispatch</strong>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                                        <span>GST (Apparel HSN 6103/6110):</span>
                                        <small style={{ color: '#64748b' }}>As applicable on official tax invoice</small>
                                    </div>

                                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '14px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Estimated Factory Total:</span>
                                        <strong style={{ fontSize: '24px', fontWeight: '900', color: '#1e3a8a' }}>
                                            {money(cartTotal, symbol)}
                                        </strong>
                                    </div>
                                </div>

                                {/* Proceed to Checkout Button */}
                                <Link 
                                    to="/checkout"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        background: '#059669',
                                        color: '#ffffff',
                                        padding: '14px 20px',
                                        borderRadius: '8px',
                                        fontWeight: '800',
                                        fontSize: '15px',
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
                                    }}
                                >
                                    Proceed to Order Request <ArrowRight size={18} />
                                </Link>

                                {/* Manufacturer Trust Credentials */}
                                <div style={{ marginTop: '24px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Factory size={15} color="#1e3a8a" />
                                        <span>Direct Manufacturer: <strong>Vijay Woollen Works</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={15} color="#059669" />
                                        <span>GSTIN: <strong>03AWNPV3468J1ZX</strong> (Punjab)</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Truck size={15} color="#d97706" />
                                        <span>Pan-India transport bilty & road freight dispatch</span>
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
