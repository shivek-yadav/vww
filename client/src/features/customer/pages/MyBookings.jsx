import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, CalendarDays, UserRound, Clock3, Truck, Building2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, prettyDate } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';

export function MyBookings() {
    const { data, loading, error, reload } = useFetch('/bookings/my');
    const [busy, setBusy] = useState(null);

    const cancel = async (b) => {
        if (!window.confirm(`Cancel sample request ${b.bookingNumber}?`))
            return;
        setBusy(b._id);
        try {
            await api.patch(`/bookings/my/${b._id}/cancel`);
            toast.success('Sample request cancelled');
            reload();
        } catch (e) {
            toast.error(e.message || 'Failed to cancel');
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="account-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                        Sample Requests & Quotations
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                        Review physical knitwear swatches and factory uniform sample batches requested for your institution.
                    </p>
                </div>
                <Link 
                    to="/booking" 
                    style={{ background: '#1e3a8a', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}
                >
                    + Request Bulk Quote / Sample
                </Link>
            </div>

            {loading ? (
                <Loading />
            ) : error ? (
                <Empty text={error} />
            ) : (!data || data.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Package size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                        No Sample Requests Yet
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '13px', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.6' }}>
                        Want to test our fabric yarn, check stitching, or approve school colors before placing a 50+ piece lot? You can request factory samples directly from any product details page.
                    </p>
                    <Link to="/menu" style={{ background: '#059669', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                        Browse Catalog & Request Sample
                    </Link>
                </div>
            ) : (
                <div className="order-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {data.map(b => (
                        <article 
                            className="history-card" 
                            key={b._id}
                            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}
                        >
                            <div className="history-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div>
                                        <strong style={{ fontSize: '15px', color: '#1e3a8a' }}>
                                            {b.bookingNumber}
                                        </strong>
                                        <small style={{ color: '#64748b', display: 'block', fontSize: '11px', marginTop: '2px' }}>
                                            Requested on {prettyDate(b.createdAt)}
                                        </small>
                                    </div>
                                    {b.bookingNumber?.includes('SMP') ? (
                                        <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Fabric Quality Sample
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: '10px', background: '#eff6ff', color: '#1e3a8a', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Bulk Lot Quotation
                                        </span>
                                    )}
                                </div>
                                <Status value={b.status} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '13px', color: '#334155', marginBottom: '12px' }}>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Product / Category:</span>
                                    <strong>{b.occasion || b.productName || 'Uniform Sample Swatch'}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Estimated Pieces:</span>
                                    <strong>{b.guests || 1} Pcs / Sample</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Institution / Contact:</span>
                                    <strong>{b.name} ({b.phone})</strong>
                                </div>
                            </div>

                            {b.notes && (
                                <p style={{ fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                    <strong style={{ color: '#0f172a' }}>Request Details & Address:</strong>{'\n'}{b.notes}
                                </p>
                            )}

                            {b.adminNote && (
                                <p style={{ fontSize: '12px', color: '#1e3a8a', background: '#eff6ff', padding: '8px 12px', borderRadius: '6px', margin: '8px 0' }}>
                                    <strong>Factory Dispatch Update:</strong> {b.adminNote}
                                </p>
                            )}

                            {['pending', 'confirmed'].includes(b.status) && (
                                <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '10px', marginTop: '10px' }}>
                                    <button 
                                        type="button"
                                        className="small-link-danger" 
                                        disabled={busy === b._id} 
                                        onClick={() => cancel(b)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Cancel Sample Request
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <Link to="/booking" className="text-link history-new" style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Request Custom School Knitwear Quotation <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
