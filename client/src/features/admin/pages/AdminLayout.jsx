import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu as MenuIcon, Home } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { navGroups } from '../components/AdminShared';

export function AdminLayout() {
    const { user, logout } = useApp();
    const [mobile, setMobile] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="admin-shell">
            <div className={`admin-shade ${mobile ? 'show' : ''}`} onClick={() => setMobile(false)} />

            <aside className={`admin-sidebar ${mobile ? 'show' : ''}`}>
                <Link className="admin-brand" to="/admin">
                    <span className="admin-brand-icon">
                        <img
                            src="/vww/branding/Vijay Woollen Works Logo.png"
                            alt="VWW"
                            style={{ height: '30px', width: 'auto' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </span>
                    <span>
                        <strong>VIJAY WOOLLEN WORKS</strong>
                        <small>FACTORY & CRM PORTAL</small>
                    </span>
                </Link>

                <div className="admin-sidebar-scroll">
                    {navGroups.map(group => (
                        <div className="admin-nav-group" key={group.heading}>
                            <small>{group.heading}</small>
                            {group.items.map(([path, label, Icon]) => (
                                <NavLink
                                    key={path}
                                    end={!path}
                                    to={`/admin${path ? `/${path}` : ''}`}
                                    onClick={() => setMobile(false)}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="admin-sidebar-footer">
                    <Link to="/" target="_blank" rel="noopener noreferrer">
                        <Home size={17} /> View Website
                    </Link>
                    <button
                        type="button"
                        onClick={async () => {
                            await logout();
                            navigate('/admin/login');
                        }}
                    >
                        <LogOut size={17} /> Sign Out
                    </button>
                </div>
            </aside>

            <div className="admin-workspace">
                <header className="admin-topbar">
                    <button
                        onClick={() => setMobile(!mobile)}
                        className="admin-mobile-trigger"
                        aria-label="Toggle navigation menu"
                    >
                        <MenuIcon />
                    </button>
                    <span className="admin-topbar-label">
                        Factory Management <span>/</span> Vijay Woollen Works
                    </span>
                    <div className="admin-topbar-right">
                        <span className="admin-live-dot" /> Live factory dashboard
                        <span className="admin-user-avatar">{user?.name?.slice(0, 1) || 'A'}</span>
                        <strong>{user?.name || 'Admin'}</strong>
                    </div>
                </header>
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
