/** Refuse cross-origin cookie-authenticated mutations not made by our website. */
export function trustedOrigin(allowedOrigins) {
    return (req, res, next) => {
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method))
            return next();
        const origin = req.get('origin');
        if (!origin) return next();
        if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))
            return next();
        return res.status(403).json({ message: 'Untrusted origin' });
    };
}
