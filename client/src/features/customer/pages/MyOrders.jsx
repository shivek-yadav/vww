import { useState } from 'react';
import {
    CheckCircle2, Clock, Factory, Truck, PackageCheck, AlertOctagon,
    Receipt, X, Printer, ArrowRight, RotateCcw, MapPin, Phone
} from 'lucide-react';
import { money, prettyDate } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
    { key: 'placed', label: 'Order Request Placed', icon: Clock },
    { key: 'accepted', label: 'Confirmed by Factory', icon: CheckCircle2 },
    { key: 'preparing', label: 'In Loom / Production', icon: Factory },
    { key: 'ready', label: 'Ready for Dispatch / Bilty', icon: Truck },
    { key: 'completed', label: 'Dispatched / Delivered', icon: PackageCheck }
];

function getStepIndex(status) {
    if (status === 'placed') return 0;
    if (status === 'accepted') return 1;
    if (status === 'preparing') return 2;
    if (status === 'ready') return 3;
    if (status === 'completed') return 4;
    return -1;
}

export function MyOrders() {
    const { data, loading, error, reload } = useFetch('/orders/my');
    const { settings, addCart } = useApp();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const symbol = settings?.currencySymbol || '₹';

    const handleReorder = (order) => {
        if (!order.items || order.items.length === 0) return;
        order.items.forEach(item => {
            addCart({
                _id: item.menuItem || item.product || item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                available: true
            });
        });
        toast.success(`Items from ${order.orderNumber} added to cart!`);
    };

    return (
        <div className="account-panel">
            <div className="panel-header-row">
                <div>
                    <h2>My Wholesale Orders & Tracking</h2>
                    <p>Track your apparel manufacturing orders live from our Ludhiana factory to your transport destination.</p>
                </div>
                <button type="button" className="refresh-btn" onClick={reload}>
                    Refresh Status
                </button>
            </div>

            {loading ? (
                <Loading label="Fetching your order history..." />
            ) : error ? (
                <Empty text={error} />
            ) : data.length === 0 ? (
                <Empty
                    title="No orders yet"
                    text="Your first exquisite royal feast is only a click away. Explore our menu!"
                />
            ) : (
                <div className="order-list">
                    {data.map(o => {
                        const isCancelled = ['rejected', 'cancelled'].includes(o.status);
                        const currentStep = getStepIndex(o.status);

                        return (
                            <article className="history-card" key={o._id}>
                                <div className="history-header">
                                    <div className="history-meta">
                                        <strong>{o.orderNumber}</strong>
                                        <small>{prettyDate(o.createdAt)}</small>
                                    </div>
                                    <div className="history-status-wrap">
                                        <Status value={o.status} />
                                    </div>
                                </div>

                                {/* Visual Order Tracking Stepper */}
                                {isCancelled ? (
                                    <div className="order-cancelled-banner">
                                        <AlertOctagon size={18} />
                                        <span>This order was {o.status}.</span>
                                    </div>
                                ) : (
                                    <div className="order-tracker-timeline">
                                        <div className="timeline-steps">
                                            {STATUS_STEPS.map((step, idx) => {
                                                const Icon = step.icon;
                                                const isDone = currentStep >= idx;
                                                const isCurrent = currentStep === idx;

                                                return (
                                                    <div
                                                        key={step.key}
                                                        className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                                                    >
                                                        <div className="timeline-node">
                                                            <Icon size={16} />
                                                        </div>
                                                        <span className="timeline-label">{step.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="history-body">
                                    <div className="history-items-summary">
                                        {o.items.map((x, i) => (
                                            <span key={i} className="history-item-pill">
                                                {x.quantity} × {x.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="history-fulfillment-info">
                                        <span>
                                            {o.fulfillment === 'pickup' || o.fulfillment === 'factory_pickup' ? '🏭 Factory Pickup (Ludhiana)' : '🚛 Transport Freight Dispatch'} ·
                                            Payment: <strong>{o.paymentStatus === 'paid' ? 'Paid' : 'Payment on Invoice / Bilty'}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="history-footer">
                                    <div className="history-total">
                                        <span>Total Amount:</span>
                                        <strong>{money(o.total, symbol)}</strong>
                                    </div>
                                    <div className="history-actions">
                                        <button
                                            type="button"
                                            className="btn-order-view"
                                            onClick={() => setSelectedOrder(o)}
                                        >
                                            <Receipt size={14} /> View Receipt
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-order-reorder"
                                            onClick={() => handleReorder(o)}
                                        >
                                            <RotateCcw size={14} /> Re-Order
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Detailed Order Receipt Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedOrder(null); }}>
                    <div className="admin-modal receipt-modal" role="dialog" aria-modal="true">
                        <div className="modal-heading">
                            <div>
                                <h2>Receipt · {selectedOrder.orderNumber}</h2>
                                <small>{prettyDate(selectedOrder.createdAt)}</small>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} aria-label="Close modal">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="receipt-content">
                            <div className="receipt-section">
                                <h4>Fulfillment & Contact</h4>
                                <p><strong>Method:</strong> {selectedOrder.fulfillment === 'delivery' ? 'Home Delivery' : 'Pickup'}</p>
                                {selectedOrder.address?.line1 && (
                                    <p>
                                        <MapPin size={15} /> <strong>Deliver to:</strong> {selectedOrder.address.name}, {selectedOrder.address.line1}, {selectedOrder.address.city} {selectedOrder.address.pincode}
                                    </p>
                                )}
                                {selectedOrder.address?.phone && (
                                    <p><Phone size={15} /> <strong>Phone:</strong> {selectedOrder.address.phone}</p>
                                )}
                                {selectedOrder.notes && (
                                    <p><strong>Instructions:</strong> {selectedOrder.notes}</p>
                                )}
                            </div>

                            <div className="receipt-section">
                                <h4>Ordered Items</h4>
                                <div className="receipt-items-table">
                                    {selectedOrder.items?.map((it, idx) => (
                                        <div key={idx} className="receipt-line">
                                            <span>{it.quantity} × {it.name}</span>
                                            <strong>{money(it.lineTotal || (it.price * it.quantity), symbol)}</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="receipt-breakdown">
                                <div className="receipt-line">
                                    <span>Subtotal</span>
                                    <span>{money(selectedOrder.subtotal, symbol)}</span>
                                </div>
                                {selectedOrder.discount > 0 && (
                                    <div className="receipt-line discount-text">
                                        <span>Coupon Discount ({selectedOrder.promoCode})</span>
                                        <span>-{money(selectedOrder.discount, symbol)}</span>
                                    </div>
                                )}
                                <div className="receipt-line">
                                    <span>Delivery Fee</span>
                                    <span>{selectedOrder.deliveryFee > 0 ? money(selectedOrder.deliveryFee, symbol) : 'Free'}</span>
                                </div>
                                <hr />
                                <div className="receipt-line total-line">
                                    <span>Grand Total</span>
                                    <strong>{money(selectedOrder.total, symbol)}</strong>
                                </div>
                                <div className="receipt-line">
                                    <span>Payment Method</span>
                                    <span>{selectedOrder.paymentMethod?.replaceAll('_', ' ')} ({selectedOrder.paymentStatus})</span>
                                </div>
                            </div>

                            <div className="receipt-footer-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => window.print()}
                                >
                                    <Printer size={15} /> Print Receipt
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-gold"
                                    onClick={() => {
                                        handleReorder(selectedOrder);
                                        setSelectedOrder(null);
                                    }}
                                >
                                    Re-Order This Feast
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
