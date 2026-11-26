import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, money } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { safeDate, AdminHeading, Card, AdminTable, Modal } from '../components/AdminShared';
import { useApp } from '../../../context/AppContext';
import { Printer, MapPin, Phone, MessageSquare, AlertCircle } from 'lucide-react';

export function AdminOrders() {
    const { settings } = useApp();
    const symbol = settings?.currencySymbol || '₹';
    const { data, loading, error, reload } = useFetch('/admin/orders');
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState(null);
    const [busy, setBusy] = useState(false);

    const shown = data.filter(x => filter === 'all' || x.status === filter);

    const transitions = {
        placed: ['accepted', 'rejected', 'cancelled'],
        accepted: ['preparing', 'cancelled'],
        preparing: ['ready'],
        ready: ['completed'],
        completed: [],
        rejected: [],
        cancelled: []
    };

    const statusLabels = {
        accepted: 'Accept Order Request',
        preparing: 'Start Knitting / Loom Production',
        ready: 'Mark Ready for Dispatch / Bilty Issued',
        completed: 'Dispatched / Delivered',
        rejected: 'Reject Request',
        cancelled: 'Cancel Request'
    };

    const change = async (order, status) => {
        setBusy(true);
        try {
            await api.patch(`/admin/orders/${order._id}/status`, { status });
            toast.success(`Order status changed to ${status}`);
            setSelected(null);
            reload();
        } catch (e) {
            toast.error(e.message || 'Failed to update order');
        } finally {
            setBusy(false);
        }
    };

    const markPaid = async (order, paymentStatus) => {
        setBusy(true);
        try {
            await api.patch(`/admin/orders/${order._id}/payment`, { paymentStatus });
            toast.success(`Payment marked as ${paymentStatus}`);
            setSelected(null);
            reload();
        } catch (e) {
            toast.error(e.message || 'Failed to update payment');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <AdminHeading
                title="Wholesale Orders & Factory Dispatch"
                subtitle="Live order request feed: manage loom production schedule, transport dispatch, and payments."
            />

            <Card
                title={`All Customer Orders (${shown.length})`}
                action={
                    <select
                        className="admin-filter"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        aria-label="Filter by order status"
                    >
                        {[
                            'all',
                            'placed',
                            'accepted',
                            'preparing',
                            'ready',
                            'completed',
                            'rejected',
                            'cancelled'
                        ].map(x => (
                            <option key={x} value={x}>
                                {x === 'all' ? 'All Statuses' : x.replaceAll('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                }
            >
                {loading ? (
                    <Loading label="Loading orders..." />
                ) : error ? (
                    <Empty text={error} />
                ) : (
                    <AdminTable
                        rows={shown}
                        columns={[
                            {
                                label: 'Order',
                                render: x => (
                                    <div>
                                        <strong>{x.orderNumber}</strong>
                                        <small className="table-sub">{safeDate(x.createdAt)}</small>
                                    </div>
                                )
                            },
                            {
                                label: 'Customer',
                                render: x => (
                                    <div>
                                        <strong>{x.customer?.name || x.address?.name || 'Guest'}</strong>
                                        <small className="table-sub">{x.customer?.email || x.address?.phone || '—'}</small>
                                    </div>
                                )
                            },
                            {
                                label: 'Fulfillment',
                                render: x => (
                                    <span className="table-fulfillment-tag">
                                        {x.fulfillment === 'delivery' || x.fulfillment === 'transport' ? '🚛 Freight Dispatch' : '🏭 Mill Pickup'}
                                    </span>
                                )
                            },
                            {
                                label: 'Amount',
                                render: x => <strong>{money(x.total, symbol)}</strong>
                            },
                            {
                                label: 'Payment',
                                render: x => <Status value={x.paymentStatus} />
                            },
                            {
                                label: 'Production Status',
                                render: x => <Status value={x.status} />
                            },
                            {
                                label: 'Actions',
                                render: x => (
                                    <button
                                        type="button"
                                        className="admin-primary-small"
                                        onClick={() => setSelected(x)}
                                    >
                                        Manage
                                    </button>
                                )
                            }
                        ]}
                    />
                )}
            </Card>

            {selected && (
                <Modal title={`Manage Order #${selected.orderNumber}`} onClose={() => setSelected(null)}>
                    <div className="order-detail">
                        <div className="order-modal-grid">
                            <div className="order-detail-card">
                                <h4>Customer & Destination</h4>
                                <p><strong>Name:</strong> {selected.customer?.name || selected.address?.name || 'Guest'}</p>
                                <p><strong>Email:</strong> {selected.customer?.email || '—'}</p>
                                <p><strong>Phone:</strong> {selected.address?.phone || selected.customer?.phone || '—'}</p>
                                <p><strong>Fulfillment:</strong> {selected.fulfillment === 'factory_pickup' || selected.fulfillment === 'pickup' ? 'Ludhiana Factory Pickup' : 'Transport Freight Dispatch'}</p>
                                {selected.address?.line1 && (
                                    <p><strong>Address:</strong> {selected.address.line1}, {selected.address.city} {selected.address.pincode}</p>
                                )}
                                {selected.notes && (
                                    <p className="order-customer-notes">
                                        <strong>Notes:</strong> {selected.notes}
                                    </p>
                                )}
                            </div>

                            <div className="order-detail-card">
                                <h4>Ordered Items & Amounts</h4>
                                {selected.items?.map((item, i) => (
                                    <div key={i} className="detail-line">
                                        <span>{item.quantity} × {item.name}</span>
                                        <strong>{money(item.lineTotal || (item.price * item.quantity), symbol)}</strong>
                                    </div>
                                ))}
                                <hr />
                                <div className="detail-line">
                                    <span>Subtotal</span>
                                    <span>{money(selected.subtotal, symbol)}</span>
                                </div>
                                {selected.discount > 0 && (
                                    <div className="detail-line discount-text">
                                        <span>Coupon Discount ({selected.promoCode})</span>
                                        <span>-{money(selected.discount, symbol)}</span>
                                    </div>
                                )}
                                <div className="detail-line">
                                    <span>Delivery Fee</span>
                                    <span>{selected.deliveryFee > 0 ? money(selected.deliveryFee, symbol) : 'Free'}</span>
                                </div>
                                <div className="detail-line total">
                                    <span>Grand Total</span>
                                    <strong>{money(selected.total, symbol)}</strong>
                                </div>
                                <div className="detail-line">
                                    <span>Payment Method</span>
                                    <strong>{selected.paymentMethod?.replaceAll('_', ' ')}</strong>
                                </div>
                                <div className="detail-line">
                                    <span>Payment Status</span>
                                    <Status value={selected.paymentStatus} />
                                </div>
                                <div className="detail-line">
                                    <span>Current Status</span>
                                    <Status value={selected.status} />
                                </div>
                            </div>
                        </div>

                        <div className="order-actions-section">
                            <h4>Update Loom / Dispatch Status</h4>
                            <div className="modal-actions wrap">
                                {transitions[selected.status]?.map(s => (
                                    <button
                                        disabled={busy}
                                        key={s}
                                        type="button"
                                        className={['rejected', 'cancelled'].includes(s) ? 'admin-secondary' : 'admin-primary'}
                                        onClick={() => change(selected, s)}
                                    >
                                        {statusLabels[s] || s}
                                    </button>
                                ))}
                                {selected.paymentStatus === 'unpaid' && !['cancelled', 'rejected'].includes(selected.status) && (
                                    <button
                                        disabled={busy}
                                        type="button"
                                        className="admin-secondary"
                                        onClick={() => markPaid(selected, 'paid')}
                                    >
                                        Mark as Paid (Received)
                                    </button>
                                )}
                                {selected.paymentStatus === 'paid' && (
                                    <button
                                        disabled={busy}
                                        type="button"
                                        className="admin-secondary"
                                        onClick={() => markPaid(selected, 'refunded')}
                                    >
                                        Record Refund
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="admin-secondary"
                                    onClick={() => window.print()}
                                >
                                    <Printer size={15} /> Print Production Bilty Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
