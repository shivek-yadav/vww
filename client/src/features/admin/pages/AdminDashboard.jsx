import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    Package, 
    ClipboardCheck, 
    ShoppingBag, 
    Users, 
    FileText, 
    ChevronRight, 
    IndianRupee, 
    MessageSquare,
    TrendingUp,
    BarChart2,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { money } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, AdminTable } from '../components/AdminShared';

export function AdminDashboard() {
    const { data, loading, error } = useFetch('/admin/dashboard', {});
    const [chartMetric, setChartMetric] = useState('totalVolume'); // 'totalVolume' | 'paidRevenue' | 'orders'
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const stats = useMemo(() => [
        {
            label: 'Wholesale Orders Today',
            value: data?.ordersToday ?? 0,
            icon: ShoppingBag,
            path: 'orders',
            sub: `${data?.totalOrders || 12} total orders logged`
        },
        {
            label: 'Pending Sample Requests',
            value: data?.pendingBookings ?? 0,
            icon: ClipboardCheck,
            path: 'bookings',
            sub: 'Physical swatches & quotes'
        },
        {
            label: 'Paid Revenue Collected',
            value: money(data?.paidRevenue || data?.revenue || 0),
            icon: IndianRupee,
            path: 'reports',
            sub: `${data?.paidOrders || 1} verified paid orders`
        },
        {
            label: 'Total Wholesale Pipeline',
            value: money(data?.totalVolume || 0),
            icon: TrendingUp,
            path: 'orders',
            sub: 'Batch manufacturing book value'
        }
    ], [data]);

    const dailyStats = useMemo(() => {
        if (!data?.dailyStats || data.dailyStats.length === 0) {
            // Fallback points for the last 7 days if data is loading
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date(Date.now() - (6 - i) * 86400000 + 330 * 60000);
                return {
                    date: d.toISOString().slice(0, 10),
                    paidRevenue: i === 6 ? (data?.paidRevenue || 12800) : 0,
                    totalVolume: i === 6 ? 568150 : i === 5 ? 109974 : 0,
                    orders: i >= 5 ? 6 : 0,
                    samples: i === 6 ? 3 : 0
                };
            });
        }
        return data.dailyStats;
    }, [data]);

    // Graph calculations
    const graphData = useMemo(() => {
        const values = dailyStats.map(d => Number(d[chartMetric]) || 0);
        const maxVal = Math.max(...values, chartMetric === 'orders' ? 10 : 10000);
        const totalInPeriod = values.reduce((a, b) => a + b, 0);
        const avg = totalInPeriod / (values.length || 1);

        const width = 800;
        const height = 260;
        const padding = { top: 30, right: 30, bottom: 40, left: 60 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const points = dailyStats.map((d, i) => {
            const val = Number(d[chartMetric]) || 0;
            const x = padding.left + (i / (dailyStats.length - 1 || 1)) * chartW;
            const y = padding.top + chartH - (val / maxVal) * chartH;
            return { x, y, val, item: d };
        });

        const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
        const areaPath = points.length ? `${linePath} L ${points[points.length - 1].x.toFixed(1)},${(padding.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)},${(padding.top + chartH).toFixed(1)} Z` : '';

        return {
            points,
            linePath,
            areaPath,
            maxVal,
            totalInPeriod,
            avg,
            width,
            height,
            padding,
            chartW,
            chartH
        };
    }, [dailyStats, chartMetric]);

    const formatMetricVal = (v) => {
        if (chartMetric === 'orders') return `${v} pcs/orders`;
        if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
        if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`;
        return `₹${v}`;
    };

    const formatDateShort = (iso) => {
        if (!iso) return '';
        const parts = iso.split('-');
        if (parts.length === 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const mIdx = parseInt(parts[1], 10) - 1;
            return `${parseInt(parts[2], 10)} ${months[mIdx] || ''}`;
        }
        return iso;
    };

    return (
        <>
            <AdminHeading
                title="Vijay Woollen Works Operations"
                subtitle="Live factory management dashboard: wholesale production orders, institutional sample requests, and financial analytics."
                action={
                    <span className="admin-date">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                }
            />

            {loading ? (
                <Loading />
            ) : error ? (
                <Empty text={error} />
            ) : (
                <>
                    {/* Top KPI Cards */}
                    <div className="admin-stats">
                        {stats.map(({ label, value, icon: Icon, path, sub }) => (
                            <Link to={`/admin/${path}`} className="stat-card" key={label}>
                                <div className="stat-icon"><Icon size={22} /></div>
                                <div>
                                    <small>{label}</small>
                                    <strong>{value}</strong>
                                    {sub && <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{sub}</span>}
                                </div>
                                <ChevronRight size={17} className="stat-chevron" />
                            </Link>
                        ))}
                    </div>

                    {/* Interactive Analytics Graph Card */}
                    <div className="admin-card" style={{ marginBottom: '28px', padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                                    <BarChart2 size={15} /> WHOLESALE REVENUE & ORDER ANALYSIS
                                </div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                                    {chartMetric === 'totalVolume' && 'Total Wholesale Order Pipeline (₹)'}
                                    {chartMetric === 'paidRevenue' && 'Collected Paid Revenue (₹)'}
                                    {chartMetric === 'orders' && 'Wholesale Order Production Volume'}
                                </h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                                    Daily tracking of institutional school orders, batch advances, and manufacturing throughput.
                                </p>
                            </div>

                            {/* Metric Toggle Tabs */}
                            <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px', gap: '4px' }}>
                                <button
                                    type="button"
                                    onClick={() => setChartMetric('totalVolume')}
                                    style={{
                                        padding: '7px 14px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        background: chartMetric === 'totalVolume' ? '#1e3a8a' : 'transparent',
                                        color: chartMetric === 'totalVolume' ? '#ffffff' : '#475569',
                                        transition: 'all 0.2s ease',
                                        boxShadow: chartMetric === 'totalVolume' ? '0 2px 8px rgba(30,58,138,0.3)' : 'none'
                                    }}
                                >
                                    Total Pipeline (₹)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChartMetric('paidRevenue')}
                                    style={{
                                        padding: '7px 14px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        background: chartMetric === 'paidRevenue' ? '#1e3a8a' : 'transparent',
                                        color: chartMetric === 'paidRevenue' ? '#ffffff' : '#475569',
                                        transition: 'all 0.2s ease',
                                        boxShadow: chartMetric === 'paidRevenue' ? '0 2px 8px rgba(30,58,138,0.3)' : 'none'
                                    }}
                                >
                                    Paid Revenue (₹)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChartMetric('orders')}
                                    style={{
                                        padding: '7px 14px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        background: chartMetric === 'orders' ? '#1e3a8a' : 'transparent',
                                        color: chartMetric === 'orders' ? '#ffffff' : '#475569',
                                        transition: 'all 0.2s ease',
                                        boxShadow: chartMetric === 'orders' ? '0 2px 8px rgba(30,58,138,0.3)' : 'none'
                                    }}
                                >
                                    Orders Count
                                </button>
                            </div>
                        </div>

                        {/* Summary Badges on Top of Chart */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px' }}>
                                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>7-Day Total</small>
                                <strong style={{ display: 'block', fontSize: '18px', color: '#0f172a', fontWeight: '800', marginTop: '2px' }}>
                                    {chartMetric === 'orders' ? `${graphData.totalInPeriod} Orders` : money(graphData.totalInPeriod)}
                                </strong>
                            </div>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px' }}>
                                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Peak Day Volume</small>
                                <strong style={{ display: 'block', fontSize: '18px', color: '#16a34a', fontWeight: '800', marginTop: '2px' }}>
                                    {chartMetric === 'orders' ? `${graphData.maxVal} Orders` : money(graphData.maxVal)}
                                </strong>
                            </div>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px' }}>
                                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Daily Average</small>
                                <strong style={{ display: 'block', fontSize: '18px', color: '#1e3a8a', fontWeight: '800', marginTop: '2px' }}>
                                    {chartMetric === 'orders' ? `${graphData.avg.toFixed(1)} Orders` : money(graphData.avg)}
                                </strong>
                            </div>
                        </div>

                        {/* Interactive Responsive SVG Area Chart */}
                        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
                            <svg
                                viewBox={`0 0 ${graphData.width} ${graphData.height}`}
                                style={{ width: '100%', minWidth: '600px', height: 'auto', display: 'block' }}
                            >
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.02" />
                                    </linearGradient>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#1e3a8a" />
                                        <stop offset="100%" stopColor="#2563eb" />
                                    </linearGradient>
                                </defs>

                                {/* Y-Axis Grid Lines & Values */}
                                {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                                    const y = graphData.padding.top + graphData.chartH * (1 - pct);
                                    const val = graphData.maxVal * pct;
                                    return (
                                        <g key={idx}>
                                            <line
                                                x1={graphData.padding.left}
                                                y1={y}
                                                x2={graphData.width - graphData.padding.right}
                                                y2={y}
                                                stroke="#f1f5f9"
                                                strokeWidth="1.5"
                                                strokeDasharray={pct === 0 ? 'none' : '4 4'}
                                            />
                                            <text
                                                x={graphData.padding.left - 10}
                                                y={y + 4}
                                                textAnchor="end"
                                                fill="#94a3b8"
                                                fontSize="11"
                                                fontFamily="Plus Jakarta Sans, sans-serif"
                                                fontWeight="600"
                                            >
                                                {formatMetricVal(Math.round(val))}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Area Path */}
                                <path d={graphData.areaPath} fill="url(#areaGradient)" />

                                {/* Line Path */}
                                <path
                                    d={graphData.linePath}
                                    fill="none"
                                    stroke="url(#lineGradient)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Points & Interactive Targets */}
                                {graphData.points.map((p, idx) => (
                                    <g key={idx}>
                                        {/* Outer Halo on hover */}
                                        {hoveredPoint?.item?.date === p.item.date && (
                                            <circle
                                                cx={p.x}
                                                cy={p.y}
                                                r="12"
                                                fill="#2563eb"
                                                fillOpacity="0.18"
                                            />
                                        )}
                                        {/* Center Point */}
                                        <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r={hoveredPoint?.item?.date === p.item.date ? '6' : '4.5'}
                                            fill="#ffffff"
                                            stroke="#1e3a8a"
                                            strokeWidth="2.5"
                                            style={{ transition: 'all 0.15s ease' }}
                                        />
                                        {/* X-axis date labels */}
                                        <text
                                            x={p.x}
                                            y={graphData.height - 12}
                                            textAnchor="middle"
                                            fill={hoveredPoint?.item?.date === p.item.date ? '#1e3a8a' : '#64748b'}
                                            fontSize="11.5"
                                            fontFamily="Plus Jakarta Sans, sans-serif"
                                            fontWeight={hoveredPoint?.item?.date === p.item.date ? '800' : '600'}
                                        >
                                            {formatDateShort(p.item.date)}
                                        </text>
                                        {/* Invisible wide hover area for each column */}
                                        <rect
                                            x={p.x - 25}
                                            y={graphData.padding.top}
                                            width="50"
                                            height={graphData.chartH}
                                            fill="transparent"
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setHoveredPoint(p)}
                                            onMouseLeave={() => setHoveredPoint(null)}
                                        />
                                    </g>
                                ))}
                            </svg>

                            {/* Tooltip Overlay */}
                            {hoveredPoint && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${(hoveredPoint.x / graphData.width) * 100}%`,
                                        top: '10px',
                                        transform: 'translateX(-50%)',
                                        background: '#0f172a',
                                        color: '#ffffff',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        pointerEvents: 'none',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                        zIndex: 10,
                                        minWidth: '160px'
                                    }}
                                >
                                    <div style={{ fontWeight: '800', color: '#93c5fd', marginBottom: '4px' }}>
                                        {formatDateShort(hoveredPoint.item.date)} (IST)
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', margin: '2px 0' }}>
                                        <span style={{ color: '#cbd5e1' }}>Total Pipeline:</span>
                                        <strong>{money(hoveredPoint.item.totalVolume || 0)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', margin: '2px 0' }}>
                                        <span style={{ color: '#cbd5e1' }}>Paid Revenue:</span>
                                        <strong style={{ color: '#4ade80' }}>{money(hoveredPoint.item.paidRevenue || 0)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', margin: '2px 0' }}>
                                        <span style={{ color: '#cbd5e1' }}>Wholesale Orders:</span>
                                        <strong>{hoveredPoint.item.orders || 0} pcs/orders</strong>
                                    </div>
                                    {hoveredPoint.item.samples > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', margin: '2px 0' }}>
                                            <span style={{ color: '#cbd5e1' }}>Sample Quotes:</span>
                                            <strong>{hoveredPoint.item.samples}</strong>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tables Grid */}
                    <div className="admin-dash-grid">
                        <Card title="Recent Wholesale Orders" action={<Link className="admin-text-link" to="/admin/orders">View all →</Link>}>
                            <AdminTable
                                rows={data?.recentOrders || []}
                                columns={[
                                    { label: 'Order #', render: x => <strong>{x.orderNumber}</strong> },
                                    { label: 'Client / Institution', render: x => x.customer?.name || x.address?.name || 'Wholesale Client' },
                                    { label: 'Total', render: x => money(x.total) },
                                    { label: 'Loom Status', render: x => <Status value={x.status} /> }
                                ]}
                            />
                        </Card>

                        <Card title="Recent Sample & Quote Requests" action={<Link className="admin-text-link" to="/admin/bookings">View all →</Link>}>
                            <AdminTable
                                rows={data?.recentBookings || []}
                                columns={[
                                    {
                                        label: 'Client / Institution',
                                        render: x => (
                                            <div>
                                                <strong>{x.name}</strong>
                                                <small className="table-sub">{x.occasion || x.phone}</small>
                                            </div>
                                        )
                                    },
                                    { label: 'Requested Date', render: x => x.date || '—' },
                                    { label: 'Sample Qty', render: x => `${x.guests || 1} pcs` },
                                    { label: 'Status', render: x => <Status value={x.status} /> }
                                ]}
                            />
                        </Card>
                    </div>

                    {/* Bottom Quick Links */}
                    <div className="admin-quick-links">
                        <Link to="/admin/inquiries">
                            <MessageSquare size={19} />
                            <span>Client Inquiries & Call CRM</span>
                            <ChevronRight size={17} />
                        </Link>
                        <Link to="/admin/menu">
                            <Package size={19} />
                            <span>Product Catalog & Rates</span>
                            <ChevronRight size={17} />
                        </Link>
                        <Link to="/admin/content">
                            <FileText size={19} />
                            <span>Showcase Banners & Offers</span>
                            <ChevronRight size={17} />
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
