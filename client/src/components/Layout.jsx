import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    Phone, Mail, MapPin, Instagram, Facebook, Menu as MenuIcon, X,
    ShoppingBag, UserRound, ArrowRight, Clock, Heart, LogOut, Sparkles,
    ShieldCheck, CalendarDays, Award, MessageCircle, FileText, Factory,
    ChevronRight, Building2, Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Header() {
    const { settings, cartCount, user, logout } = useApp();
    const [mobile, setMobile] = useState(false);
    const [account, setAccount] = useState(false);
    const popRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setMobile(false);
        setAccount(false);
    }, [location]);

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (mobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobile]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (popRef.current && !popRef.current.contains(e.target)) {
                setAccount(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const links = [
        { to: '/', label: 'Home' },
        { to: '/menu', label: 'Product Catalog' },
        { to: '/booking', label: 'Bulk Quotation' },
        { to: '/about', label: 'About Factory' },
        { to: '/gallery', label: 'Showcase' },
        { to: '/contact', label: 'Contact & Orders' }
    ];

    const phoneNumber = settings.phone || '+91 84272 57106';
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');

    return (
        <>
            {/* Dynamic Announcement Bar configured by Admin */}
            {settings.announcementEnabled && settings.announcement && (
                <div className="announcement-bar" style={{ background: '#0f172a', color: '#f8fafc', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                    <div className="container announcement-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                        <span className="announcement-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                            <Sparkles size={14} className="announcement-sparkle" style={{ color: '#f59e0b' }} />
                            {settings.announcement}
                        </span>
                    </div>
                </div>
            )}

            {/* Topbar */}
            <div className="topbar" style={{ background: '#1e3a8a', color: '#ffffff', fontSize: '12px', padding: '6px 0' }}>
                <div className="container topbar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} style={{ color: '#fbbf24' }} />
                            Ludhiana, Punjab · India's Knitwear Hub
                        </span>
                        <span className="desktop-only-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Award size={13} style={{ color: '#fbbf24' }} />
                            GST: 03AWNPV3468J1ZX · MSME Registered
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <a href="https://wa.me/918427257106?text=Hi%20Vijay%20Woollen%20Works,%20I%20would%20like%20to%20inquire%20about%20bulk%20uniform%20rates." target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#ffffff' }}>
                            <MessageCircle size={13} style={{ color: '#22c55e' }} />
                            WhatsApp: +91 84272 57106
                        </a>
                        <a href={`tel:${cleanPhone}`} className="topbar-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#ffffff', fontWeight: '600' }}>
                            <Phone size={13} style={{ color: '#fbbf24' }} />
                            Call: {phoneNumber}
                        </a>
                    </div>
                </div>
            </div>

            {/* Site Header */}
            <header className="site-header" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="container nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                    <Link to="/" className="brand" aria-label="Vijay Woollen Works Home" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <img 
                            src="/vww/branding/Vijay Woollen Works Logo.png" 
                            alt="Vijay Woollen Works" 
                            style={{ height: '44px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="brand-copy" style={{ minWidth: 0 }}>
                            <strong style={{ fontSize: '17px', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                VIJAY WOOLLEN WORKS
                            </strong>
                            <small className="brand-tagline" style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: '700', letterSpacing: '0.04em' }}>
                                UNIFORMS & WINTER KNITWEAR MANUFACTURER
                            </small>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="main-nav desktop-nav" aria-label="Main navigation">
                        {links.map(({ to, label }) => (
                            <NavLink to={to} key={to} end={to === '/'}>
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Actions Right */}
                    <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <Link to="/cart" className="nav-icon cart-icon" aria-label="Quotations Cart" title="View Quote Items">
                            <ShoppingBag size={21} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>

                        {/* Account Menu Popover */}
                        <div className="account-pop" ref={popRef}>
                            <button
                                className={`nav-icon ${user ? 'has-user' : ''}`}
                                onClick={() => user ? setAccount(!account) : navigate('/login')}
                                aria-label="Account menu"
                                title={user ? user.name : 'Sign In'}
                                style={{ border: 'none', background: 'none', padding: user ? '2px' : '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {user ? (
                                    <span style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        boxShadow: '0 2px 6px rgba(30,58,138,0.25)',
                                        border: '1.5px solid #ffffff'
                                    }}>
                                        {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                                    </span>
                                ) : (
                                    <UserRound size={21} />
                                )}
                            </button>

                            {user && account && (
                                <div className="account-dropdown">
                                    <div className="dropdown-head" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                                            color: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            fontWeight: '800',
                                            flexShrink: 0
                                        }}>
                                            {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                            <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</strong>
                                            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</small>
                                            <span className={`badge-role badge-${user.role}`}>{user.role}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    {user.role === 'customer' && (
                                        <>
                                            <Link to="/account" onClick={() => setAccount(false)}>
                                                <UserRound size={15} /> My Profile & Institution
                                            </Link>
                                            <Link to="/account/orders" onClick={() => setAccount(false)}>
                                                <ShoppingBag size={15} /> Wholesale Orders
                                            </Link>
                                            <Link to="/account/bookings" onClick={() => setAccount(false)}>
                                                <CalendarDays size={15} /> Sample Requests
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setAccount(false)}>
                                            <ShieldCheck size={15} /> Admin Portal
                                        </Link>
                                    )}
                                    <hr />
                                    <button
                                        className="dropdown-logout"
                                        onClick={async () => {
                                            await logout();
                                            setAccount(false);
                                            navigate('/');
                                        }}
                                    >
                                        <LogOut size={14} /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link to="/booking" className="btn btn-nav desktop-quote-btn" style={{ background: '#1e3a8a', color: '#ffffff', padding: '9px 18px', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>
                            Bulk Quote <ArrowRight size={14} />
                        </Link>

                        {/* Mobile Hamburger Button */}
                        <button
                            className="mobile-toggle"
                            onClick={() => setMobile(!mobile)}
                            aria-label="Toggle menu"
                        >
                            {mobile ? <X size={26} /> : <MenuIcon size={26} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Backdrop & Slide-out Menu (Rendered at top-level for clean z-index) */}
            <div 
                className={`drawer-overlay ${mobile ? 'is-open' : ''}`} 
                onClick={() => setMobile(false)} 
                aria-hidden={!mobile}
            />
            <aside className={`mobile-drawer ${mobile ? 'is-open' : ''}`} aria-hidden={!mobile}>
                <div className="drawer-head">
                    <Link to="/" className="brand" onClick={() => setMobile(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/vww/branding/Vijay Woollen Works Logo.png" alt="Vijay Woollen Works" style={{ height: '36px', width: 'auto' }} />
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>VIJAY WOOLLEN WORKS</span>
                    </Link>
                    <button className="drawer-close" onClick={() => setMobile(false)} aria-label="Close menu">
                        <X size={22} />
                    </button>
                </div>

                {/* User quick profile header inside drawer */}
                <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    flexShrink: 0
                                }}>
                                    {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                    <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</strong>
                                    <small style={{ color: '#64748b', fontSize: '11px', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.orgName || user.email}</small>
                                </div>
                            </div>
                            <Link 
                                to="/account" 
                                onClick={() => setMobile(false)} 
                                style={{ fontSize: '11px', background: '#e0e7ff', color: '#1e3a8a', padding: '5px 12px', borderRadius: '20px', fontWeight: '700', flexShrink: 0 }}
                            >
                                Portal →
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link 
                                to="/login" 
                                onClick={() => setMobile(false)} 
                                style={{ flex: 1, textAlign: 'center', padding: '8px 12px', background: '#1e3a8a', color: '#ffffff', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}
                            >
                                Client Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={() => setMobile(false)} 
                                style={{ flex: 1, textAlign: 'center', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#1e3a8a', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                <nav className="drawer-nav">
                    {links.map(({ to, label }) => (
                        <NavLink to={to} key={to} end={to === '/'} onClick={() => setMobile(false)}>
                            <span>{label}</span>
                            <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                        </NavLink>
                    ))}
                    {user && (
                        <>
                            <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                            <NavLink to="/account" onClick={() => setMobile(false)}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Building2 size={16} color="#1e3a8a" /> Institution Profile
                                </span>
                                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                            </NavLink>
                            <NavLink to="/account/orders" onClick={() => setMobile(false)}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={16} color="#1e3a8a" /> Wholesale Orders
                                </span>
                                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                            </NavLink>
                            <NavLink to="/account/bookings" onClick={() => setMobile(false)}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} color="#1e3a8a" /> Sample Requests
                                </span>
                                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="drawer-foot">
                    <Link to="/booking" className="btn" style={{ width: '100%', background: '#1e3a8a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }} onClick={() => setMobile(false)}>
                        Request Bulk Quote <ArrowRight size={16} />
                    </Link>
                    <a href={`tel:${cleanPhone}`} className="drawer-phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '700', fontSize: '13px', padding: '6px 0' }}>
                        <Phone size={15} /> Call: {phoneNumber}
                    </a>
                </div>
            </aside>
        </>
    );
}

export function Footer() {
    const { settings } = useApp();
    const phoneNumber = settings.phone || '+91 84272 57106';
    const altPhone = '+91 98729 89024';

    return (
        <footer className="footer" style={{ background: '#0f172a', color: '#cbd5e1', paddingTop: '50px', paddingBottom: '30px' }}>
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <Link to="/" className="footer-logo" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: '800' }}>
                            <img src="/vww/branding/Vijay Woollen Works Logo.png" alt="VWW" style={{ height: '36px', width: 'auto', filter: 'brightness(1.2)' }} />
                            <span>VIJAY WOOLLEN WORKS</span>
                        </Link>
                        <p style={{ marginTop: '12px', fontSize: '13px', lineHeight: '1.6', color: '#94a3b8' }}>
                            India's trusted manufacturer and wholesaler of School Uniforms, Winter Sweaters, College Hoodies, Corporate Uniforms, and Industrial Workwear. Direct factory dispatch from Ludhiana, Punjab.
                        </p>
                        <div style={{ marginTop: '14px', fontSize: '12px', color: '#fbbf24' }}>
                            <strong>GSTIN:</strong> 03AWNPV3468J1ZX · <strong>MSME Udyam:</strong> Certified
                        </div>
                        <div className="footer-social" style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                            <a href="https://www.indiamart.com/vijay-woolen-work-ludhiana/" target="_blank" rel="noreferrer" title="IndiaMART Profile" style={{ color: '#ffffff' }}>
                                <Award size={18} /> IndiaMART
                            </a>
                            <a href="https://www.instagram.com/vijaywoolenwork" target="_blank" rel="noreferrer" title="Instagram" style={{ color: '#ffffff' }}>
                                <Instagram size={18} /> Instagram
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '14px' }}>Product Catalog</h4>
                        <Link to="/menu">School Uniforms & Sweaters</Link>
                        <Link to="/menu">College & Varsity Hoodies</Link>
                        <Link to="/menu">Corporate Blazers & Polos</Link>
                        <Link to="/menu">Industrial Workwear Jackets</Link>
                        <Link to="/menu">Athletic Tracksuits</Link>
                        <Link to="/menu">Uniform Ties & Caps</Link>
                    </div>

                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '14px' }}>Wholesale & Client</h4>
                        <Link to="/booking">Request Bulk Quotation</Link>
                        <Link to="/vww/documents/vww_product list.pdf" target="_blank">Download Product List (PDF)</Link>
                        <Link to="/vww/documents/Udyam_Certificate_One_Page_Portrait_Final.pdf" target="_blank">Udyam MSME Certificate</Link>
                        <Link to="/gallery">Factory & Manufacturing</Link>
                    </div>

                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '14px' }}>Factory & Head Office</h4>
                        <p className="footer-contact" style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                            <MapPin size={17} style={{ color: '#fbbf24', flexShrink: 0 }} />
                            <span>B-V-1209, Purana Bazaar, Buhrampuri, Ludhiana - 141008, Punjab, India</span>
                        </p>
                        <p className="footer-contact" style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                            <Phone size={17} style={{ color: '#fbbf24', flexShrink: 0 }} />
                            <span>{phoneNumber} / {altPhone}</span>
                        </p>
                        <p className="footer-contact" style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                            <Mail size={17} style={{ color: '#fbbf24', flexShrink: 0 }} />
                            <span>vijaywoolenwork@gmail.com</span>
                        </p>
                        <div className="footer-hours" style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
                            <Clock size={14} /> Factory Hours: Mon - Sat: 9:00 AM – 8:00 PM
                        </div>
                    </div>
                </div>

                <div className="footer-bottom" style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', marginTop: '30px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span>© {new Date().getFullYear()} Vijay Woollen Works (VWW). All rights reserved. GST: 03AWNPV3468J1ZX.</span>
                    <span>
                        Ludhiana, Punjab · Textile & Knitwear Manufacturing Capital
                    </span>
                </div>
            </div>
        </footer>
    );
}

export function PublicLayout() {
    return (
        <div className="site-wrapper">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
