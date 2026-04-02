import type { NextApiRequest, NextApiResponse } from 'next';
import initApp, { verifyIdToken, getIsAdmin } from '../../firebase/firebaseAdmin';
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

    const { itemId, itemType, action, rejectionReason } = req.body as {
        itemId?: string;
        itemType?: string;
        action?: string;
        rejectionReason?: string;
    };

    if (
        !itemId ||
        !itemType || !['post', 'album'].includes(itemType) ||
        !action || !['approve', 'reject'].includes(action)
    ) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        const decoded = await verifyIdToken(token);
        const adminId = decoded.uid;

        const isAdmin = await getIsAdmin(adminId);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Forbidden: not an admin' });
        }

        initApp();
        const db = getFirestore();
        const collectionName = itemType === 'post' ? 'posts' : 'albums';
        const now = Date.now();

        const queueSnap = await db.doc(`moderationQueue/${itemId}`).get();
        if (!queueSnap.exists) {
            return res.status(404).json({ error: 'Queue item not found' });
        }
        const queueData = queueSnap.data();

        if (action === 'approve') {
            await db.doc(`${collectionName}/${itemId}`).update({ approved: true });
            await db.doc(`moderationQueue/${itemId}`).update({
                status: 'approved',
                reviewedAt: now,
                reviewedBy: adminId,
                rejectionReason: null,
            });
        } else {
            await db.doc(`${collectionName}/${itemId}`).update({ approved: false });
            await db.doc(`moderationQueue/${itemId}`).update({
                status: 'rejected',
                reviewedAt: now,
                reviewedBy: adminId,
                rejectionReason: rejectionReason || null,
            });
        }

        // Write notification for the submitter
        await db.collection('notifications').add({
            userId: queueData.userId,
            type: action === 'approve' ? 'approved' : 'rejected',
            itemId,
            itemTitle: queueData.title,
            itemType,
            rejectionReason: action === 'reject' ? (rejectionReason || null) : null,
            createdAt: now,
            read: false,
        });

        return res.status(200).json({ success: true });
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        console.error('reviewContent error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
