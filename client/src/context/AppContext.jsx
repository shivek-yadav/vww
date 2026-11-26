import { createContext, useContext, useEffect, useState } from 'react';
import { api, initialSettings } from '../api';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

const getStoredCart = () => {
    try {
        return JSON.parse(localStorage.getItem('dakshayani_cart')) || [];
    } catch {
        return [];
    }
};

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [settings, setSettings] = useState(initialSettings);
    const [cart, setCart] = useState(getStoredCart);
    const [coupon, setCoupon] = useState(null); // { code, discountPercent, discountAmount }

    // Check existing session
    useEffect(() => {
        let active = true;
        const checkAuth = async () => {
            const token = localStorage.getItem('dakshayani_token');
            try {
                // Try customer auth first
                const res = await api.get('/auth/me');
                if (active && res.data.user) {
                    setUser(res.data.user);
                    return;
                }
            } catch {
                // If customer failed, try admin auth
                try {
                    const adm = await api.get('/admin/auth/me');
                    if (active && adm.data.user) {
                        setUser(adm.data.user);
                        return;
                    }
                } catch {
                    if (active) setUser(null);
                }
            } finally {
                if (active) setAuthLoading(false);
            }
        };

        checkAuth();

        // Load public store settings
        api.get('/settings/public')
            .then(r => {
                if (active && r.data.data) {
                    setSettings(x => ({ ...x, ...r.data.data }));
                }
            })
            .catch(() => {});

        return () => { active = false; };
    }, []);

    // Sync cart to storage
    useEffect(() => {
        localStorage.setItem('dakshayani_cart', JSON.stringify(cart));
    }, [cart]);

    const addCart = (item, sizeBreakdown = null, totalQuantity = null, customization = null) => {
        if (!item.available) {
            toast.error('This product is currently out of production / unavailable');
            return;
        }

        const piecesToAdd = totalQuantity !== null 
            ? totalQuantity 
            : (sizeBreakdown ? Object.values(sizeBreakdown).reduce((a, b) => a + (Number(b) || 0), 0) : 1);

        const cartItemId = sizeBreakdown 
            ? `${item._id}_${Object.entries(sizeBreakdown).filter(([_, q]) => q > 0).map(([s, q]) => `${s}:${q}`).join('_')}_${customization?.color || 'std'}_${customization?.withEmbroidery ? 'emb' : 'plain'}`
            : (item._id || item.id);

        setCart(c => {
            const old = c.find(x => (x.cartItemId === cartItemId) || (!sizeBreakdown && (x.id === item._id || x.cartItemId === item._id)));
            if (old) {
                return c.map(x => ((x.cartItemId === cartItemId) || (!sizeBreakdown && (x.id === item._id || x.cartItemId === item._id)))
                    ? { ...x, quantity: x.quantity + piecesToAdd }
                    : x
                );
            }
            return [...c, {
                cartItemId,
                id: item._id || item.id,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: piecesToAdd,
                sizeBreakdown: sizeBreakdown || null,
                customization: customization || null,
                moq: item.prepMinutes || 50,
                categoryName: item.category?.name || 'Uniform'
            }];
        });
    };

    const changeQty = (cartItemIdOrId, quantity) => {
        setCart(c => quantity <= 0 
            ? c.filter(x => x.cartItemId !== cartItemIdOrId && x.id !== cartItemIdOrId)
            : c.map(x => (x.cartItemId === cartItemIdOrId || x.id === cartItemIdOrId)
                ? { ...x, quantity: Math.min(50000, quantity) }
                : x
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        setCoupon(null);
    };

    const login = async (data, isAdmin = false) => {
        const endpoint = isAdmin ? '/admin/auth/login' : '/auth/login';
        const result = await api.post(endpoint, data);
        if (result.data.token) {
            localStorage.setItem('dakshayani_token', result.data.token);
        }
        setUser(result.data.user);
        return result.data.user;
    };

    const register = async (data) => {
        const result = await api.post('/auth/register', data);
        if (result.data.token) {
            localStorage.setItem('dakshayani_token', result.data.token);
        }
        setUser(result.data.user);
        return result.data.user;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout').catch(() => {});
        } finally {
            localStorage.removeItem('dakshayani_token');
            setUser(null);
            toast.success('Signed out successfully');
        }
    };

    const cartCount = cart.reduce((a, x) => a + x.quantity, 0);
    const cartSubtotal = cart.reduce((a, x) => a + x.price * x.quantity, 0);

    const applyCoupon = async (code) => {
        if (!code || !code.trim()) {
            toast.error('Please enter a coupon code');
            return false;
        }
        const clean = code.trim().toUpperCase();
        try {
            const res = await api.get(`/coupons/validate?code=${encodeURIComponent(clean)}`);
            const c = res.data;
            const discountPercent = Number(c.discountPercent || 10);
            const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
            setCoupon({ code: clean, discountPercent, discountAmount, description: c.description });
            toast.success(`Coupon applied! ${discountPercent}% discount saved.`);
            return true;
        } catch (e) {
            if (settings.promoCode && clean === settings.promoCode.trim().toUpperCase()) {
                const discountPercent = Number(settings.promoDiscount || 10);
                const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
                setCoupon({ code: clean, discountPercent, discountAmount });
                toast.success(`Coupon applied! ${discountPercent}% discount saved.`);
                return true;
            }
            toast.error(e.message || 'Invalid or expired coupon code');
            return false;
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
        toast('Coupon removed');
    };

    // Calculate live coupon discount if cart changes
    const discountAmount = coupon ? Math.round((cartSubtotal * coupon.discountPercent) / 100) : 0;
    const cartTotal = Math.max(0, cartSubtotal - discountAmount);

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                authLoading,
                settings,
                setSettings,
                cart,
                addCart,
                changeQty,
                clearCart,
                cartCount,
                cartSubtotal,
                cartTotal,
                coupon,
                discountAmount,
                applyCoupon,
                removeCoupon,
                login,
                register,
                logout
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
