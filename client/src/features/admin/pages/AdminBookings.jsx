import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, AdminTable, text, Modal } from '../components/AdminShared';

export function AdminBookings() {
    const { data, loading, error, reload } = useFetch('/admin/bookings'), [filter, setFilter] = useState('all'), [selected, setSelected] = useState(null), [note, setNote] = useState(''), [busy, setBusy] = useState(false);
    const shown = data.filter(x => filter === 'all' || x.status === filter);
    const allowed = { pending: ['confirmed', 'rejected', 'cancelled'], confirmed: ['completed', 'cancelled'], rejected: [], cancelled: [], completed: [] };
    const change = async (status) => {
        setBusy(true);
        try {
            await api.patch(`/admin/bookings/${selected._id}/status`, { status, adminNote: note });
            toast.success('Sample request updated');
            setSelected(null);
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return (
        <>
            <AdminHeading title="Sample Requests & Quotes" subtitle="Review incoming knitwear swatch and sample dispatch requests for schools & institutions."/>
            <Card title={`Sample Requests (${shown.length})`} action={<select className="admin-filter" value={filter} onChange={e => setFilter(e.target.value)}>{['all', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed'].map(x => <option key={x} value={x}>{x === 'all' ? 'All Sample Requests' : x}</option>)}</select>}>
                {loading ? <Loading /> : error ? <Empty text={error}/> : (
                    <AdminTable rows={shown} columns={[
                        { label: 'Client / Institution', render: x => <div><strong>{x.name}</strong><small className="table-sub">{x.occasion || x.phone}</small></div> },
                        { label: 'Request Date', render: x => <strong>{x.date}</strong> },
                        { key: 'guests', label: 'Sample Qty' },
                        { label: 'Dispatch Address / Notes', render: x => <span className="table-truncate">{x.notes || x.time || '—'}</span> },
                        { label: 'Status', render: x => <Status value={x.status}/> },
                        { label: 'Actions', render: x => <button className="admin-outline-small" onClick={() => { setSelected(x); setNote(x.adminNote || ''); }}>Review Dispatch</button> }
                    ]}/>
                )}
            </Card>
            {selected && (
                <Modal title={`Sample Request #${selected.bookingNumber}`} onClose={() => setSelected(null)}>
                    <div className="order-detail">
                        <p><strong>Client:</strong> {selected.name}</p>
                        <p><strong>Institution / Reference:</strong> {selected.occasion || 'Direct Client'}</p>
                        <p><strong>Contact:</strong> {selected.email} · {selected.phone}</p>
                        <p><strong>Requested Date:</strong> {selected.date}</p>
                        <p><strong>Sample Quantity:</strong> {selected.guests} pcs</p>
                        {selected.notes && <p><strong>Specifications / Address:</strong> {selected.notes}</p>}
                        <label className="form-stack">Factory Dispatch Note / Courier Tracking<textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Dispatched via DTDC tracking #12345678"/></label>
                        <div className="modal-actions wrap">
                            {allowed[selected.status]?.map(s => (
                                <button disabled={busy} className={s === 'confirmed' || s === 'completed' ? 'admin-primary' : 'admin-secondary'} key={s} onClick={() => change(s)}>
                                    {s === 'confirmed' ? 'Approve & Prepare Sample' : s === 'completed' ? 'Mark Sample Dispatched' : s === 'rejected' ? 'Reject Request' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
