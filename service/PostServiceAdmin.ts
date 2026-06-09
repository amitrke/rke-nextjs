import type { PostType, User, PostDisplayType } from '../firebase/types';
import type { AlbumType } from '../pages/account/editAlbum';
import type { Event, NewsArticle } from './PostService';
import { getAdminFirestore } from '../firebase/firebaseAdmin';
import { getImageBucketUrl } from '../components/ui/imageUtils';
import type { ImageSize } from '../components/ui/imageUtils';
import { uiDateFormat } from '../components/ui/uiUtils';

// Title dedup utilities — mirrors PostService.ts (pure functions, no SDK deps)
const STOP_WORDS = new Set([
    "the","a","an","to","of","in","on","for","with","and","or","at","from","by","about","after","before","over","under","into","as","is","are","was","were","be","been","being","this","that","these","those","it","its","their","his","her","new","breaking"
]);

function normalizeTitle(raw: string): string {
    if (!raw) return "";
    return raw
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenizeTitle(raw: string): string[] {
    return normalizeTitle(raw).split(" ").filter(t => t && !STOP_WORDS.has(t));
}

function jaccardSimilarity(a: string[], b: string[]): number {
    if (a.length === 0 && b.length === 0) return 1;
    const aSet = new Set(a);
    const bSet = new Set(b);
    let intersection = 0;
    for (const t of aSet) { if (bSet.has(t)) intersection++; }
    const union = aSet.size + bSet.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

function tokenCoverage(a: string[], b: string[]): number {
    if (a.length === 0 || b.length === 0) return 0;
    const aSet = new Set(a);
    const bSet = new Set(b);
    let intersection = 0;
    for (const t of aSet) { if (bSet.has(t)) intersection++; }
    const minLen = Math.min(aSet.size, bSet.size);
    return minLen === 0 ? 0 : intersection / minLen;
}

function areTitlesSimilar(a: string, b: string): boolean {
    const an = normalizeTitle(a);
    const bn = normalizeTitle(b);
    if (!an || !bn) return false;
    if (an === bn) return true;
    const at = tokenizeTitle(a);
    const bt = tokenizeTitle(b);
    if (at.length === 0 || bt.length === 0) return an === bn;
    return jaccardSimilarity(at, bt) >= 0.75 || tokenCoverage(at, bt) >= 0.85;
}

function dedupeBySimilarTitle<T extends { title: string }>(items: T[]): T[] {
    const result: T[] = [];
    for (const item of items) {
        if (!result.some(r => areTitlesSimilar(r.title, item.title))) result.push(item);
    }
    return result;
}

function getImageUrls(items: Array<{ userId: string; images?: string[] }>, size: ImageSize): string[][] {
    return items.map(item => {
        if (!item.images || item.images.length === 0) return [];
        return [getImageBucketUrl(item.images[0], size, item.userId)];
    });
}

export async function getPostsWithDetailsAdmin(
    args: { limit?: number; photoSize?: ImageSize } = { limit: 10, photoSize: 's' }
): Promise<PostDisplayType[]> {
    const db = getAdminFirestore();
    const snapshot = await db.collection('posts')
        .where('public', '==', true)
        .where('approved', '==', true)
        .orderBy('updateDate', 'desc')
        .limit(args.limit ?? 10)
        .get();

    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as PostType) }));

    const userIds = [...new Set(posts.map(p => p.userId))].filter(Boolean);
    const users: User[] = [];
    if (userIds.length > 0) {
        const usersSnap = await db.collection('users').where('id', 'in', userIds).get();
        usersSnap.docs.forEach(doc => users.push({ id: doc.id, ...(doc.data() as User) }));
    }
    const userDict = users.reduce((dict, u) => { dict[u.id] = u; return dict; }, {} as Record<string, User>);

    const imageUrls = getImageUrls(posts, args.photoSize ?? 's');
    return posts.map((post, i) => ({
        ...post,
        images: imageUrls[i],
        formattedUpdateDate: uiDateFormat(post.updateDate),
        author: userDict[post.userId],
    }));
}

export async function getNewsAdmin(
    args: { limit: number; preferredApiSource?: string } = { limit: 8 }
): Promise<NewsArticle[]> {
    const db = getAdminFirestore();
    const snapshot = await db.collection('news')
        .orderBy('expireAt', 'desc')
        .limit(args.limit * 4)
        .get();

    const news = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as NewsArticle) }));
    const deduped = dedupeBySimilarTitle(news);

    const prioritized = args.preferredApiSource
        ? deduped.sort((a, b) => {
            const aRank = a.apiSource === args.preferredApiSource ? 0 : 1;
            const bRank = b.apiSource === args.preferredApiSource ? 0 : 1;
            if (aRank !== bRank) return aRank - bRank;
            return (b.expireAt || 0) - (a.expireAt || 0);
        })
        : deduped;

    return prioritized.slice(0, args.limit).map(article => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expireAt, ...rest } = article;
        return { ...rest, formattedPubDate: uiDateFormat(new Date(article.publishedAt).getTime()) };
    });
}

