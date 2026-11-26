import { useState, useEffect } from 'react';
import { Save, Sparkles, Store, Megaphone, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { Loading, Empty, useFetch } from '../../../components/UI';
import { AdminHeading, Card, text, boolean, Field } from '../components/AdminShared';

export function AdminSettings() {
    const { data, loading, error } = useFetch('/admin/settings', {});
    const { setSettings } = useApp();
    const [form, setForm] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (data?._id) {
            setForm({
                restaurantName: data.restaurantName || 'Vijay Woollen Works',
                tagline: data.tagline || 'Premier Manufacturer of Uniforms & Winter Knitwear',
                phone: data.phone || '+91 84272 57106',
                email: data.email || 'vijaywoolenwork@gmail.com',
                address: data.address || 'B-V-1209, Purana Bazaar, Buhrampuri, Ludhiana - 141008, Punjab, India',
                city: data.city || 'Ludhiana',
                mapUrl: data.mapUrl || '',
                instagram: data.instagram || '',
                facebook: data.facebook || '',
                bookingEnabled: !!data.bookingEnabled,
                orderingEnabled: data.orderingEnabled !== false,
                deliveryEnabled: !!data.deliveryEnabled,
                deliveryFee: data.deliveryFee ?? 0,
                freeDeliveryThreshold: data.freeDeliveryThreshold ?? 5000,
                taxPercentage: data.taxPercentage ?? 5,
                currencySymbol: data.currencySymbol || '₹',
                announcement: data.announcement || '✦ ANNUAL BUMPER WHOLESALE OFFER: Special bulk rates on School Sweaters & Uniforms ✦ Direct Factory Dispatch from Ludhiana ✦ Call: +91 84272 57106 ✦',
                announcementEnabled: data.announcementEnabled !== false,
                promoCode: data.promoCode || 'VWWSEASON',
                promoDiscount: data.promoDiscount ?? 15,
                heroTitle: data.heroTitle || "India's Trusted Manufacturer of School Uniforms & Winter Knitwear",
                heroSubtitle: data.heroSubtitle || 'Specialized in bulk production for schools, colleges, corporate institutions, and private labels since inception in Ludhiana.',
                heroBadge: data.heroBadge || 'GST: 03AWNPV3468J1ZX · MSME REGISTERED · FACTORY DIRECT DISPATCH',
                heroImage: data.heroImage || '',
                reservationMaxGuests: data.reservationMaxGuests || 500,
                minReservationLeadHours: data.minReservationLeadHours ?? 24,
                openingHours: data.openingHours || []
            });
        }
    }, [data]);

    const set = (k, v) => setForm(x => ({ ...x, [k]: v }));

    const save = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api.patch('/admin/settings', form);
            setSettings(x => ({ ...x, ...r.data.data }));
            toast.success('All settings saved and applied to website!');
        } catch (e) {
            toast.error(e.message || 'Failed to save settings');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <AdminHeading
                title="Factory & Wholesale Settings"
                subtitle="Fully customize your storefront branding, wholesale catalog pricing, promo discounts, announcements and manufacturing switches."
            />

            {loading || !form ? (
                <Loading />
            ) : error ? (
                <Empty text={error} />
            ) : (
                <form className="admin-settings-grid" onSubmit={save}>
                    {/* Column 1: Storefront Branding & E-Commerce */}
                    <div className="admin-settings-main">
                        <Card title="Announcement & Promotions Bar">
                            <div className="form-stack">
                                {[
                                    boolean('announcementEnabled', 'Display top announcement banner on storefront'),
                                    text('announcement', 'Announcement Bar Message (shown to all visitors)'),
                                    text('promoCode', 'Active Promo / Coupon Code (e.g. ROYAL10)'),
                                    { key: 'promoDiscount', label: 'Promo Discount Percentage (%)', type: 'number' }
                                ].map(f => (
                                    <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                                ))}
                            </div>
                        </Card>

                        <Card title="Homepage Hero Customization">
                            <div className="form-stack">
                                {[
                                    text('heroBadge', 'Hero Top Badge / Tagline'),
                                    text('heroTitle', 'Main Hero Headline'),
                                    { key: 'heroSubtitle', label: 'Hero Subtext Description', type: 'textarea' },
                                    { key: 'heroImage', label: 'Hero Background Image (URL)', type: 'image' }
                                ].map(f => (
                                    <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                                ))}
                            </div>
                        </Card>

                        <Card title="Business & Contact Information">
                            <div className="form-stack">
                                {[
                                    text('restaurantName', 'Manufacturer / Brand Name'),
                                    text('tagline', 'Factory Tagline'),
                                    text('phone', 'Phone Number (Primary)'),
                                    text('email', 'Email Address', false, { type: 'email' }),
                                    text('address', 'Physical Street Address'),
                                    text('city', 'City'),
                                    text('mapUrl', 'Google Maps Location Link'),
                                    text('instagram', 'Instagram Profile Link'),
                                    text('facebook', 'Facebook Page Link')
                                ].map(f => (
                                    <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Column 2: Operations, E-Commerce Pricing & Hours */}
                    <div className="admin-settings-side">
                        <Card title="Wholesale E-Commerce & Freight Rules">
                            <div className="form-stack">
                                {[
                                    boolean('orderingEnabled', 'Accept Online Wholesale Orders'),
                                    boolean('deliveryEnabled', 'Enable Freight Transport Dispatch / Delivery'),
                                    text('currencySymbol', 'Currency Symbol (e.g. ₹ or $)'),
                                    { key: 'deliveryFee', label: 'Standard Transport Freight Bilti Charge (₹)', type: 'number' },
                                    { key: 'freeDeliveryThreshold', label: 'Free Freight Threshold (Orders above this qualify)', type: 'number' },
                                    { key: 'taxPercentage', label: 'Tax / GST Rate (%)', type: 'number' }
                                ].map(f => (
                                    <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                                ))}
                            </div>
                        </Card>

                        <Card title="Sample & Quotation Request Settings">
                            <div className="form-stack">
                                {[
                                    boolean('bookingEnabled', 'Accept Sample Swatch & Quotation Requests'),
                                    { key: 'reservationMaxGuests', label: 'Max Sample Pieces per Request', type: 'number' },
                                    { key: 'minReservationLeadHours', label: 'Minimum Sample Preparation Notice (Hours)', type: 'number' }
                                ].map(f => (
                                    <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                                ))}
                            </div>
                        </Card>

                        <Card title="Factory & Dispatch Operating Hours">
                            <div className="form-stack">
                                {form.openingHours.map((h, i) => (
                                    <div className="hours-setting-row" key={h.day}>
                                        <strong>{h.day}</strong>
                                        <div className="hours-inputs">
                                            <input
                                                type="time"
                                                disabled={h.closed}
                                                value={h.open}
                                                onChange={e => set('openingHours', form.openingHours.map((x, j) => i === j ? { ...x, open: e.target.value } : x))}
                                            />
                                            <span>to</span>
                                            <input
                                                type="time"
                                                disabled={h.closed}
                                                value={h.close}
                                                onChange={e => set('openingHours', form.openingHours.map((x, j) => i === j ? { ...x, close: e.target.value } : x))}
                                            />
                                        </div>
                                        <label className="closed-check">
                                            <input
                                                type="checkbox"
                                                checked={!!h.closed}
                                                onChange={e => set('openingHours', form.openingHours.map((x, j) => i === j ? { ...x, closed: e.target.checked } : x))}
                                            /> Closed
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="admin-sticky-save">
                            <button disabled={busy} className="admin-primary settings-save full-width">
                                <Save size={18} /> {busy ? 'Applying changes...' : 'Save All Customizations'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}
