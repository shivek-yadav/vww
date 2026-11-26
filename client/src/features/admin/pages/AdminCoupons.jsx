import { useState } from 'react';
import { Tag, Plus, Sparkles, Copy, Check, Pencil, Trash2, Search, Save, X, Calendar, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useFetch, Loading, Empty, Status } from '../../../components/UI';
import { AdminHeading, Card, IconButton, Modal } from '../components/AdminShared';

export function AdminCoupons() {
    const { data: coupons = [], loading, error, reload } = useFetch('/admin/coupons');
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    // Initial empty form state
    const initialForm = {
        code: '',
        discountPercent: 10,
        minOrderValue: 0,
        maxDiscount: '',
        description: '',
        expiresAt: '',
        active: true
    };
    const [form, setForm] = useState(initialForm);

    // Code generator helper
    const generateCode = () => {
        const prefixes = ['VWW', 'BULK', 'SAVE', 'WINTER', 'PROMO', 'DEAL'];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newCode = `${randomPrefix}-${randomNum}`;
        setForm(prev => ({ ...prev, code: newCode }));
        toast.success(`Generated code: ${newCode}`);
    };

    const openCreateModal = () => {
        setEditing(null);
        setForm(initialForm);
        setModalOpen(true);
    };

    const openEditModal = (coupon) => {
        setEditing(coupon);
        setForm({
            code: coupon.code || '',
            discountPercent: coupon.discountPercent ?? 10,
            minOrderValue: coupon.minOrderValue ?? 0,
            maxDiscount: coupon.maxDiscount ?? '',
            description: coupon.description || '',
            expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
            active: coupon.active ?? true
        });
        setModalOpen(true);
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Copied code "${code}" to clipboard!`);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.code.trim()) {
            toast.error('Coupon code is required');
            return;
        }
        if (form.discountPercent <= 0 || form.discountPercent > 100) {
            toast.error('Discount percent must be between 1 and 100');
            return;
        }

        setBusy(true);
        try {
            const payload = {
                code: form.code.toUpperCase().trim(),
                discountPercent: Number(form.discountPercent),
                minOrderValue: Number(form.minOrderValue || 0),
                maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
                description: form.description.trim(),
                expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
                active: !!form.active
            };

            if (editing) {
                await api.patch(`/admin/coupons/${editing._id}`, payload);
                toast.success('Coupon updated successfully');
            } else {
                await api.post('/admin/coupons', payload);
                toast.success('New coupon created successfully');
            }
            setModalOpen(false);
            reload();
        } catch (err) {
            toast.error(err.message || 'Failed to save coupon');
        } finally {
            setBusy(false);
        }
    };

    const handleToggleActive = async (coupon) => {
        try {
            await api.patch(`/admin/coupons/${coupon._id}`, { active: !coupon.active });
            toast.success(`Coupon ${coupon.code} ${!coupon.active ? 'activated' : 'deactivated'}`);
            reload();
        } catch (err) {
            toast.error(err.message || 'Failed to update status');
        }
    };

    const handleDelete = async (coupon) => {
        if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;
        try {
            await api.delete(`/admin/coupons/${coupon._id}`);
            toast.success(`Coupon ${coupon.code} deleted`);
            reload();
        } catch (err) {
            toast.error(err.message || 'Failed to delete coupon');
        }
    };

    // Filter coupons
    const filtered = coupons.filter(c => 
        (c.code && c.code.toLowerCase().includes(search.toLowerCase())) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );

    const activeCount = coupons.filter(c => c.active).length;

    return (
        <>
            <AdminHeading
                title="Coupons & Promo Codes"
                subtitle="Create, generate, and manage discount vouchers for wholesale bulk orders and seasonal campaigns."
                action={
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="admin-primary" onClick={openCreateModal}>
                            <Plus size={18} /> Create New Coupon
                        </button>
                    </div>
                }
            />

            {/* Quick KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: '#eff6ff', color: '#1e3a8a', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Coupons</span>
                        <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '2px 0 0' }}>{coupons.length}</h4>
                    </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: '#ecfdf5', color: '#059669', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Percent size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Active Offers</span>
                        <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#059669', margin: '2px 0 0' }}>{activeCount} Active</h4>
                    </div>
                </div>
            </div>

            <Card
                title={`Coupons List (${filtered.length})`}
                action={
                    <label className="admin-search">
                        <Search size={16} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by code or description..."
                        />
                    </label>
                }
            >
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Empty text={error} />
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                        <Tag size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>No coupons found</h4>
                        <p style={{ fontSize: '14px', maxWidth: '400px', margin: '4px auto 16px' }}>
                            {search ? 'Try adjusting your search criteria.' : 'Create your first discount coupon code to reward wholesale buyers.'}
                        </p>
                        <button className="admin-primary" onClick={openCreateModal} style={{ margin: '0 auto' }}>
                            <Plus size={16} /> Create Coupon
                        </button>
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Coupon Code</th>
                                    <th>Discount %</th>
                                    <th>Min Order Value</th>
                                    <th>Description</th>
                                    <th>Expiry Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(coupon => (
                                    <tr key={coupon._id}>
                                        <td>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                <code style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', color: '#1e3a8a', letterSpacing: '0.04em' }}>
                                                    {coupon.code}
                                                </code>
                                                <button
                                                    onClick={() => handleCopy(coupon.code)}
                                                    title="Copy code"
                                                    type="button"
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                                                >
                                                    {copiedCode === coupon.code ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: '800', color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                                                {coupon.discountPercent}% OFF
                                            </span>
                                        </td>
                                        <td>
                                            {coupon.minOrderValue ? `₹${Number(coupon.minOrderValue).toLocaleString('en-IN')}` : 'No Minimum'}
                                        </td>
                                        <td style={{ maxWidth: '240px', fontSize: '13px', color: '#475569' }}>
                                            {coupon.description || '—'}
                                        </td>
                                        <td style={{ fontSize: '13px', color: '#64748b' }}>
                                            {coupon.expiresAt ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={13} />
                                                    {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            ) : (
                                                'No Expiry'
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleActive(coupon)}
                                                title="Click to toggle status"
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                                            >
                                                <Status value={coupon.active ? 'published' : 'draft'} />
                                            </button>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    icon={Pencil}
                                                    label="Edit Coupon"
                                                    onClick={() => openEditModal(coupon)}
                                                />
                                                <IconButton
                                                    icon={Trash2}
                                                    label="Delete Coupon"
                                                    danger
                                                    onClick={() => handleDelete(coupon)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Modal for Add / Edit */}
            {modalOpen && (
                <Modal
                    title={editing ? `Edit Coupon: ${editing.code}` : 'Create New Coupon'}
                    onClose={() => setModalOpen(false)}
                >
                    <form className="form-stack" onSubmit={handleSave}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                Coupon Code *
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    required
                                    type="text"
                                    value={form.code}
                                    onChange={e => setForm(x => ({ ...x, code: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. VWWSEASON or BULK50"
                                    style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}
                                />
                                <button
                                    type="button"
                                    onClick={generateCode}
                                    className="admin-secondary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                    title="Generate a random promo code"
                                >
                                    <Sparkles size={16} /> Auto Generate
                                </button>
                            </div>
                            <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                Clients can enter this promo code during checkout or in cart to apply the discount.
                            </small>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <label>
                                Discount Percentage (%) *
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={form.discountPercent}
                                    onChange={e => setForm(x => ({ ...x, discountPercent: e.target.value }))}
                                />
                            </label>
                            <label>
                                Minimum Order Value (₹)
                                <input
                                    type="number"
                                    min="0"
                                    value={form.minOrderValue}
                                    onChange={e => setForm(x => ({ ...x, minOrderValue: e.target.value }))}
                                    placeholder="0 (optional)"
                                />
                            </label>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <label>
                                Max Discount Cap (₹)
                                <input
                                    type="number"
                                    min="0"
                                    value={form.maxDiscount}
                                    onChange={e => setForm(x => ({ ...x, maxDiscount: e.target.value }))}
                                    placeholder="No limit (optional)"
                                />
                            </label>
                            <label>
                                Expiration Date
                                <input
                                    type="date"
                                    value={form.expiresAt}
                                    onChange={e => setForm(x => ({ ...x, expiresAt: e.target.value }))}
                                />
                            </label>
                        </div>

                        <label>
                            Coupon Description
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={e => setForm(x => ({ ...x, description: e.target.value }))}
                                placeholder="e.g. Special 15% discount on bulk school winter wear pre-orders"
                            />
                        </label>

                        <label className="admin-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={!!form.active}
                                onChange={e => setForm(x => ({ ...x, active: e.target.checked }))}
                            />
                            <span><strong>Active and Redeemable</strong> (Uncheck to temporarily disable this coupon)</span>
                        </label>

                        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button
                                type="button"
                                className="admin-secondary"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={busy}
                                className="admin-primary"
                                type="submit"
                            >
                                <Save size={17} /> {busy ? 'Saving...' : editing ? 'Update Coupon' : 'Create Coupon'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
