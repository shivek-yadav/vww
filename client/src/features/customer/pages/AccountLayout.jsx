import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { Package, ClipboardList, UserRound, LogOut, Building2, Factory } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PageHero } from '../../../components/UI';

export function AccountLayout() {
    const { user, logout } = useApp();
    const navigate = useNavigate();

    return (
        <>
            <PageHero 
                eyebrow="VIJAY WOOLLEN WORKS CLIENT PORTAL" 
                title="Client Account & Orders" 
                description="Manage your institution profile, track wholesale uniform production, and monitor sample requests."
            />
            <section className="section" style={{ background: '#f8fafc', padding: '40px 0 80px' }}>
                <div className="container account-layout">
                    <aside className="account-sidebar">
                        <div 
                            className="account-user-icon"
                            style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: '800',
                                margin: '0 auto 12px',
                                boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)',
                                border: '3px solid #ffffff'
                            }}
                            title={user.name}
                        >
                            {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '8px 0 2px' }}>
                            {user.name}
                        </h3>
                        {user.orgName && (
                            <span style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                                {user.orgName}
                            </span>
                        )}
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{user.email}</p>

                        <nav style={{ marginTop: '20px' }}>
                            <NavLink end to="/account">
                                <UserRound size={17} /> Profile & Institution
                            </NavLink>
                            <NavLink to="/account/orders">
                                <Package size={17} /> Wholesale Orders
                            </NavLink>
                            <NavLink to="/account/bookings">
                                <ClipboardList size={17} /> Sample Requests & Quotes
                            </NavLink>
                            <button 
                                type="button"
                                onClick={async () => { await logout(); navigate('/'); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: '600' }}
                            >
                                <LogOut size={17} /> Sign Out
                            </button>
                        </nav>
                    </aside>
                    <div className="account-main">
                        <Outlet />
                    </div>
                </div>
            </section>
        </>
    );
}
