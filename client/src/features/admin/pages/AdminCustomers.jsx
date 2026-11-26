import { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, prettyDate } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, AdminTable } from '../components/AdminShared';

export function AdminCustomers() {
    const { data, loading, error, reload } = useFetch('/admin/customers');
    const [search, setSearch] = useState('');

    const change = async (x) => {
        if (!window.confirm(`${x.status === 'active' ? 'Deactivate' : 'Activate'} account for ${x.name}?`))
            return;
        try {
            await api.patch(`/admin/customers/${x._id}/status`, { status: x.status === 'active' ? 'blocked' : 'active' });
            toast.success('Client account status updated');
            reload();
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <>
            <AdminHeading
                title="Client & Institution Directory"
                subtitle="Registered schools, institutional procurement coordinators, corporate buyers, and wholesale partners."
            />
            <Card
                title={`Registered Clients (${data.length})`}
                action={
                    <label className="admin-search">
                        <Search size={17} />
                        <input
                            placeholder="Search client name, school, email, phone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </label>
                }
            >
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Empty text={error} />
                ) : (
                    <AdminTable
                        rows={data.filter(x => `${x.name} ${x.email} ${x.phone || ''}`.toLowerCase().includes(search.toLowerCase()))}
                        columns={[
                            { label: 'Client / Coordinator', render: x => <strong>{x.name}</strong> },
                            { key: 'email', label: 'Email Address' },
                            { key: 'phone', label: 'Phone Number' },
                            { label: 'Registered Date', render: x => prettyDate(x.createdAt) },
                            { label: 'Status', render: x => <Status value={x.status} /> },
                            {
                                label: 'Actions',
                                render: x => (
                                    <button className="admin-outline-small" onClick={() => change(x)}>
                                        {x.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                )
                            }
                        ]}
                    />
                )}
            </Card>
        </>
    );
}
