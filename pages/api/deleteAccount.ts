import type { NextApiRequest, NextApiResponse } from 'next';
import initApp, { verifyIdToken } from '../../firebase/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

type ErrorResponse = {
  error: string;
  code?: string;
};

type SuccessResponse = {
  success: true;
  deletedUid: string;
};

const RECENT_LOGIN_WINDOW_SECONDS = 5 * 60;
const BATCH_DELETE_LIMIT = 450;

const requireBearerToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

const isRecentLogin = (authTimeSeconds?: number): boolean => {
  if (!authTimeSeconds) {
    return false;
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds - authTimeSeconds <= RECENT_LOGIN_WINDOW_SECONDS;
};

const deleteDocumentsByQuery = async (query: Query): Promise<number> => {
  let totalDeleted = 0;
  while (true) {
    const snapshot = await query.limit(BATCH_DELETE_LIMIT).get();
    if (snapshot.empty) {
      break;
    }

    const batch = query.firestore.batch();
    snapshot.docs.forEach((docRef: QueryDocumentSnapshot) => {
      batch.delete(docRef.ref);
    });
    await batch.commit();
    totalDeleted += snapshot.size;

    if (snapshot.size < BATCH_DELETE_LIMIT) {
      break;
    }
  }
  return totalDeleted;
};

const cleanupUserData = async (uid: string): Promise<void> => {
  initApp();
  const db = getFirestore();

  await Promise.all([
    deleteDocumentsByQuery(db.collection('posts').where('userId', '==', uid)),
    deleteDocumentsByQuery(db.collection('albums').where('userId', '==', uid)),
    deleteDocumentsByQuery(db.collection('notifications').where('userId', '==', uid)),
    deleteDocumentsByQuery(db.collection('moderationQueue').where('userId', '==', uid)),
    deleteDocumentsByQuery(db.collection('messages').where('fromUserId', '==', uid)),
  ]);

  await Promise.allSettled([
    db.doc(`users/${uid}`).delete(),
    db.doc(`admins/${uid}`).delete(),
  ]);

  try {
    const bucket = getStorage().bucket();
    await bucket.deleteFiles({ prefix: `users/${uid}/` });
  } catch (error) {
    console.error('[deleteAccount] Storage cleanup warning:', error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = requireBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = await verifyIdToken(token);
    const uid = decoded.uid;

    if (!isRecentLogin(decoded.auth_time)) {
      return res.status(401).json({
        error: 'Recent login required. Please re-authenticate and try again.',
        code: 'recent-login-required',
      });
    }

    await cleanupUserData(uid);

    const auth = getAuth();
    await auth.revokeRefreshTokens(uid);
    await auth.deleteUser(uid);

    return res.status(200).json({ success: true, deletedUid: uid });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.error('[deleteAccount] error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
