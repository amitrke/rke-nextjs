import type { NextApiRequest, NextApiResponse } from 'next';
import initApp, { verifyIdToken } from '../../firebase/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.substring(7);

    const { itemId, itemType } = req.body as { itemId?: string; itemType?: string };
    if (!itemId || !itemType || !['post', 'album'].includes(itemType)) {
        return res.status(400).json({ error: 'Invalid request: itemId and itemType (post|album) required' });
    }

    try {
        const decoded = await verifyIdToken(token);
        const userId = decoded.uid;

        initApp();
        const db = getFirestore();
        const collectionName = itemType === 'post' ? 'posts' : 'albums';

        // Verify item exists and belongs to caller
        const itemSnap = await db.doc(`${collectionName}/${itemId}`).get();
        if (!itemSnap.exists) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const itemData = itemSnap.data();
        if (itemData.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden: item belongs to a different user' });
        }

        // Get author display name
        const userSnap = await db.doc(`users/${userId}`).get();
        const authorName = userSnap.exists ? (userSnap.data().name || 'Unknown') : 'Unknown';

        // Upsert moderationQueue document
        await db.doc(`moderationQueue/${itemId}`).set({
            itemId,
            itemType,
            userId,
            status: 'pending',
            submittedAt: Date.now(),
            reviewedAt: null,
            reviewedBy: null,
            rejectionReason: null,
            title: itemData.title || itemData.name || '',
            authorName,
        });

        // Mark item as not-yet-approved
        await db.doc(`${collectionName}/${itemId}`).update({ approved: false });

        return res.status(200).json({ success: true });
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        console.error('submitForReview error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
