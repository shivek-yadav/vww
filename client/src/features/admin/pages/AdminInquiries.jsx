import { useState, useMemo } from 'react';
import { Save, Phone, MessageCircle, Mail, Search, CheckCircle2, Clock, User, Building, FileText, ArrowUpRight, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, Modal } from '../components/AdminShared';

export const COUNTRY_CODES = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' }
];

export function parsePhoneDetails(raw) {
    if (!raw) return { code: '+91', number: '', flag: '🇮🇳', display: 'No Phone Provided', intl: '' };
    const str = String(raw).trim();

    // Check if phone already begins with any known country code
    for (const c of COUNTRY_CODES) {
        if (str.startsWith(c.code)) {
            const num = str.slice(c.code.length).trim();
            const clean = num.replace(/[^0-9]/g, '');
            return {
                code: c.code,
                number: num,
                flag: c.flag,
                country: c.country,
                display: `${c.flag} ${c.code} ${num}`,
                intl: c.code.replace('+', '') + clean
            };
        }
    }

    // Default to +91 India if no explicit code
    const clean = str.replace(/[^0-9]/g, '');
    return {
        code: '+91',
        number: str,
        flag: '🇮🇳',
        country: 'India',
        display: `🇮🇳 +91 ${str}`,
        intl: '91' + clean
    };
}

