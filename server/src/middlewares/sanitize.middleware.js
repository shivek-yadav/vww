/**
 * NoSQL Injection Sanitization Middleware
 * Recursively strips keys starting with '$' or containing '.' from req.body, req.query, and req.params.
 * This neutralizes malicious NoSQL query operators (like $gt, $ne, $where, $regex) sent via user input.
 */

function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    const clean = {};
    for (const key of Object.keys(obj)) {
        // Strip keys starting with $ or containing a period (.)
        if (key.startsWith('$') || key.includes('.')) {
            continue;
        }
        clean[key] = sanitizeObject(obj[key]);
    }
    return clean;
}

export function sanitizeInputs(req, res, next) {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
}
