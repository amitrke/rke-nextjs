import type { NextApiRequest, NextApiResponse } from 'next';
import { adminGetDocument, getIsAdmin, verifyIdToken } from '../../firebase/firebaseAdmin';
import { PostType } from '../../firebase/types';
import { postPaths, revalidatePaths } from '../../lib/revalidatePost';

// Refreshes the cached (ISR) pages for a post right after it is saved, so edits
// show up on the live site immediately. Only the post's author or an admin may
// trigger it.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { postId, previousPath } = req.body as { postId?: string; previousPath?: string };
    if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'Invalid request' });
    }
    // Only accept an old post URL (after a title or category change), never an arbitrary path.
    const extraPaths = typeof previousPath === 'string' && /^\/post\/[a-z0-9-]+\/[a-z0-9-]+$/.test(previousPath)
        ? [previousPath]
        : [];

    try {
        const decoded = await verifyIdToken(authHeader.substring(7));
        const post = await adminGetDocument<PostType>('posts', postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.userId !== decoded.uid && !(await getIsAdmin(decoded.uid))) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const failed = await revalidatePaths(res, postPaths({ ...post, id: postId }, extraPaths));
        return res.status(200).json({ revalidated: true, failed });
    } catch (error: unknown) {
        const err = error as { code?: string };
        if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        console.error('revalidatePost error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