export async function getEventsAdmin(
    args: { limit: number } = { limit: 8 }
): Promise<Event[]> {
    const db = getAdminFirestore();
    const today = new Date().toISOString().split('T')[0];
    const snapshot = await db.collection('events')
        .where('date', '>=', today)
        .orderBy('date', 'asc')
        .limit(args.limit)
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data() as Event;
        const eventDate = new Date(data.date);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expireAt, ...rest } = data;
        return {
            ...rest,
            id: doc.id,
            formattedDate: uiDateFormat(eventDate.getTime()),
            formattedMonth: eventDate.toLocaleString('default', { month: 'short' }).toUpperCase(),
            formattedDay: eventDate.getDate().toString(),
            formattedYear: eventDate.getFullYear().toString(),
        };
    });
}

export async function getAlbumsAdmin(
    args: { limit: number } = { limit: 6 }
): Promise<AlbumType[]> {
    const db = getAdminFirestore();
    const snapshot = await db.collection('albums')
        .where('public', '==', true)
        .where('approved', '==', true)
        .orderBy('updateDate', 'desc')
        .limit(args.limit)
        .get();

    const albums = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as AlbumType) }));
    const imageUrls = getImageUrls(albums, 's');
    return albums.map((album, i) => ({ ...album, images: imageUrls[i] }));
}

export async function getPostsAdmin(
    args: { limit?: number } = {}
): Promise<PostType[]> {
    const db = getAdminFirestore();
    let q = db.collection('posts')
        .where('public', '==', true)
        .where('approved', '==', true)
        .orderBy('updateDate', 'desc');
    if (args.limit) q = q.limit(args.limit);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as PostType) }));
}

export async function getPostBySlugAdmin(category: string, slug: string): Promise<PostType | undefined> {
    const db = getAdminFirestore();
    const snapshot = await db.collection('posts')
        .where('category', '==', category)
        .where('slug', '==', slug)
        .where('public', '==', true)
        .where('approved', '==', true)
        .limit(1)
        .get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...(doc.data() as PostType) };
}

export async function getPostWithAuthorAdmin(post: PostType): Promise<PostDisplayType> {
    const db = getAdminFirestore();
    const usersSnap = await db.collection('users').where('id', '==', post.userId).get();
    const authorDoc = usersSnap.docs[0];
    const author: User = authorDoc
        ? { id: authorDoc.id, ...(authorDoc.data() as User) }
        : { id: post.userId, email: '', name: 'Community Member', profilePic: undefined };
    const imageUrls = getImageUrls([post], 'l');
    return {
        ...post,
        images: imageUrls[0],
        formattedUpdateDate: uiDateFormat(post.updateDate),
        author,
    };
}

export async function getPaginatedPostsAdmin(
    args: { limit: number; page: number }
): Promise<{ posts: PostDisplayType[]; totalCount: number }> {
    const db = getAdminFirestore();
    const snapshot = await db.collection('posts')
        .where('public', '==', true)
        .where('approved', '==', true)
        .orderBy('updateDate', 'desc')
        .get();

    const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as PostType) }));
    const totalCount = allPosts.length;
    const start = (args.page - 1) * args.limit;
    const paginatedPosts = allPosts.slice(start, start + args.limit);

    const userIds = [...new Set(paginatedPosts.map(p => p.userId))].filter(Boolean);
    const users: User[] = [];
    if (userIds.length > 0) {
        const usersSnap = await db.collection('users').where('id', 'in', userIds).get();
        usersSnap.docs.forEach(doc => users.push({ id: doc.id, ...(doc.data() as User) }));
    }
    const userDict = users.reduce((dict, u) => { dict[u.id] = u; return dict; }, {} as Record<string, User>);

    const imageUrls = getImageUrls(paginatedPosts, 's');
    const posts = paginatedPosts.map((post, i) => ({
        ...post,
        images: imageUrls[i],
        formattedUpdateDate: uiDateFormat(post.updateDate),
        author: userDict[post.userId],
    }));

    return { posts, totalCount };
}

export async function getPaginatedNewsAdmin(
    args: { limit: number; page: number }
): Promise<{ news: NewsArticle[]; totalCount: number }> {
    const db = getAdminFirestore();
    const snapshot = await db.collection('news')
        .orderBy('expireAt', 'desc')
        .get();

    const allNews = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as NewsArticle) }));
    const deduped = dedupeBySimilarTitle(allNews).sort((a, b) =>
        new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );

    const totalCount = deduped.length;
    const start = (args.page - 1) * args.limit;
    const news = deduped.slice(start, start + args.limit).map(article => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expireAt, ...rest } = article;
        return { ...rest, formattedPubDate: uiDateFormat(new Date(article.publishedAt).getTime()) };
    });

    return { news, totalCount };
}
