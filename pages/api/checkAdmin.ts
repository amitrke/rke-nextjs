import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken, getIsAdmin } from '../../firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ isAdmin: false });
    }

    try {
        const token = authHeader.substring(7);
        const decoded = await verifyIdToken(token);
        const isAdmin = await getIsAdmin(decoded.uid);
        return res.status(200).json({ isAdmin });
    } catch (err) {
        console.error('[checkAdmin] Error:', err);
        return res.status(200).json({ isAdmin: false });
    }
}