export function AdminInquiries() {
    const { data, loading, error, reload } = useFetch('/admin/inquiries');
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState('new');
    const [note, setNote] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Phone editing with country code
    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

    const stats = useMemo(() => {
        const total = data.length;
        const newLeads = data.filter(x => x.status === 'new').length;
        const inProgress = data.filter(x => x.status === 'in_progress').length;
        const resolved = data.filter(x => x.status === 'resolved').length;
        return { total, newLeads, inProgress, resolved };
    }, [data]);

    const filtered = useMemo(() => {
        return data.filter(x => {
            const matchesStatus = filterStatus === 'all' || x.status === filterStatus;
            const searchStr = `${x.name} ${x.email} ${x.phone || ''} ${x.subject || ''} ${x.message || ''}`.toLowerCase();
            const matchesSearch = searchStr.includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [data, filterStatus, search]);

    const openModal = (inq) => {
        setSelected(inq);
        setStatus(inq.status || 'new');
        setNote(inq.adminNote || '');
        const parsed = parsePhoneDetails(inq.phone);
        setSelectedCountryCode(parsed.code);
        setSelectedPhoneNumber(parsed.number);
    };

    const save = async () => {
        try {
            const formattedPhone = selectedPhoneNumber.trim()
                ? `${selectedCountryCode} ${selectedPhoneNumber.trim()}`
                : '';

            await api.patch(`/admin/inquiries/${selected._id}`, { 
                status, 
                adminNote: note,
                phone: formattedPhone
            });
            toast.success('Client inquiry and country phone updated!');
            setSelected(null);
            reload();
        } catch (e) {
            toast.error(e.message || 'Failed to update record');
        }
    };

    return (
        <div className="admin-inquiries-page">
            <AdminHeading 
                title="Client Management & Call CRM" 
                subtitle="Manage incoming school inquiries, buyer contacts, quotation requests, and international follow-ups with country codes."
            />

            {/* Top KPI Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <small style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Total Inquiries</small>
                    <strong style={{ display: 'block', fontSize: '28px', color: '#0f172a', fontWeight: '800', marginTop: '4px' }}>{stats.total}</strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <small style={{ color: '#ea580c', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>New Leads</small>
                    <strong style={{ display: 'block', fontSize: '28px', color: '#c2410c', fontWeight: '800', marginTop: '4px' }}>{stats.newLeads}</strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <small style={{ color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Quotation / In Progress</small>
                    <strong style={{ display: 'block', fontSize: '28px', color: '#1d4ed8', fontWeight: '800', marginTop: '4px' }}>{stats.inProgress}</strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <small style={{ color: '#16a34a', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Resolved / Dispatched</small>
                    <strong style={{ display: 'block', fontSize: '28px', color: '#15803d', fontWeight: '800', marginTop: '4px' }}>{stats.resolved}</strong>
                </div>
            </div>

            <Card 
                title={`Client Directory & Leads (${filtered.length})`}
                action={
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select 
                            value={filterStatus} 
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ padding: '7px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff' }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="new">New Leads</option>
                            <option value="in_progress">In Progress / Quoted</option>
                            <option value="resolved">Resolved / Dispatched</option>
                        </select>
                        <div style={{ position: 'relative' }}>
                            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                value={search} 
                                onChange={e => setSearch(e.target.value)} 
                                placeholder="Search client name, school, phone..." 
                                style={{ padding: '7px 12px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                            />
                        </div>
                    </div>
                }
            >
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Empty text={error} />
                ) : filtered.length === 0 ? (
                    <Empty title="No inquiries found" text="No client inquiries match the current search." />
                ) : (
                    <div className="table-scroll">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Client / Institution</th>
                                    <th>Country & Contact Phone</th>
                                    <th>Subject & Sizing</th>
                                    <th>Status</th>
                                    <th>Internal Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(x => {
                                    const parsed = parsePhoneDetails(x.phone);

                                    return (
                                        <tr key={x._id}>
                                            <td>
                                                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{x.name}</strong>
                                                <small className="table-sub" style={{ display: 'block', color: '#64748b' }}>
                                                    {x.email}
                                                </small>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span 
                                                        style={{ 
                                                            display: 'inline-flex', 
                                                            alignItems: 'center', 
                                                            gap: '5px',
                                                            background: '#f8fafc',
                                                            border: '1px solid #e2e8f0',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            fontWeight: '600', 
                                                            color: '#0f172a', 
                                                            fontSize: '12.5px' 
                                                        }}
                                                    >
                                                        <span>{parsed.flag}</span>
                                                        <strong style={{ color: '#1e3a8a' }}>{parsed.code}</strong>
                                                        <span>{parsed.number || '—'}</span>
                                                    </span>

                                                    {parsed.number && (
                                                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                                                            <a 
                                                                href={`tel:${parsed.code}${parsed.number}`}
                                                                title={`Call ${parsed.display}`}
                                                                style={{ background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '4px 6px', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                                                            >
                                                                <Phone size={13} />
                                                            </a>
                                                            <a 
                                                                href={`https://wa.me/${parsed.intl}?text=Hello%20${encodeURIComponent(x.name)},%20this%20is%20Vijay%20Woollen%20Works%20Ludhiana%20regarding%20your%20uniform%20inquiry.`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title={`WhatsApp ${parsed.display}`}
                                                                style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '4px 6px', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                                                            >
                                                                <MessageCircle size={13} />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <strong style={{ display: 'block', fontSize: '13px', color: '#334155' }}>{x.subject || 'Inquiry'}</strong>
                                                <span className="table-truncate" style={{ maxWidth: '240px', fontSize: '12px', color: '#64748b' }}>
                                                    {x.message}
                                                </span>
                                            </td>
                                            <td>
                                                <Status value={x.status} />
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '12px', color: x.adminNote ? '#0f172a' : '#94a3b8', fontStyle: x.adminNote ? 'normal' : 'italic' }}>
                                                    {x.adminNote || 'No notes added'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="admin-outline-small"
                                                    onClick={() => openModal(x)}
                                                >
                                                    Manage Client
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Client Detail & Management Modal */}
            {selected && (
                <Modal title={`Client Inquiry: ${selected.name}`} onClose={() => setSelected(null)}>
                    <div className="form-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Quick Contact Header Bar */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <strong style={{ fontSize: '16px', color: '#0f172a', display: 'block' }}>{selected.name}</strong>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                    {selectedCountryCode} {selectedPhoneNumber || 'No phone'} · {selected.email}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {selectedPhoneNumber && (
                                    <>
                                        <a 
                                            href={`tel:${selectedCountryCode}${selectedPhoneNumber}`} 
                                            style={{ background: '#1e3a8a', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <Phone size={14} /> Call Client
                                        </a>
                                        <a 
                                            href={`https://wa.me/${selectedCountryCode.replace('+', '')}${selectedPhoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selected.name)},%20this%20is%20Vijay%20Woollen%20Works%20Ludhiana%20regarding%20your%20quotation.`}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ background: '#16a34a', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <MessageCircle size={14} /> WhatsApp
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Country Code & Phone Input Group */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Client Phone & Country Code
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px' }}>
                                <select
                                    value={selectedCountryCode}
                                    onChange={e => setSelectedCountryCode(e.target.value)}
                                    style={{ padding: '9px 10px', border: '1.5px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff', fontWeight: '600', color: '#1e293b' }}
                                >
                                    {COUNTRY_CODES.map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.code} ({c.country})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number (e.g. 98765 43210)"
                                    value={selectedPhoneNumber}
                                    onChange={e => setSelectedPhoneNumber(e.target.value)}
                                    style={{ padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', color: '#0f172a' }}
                                />
                            </div>
                            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                                Country code is auto-formatted for one-click international dialing and WhatsApp messaging.
                            </small>
                        </div>

                        <div>
                            <strong style={{ fontSize: '14px', color: '#334155', display: 'block', marginBottom: '4px' }}>Requirement / Subject</strong>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                {selected.subject || 'General Wholesale Inquiry'}
                            </div>
                        </div>

                        <div>
                            <strong style={{ fontSize: '14px', color: '#334155', display: 'block', marginBottom: '6px' }}>Client Message & Specifications</strong>
                            <div style={{ background: '#f1f5f9', padding: '14px', borderRadius: '8px', fontSize: '13px', color: '#1e293b', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {selected.message || 'No additional specifications provided.'}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Inquiry Status
                            </label>
                            <select 
                                value={status} 
                                onChange={e => setStatus(e.target.value)}
                                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
                            >
                                <option value="new">New Lead (Pending Contact)</option>
                                <option value="in_progress">In Progress (Quotation / Fabric Sample Sent)</option>
                                <option value="resolved">Resolved / Dispatched / Closed</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Internal Factory Follow-up Notes
                            </label>
                            <textarea 
                                value={note} 
                                onChange={e => setNote(e.target.value)} 
                                rows={4}
                                placeholder="Add quotation rate, swatch dispatch tracking number, school coordinator details, transport bilti note..."
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }}
                            />
                        </div>

                        <button 
                            className="admin-primary" 
                            onClick={save}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', fontSize: '14px', fontWeight: '700' }}
                        >
                            <Save size={16} /> Save Client Record & Phone
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
