import { limit, orderBy, QueryConstraint, where } from "firebase/firestore"
import { FirestoreDocument, queryOnce } from "../firebase/firestore"
import { AlbumType } from "../pages/account/editAlbum"
import { PostType, ModerationQueueItem } from "../firebase/types";
import { PostDisplayType } from "../firebase/types";
import { User } from "../firebase/types"
import { getImageDownloadURLV2 } from "../components/ui/showImage"
import { uiDateFormat } from "../components/ui/uiUtils"

export type GetPostArgs = {
    public?: boolean,
    limit?: number,
    userId?: string,
}

export type Event = {
    id: string,
    name: string,
    description: string,
    date: string, // ISO date string
    formattedDate?: string,
    formattedMonth?: string,
    formattedDay?: string,
    formattedYear?: string,
    expireAt?: number,
}

export type NewsArticle = {
    id: string,
    title: string,
    description: string,
    link: string,
    url: string,
    image_url: string, // Standardized on image_url (NewsData.io uses this)
    publishedAt: string, // Standardized on publishedAt (ISO format)
    source_id: string,
    keywords: string[],
    creator: string[],
    content: string,
    country: string[],
    category: string[],
    language: string,
    apiSource?: string,
    source?: string,
    createdAt: number,
    formattedPubDate?: string,
    expireAt?: number,
}

// --- helper utilities: dedupe news by very similar titles ---
const STOP_WORDS = new Set([
    "the","a","an","to","of","in","on","for","with","and","or","at","from","by","about","after","before","over","under","into","as","is","are","was","were","be","been","being","this","that","these","those","it","its","their","his","her","new","breaking"
]);

function normalizeTitle(raw: string): string {
    if (!raw) return "";
    return raw
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, " ") // remove urls
        .replace(/[^a-z0-9\s]/g, " ")      // remove punctuation
        .replace(/\s+/g, " ")               // collapse whitespace
        .trim();
}

function tokenizeTitle(raw: string): string[] {
    const norm = normalizeTitle(raw);
    if (!norm) return [];
    return norm
        .split(" ")
        .filter(t => t && !STOP_WORDS.has(t));
}

function jaccardSimilarity(aTokens: string[], bTokens: string[]): number {
    if (aTokens.length === 0 && bTokens.length === 0) return 1;
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    let intersection = 0;
    for (const t of aSet) {
        if (bSet.has(t)) intersection++;
    }
    const union = aSet.size + bSet.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

function tokenCoverage(aTokens: string[], bTokens: string[]): number {
    if (aTokens.length === 0 || bTokens.length === 0) return 0;
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    let intersection = 0;
    for (const t of aSet) {
        if (bSet.has(t)) intersection++;
    }
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
    const j = jaccardSimilarity(at, bt);
    const cov = tokenCoverage(at, bt);
    // Tunable thresholds; conservative to avoid false positives
    return j >= 0.75 || cov >= 0.85;
}

function dedupeBySimilarTitle<T extends { title: string }>(items: T[]): T[] {
    const result: T[] = [];
    for (const item of items) {
        const duplicate = result.some(r => areTitlesSimilar(r.title, item.title));
        if (!duplicate) result.push(item);
    }
    return result;
}

// --- Image fetching utility ---
type FetchImageUrlsArgs = {
    items: Array<{ userId: string; images?: string[] }>;
    size: 's' | 'm' | 'l';
};

async function fetchImageUrls({ items, size }: FetchImageUrlsArgs): Promise<string[][]> {
    return Promise.all(items.map(async (item) => {
        const imageUrls: string[] = [];
        if (item.images && item.images.length > 0) {
            const image = await getImageDownloadURLV2({
                file: `users/${item.userId}/images/${item.images[0]}`,
                size
            });
            imageUrls.push(image.url);
        }
        return imageUrls;
    }));
}

// --- Pagination utility ---
type PaginationArgs<T, R> = {
    path: string;
    queryConstraints: QueryConstraint[];
    page: number;
    limit: number;
    preProcess?: (items: FirestoreDocument<T>[]) => FirestoreDocument<T>[];
    transform: (items: FirestoreDocument<T>[]) => Promise<R[]> | R[];
};

async function getPaginatedCollection<T, R>(
    args: PaginationArgs<T, R>
): Promise<{ items: R[], totalCount: number }> {
    // Fetch all documents
    const allItems = await queryOnce<T>({
        path: args.path,
        queryConstraints: args.queryConstraints
    });

    // Apply pre-processing (e.g., deduplication)
    const processedItems = args.preProcess ? args.preProcess(allItems) : allItems;
    const totalCount = processedItems.length;

    // Calculate pagination
    const startIndex = (args.page - 1) * args.limit;
    const endIndex = startIndex + args.limit;
    const paginatedItems = processedItems.slice(startIndex, endIndex);

    // Transform items
    const transformedItems = await args.transform(paginatedItems);

    return { items: transformedItems, totalCount };
}

export async function getPendingQueueItems(
    type: 'post' | 'album'
): Promise<ModerationQueueItem[]> {
    return queryOnce<ModerationQueueItem>({
        path: 'moderationQueue',
        queryConstraints: [
            where('itemType', '==', type),
            where('status', '==', 'pending'),
            orderBy('submittedAt', 'desc'),
        ],
    });
}

export async function getAlbums(
    args: { limit: number } = { limit: 6 }
): Promise<AlbumType[]> {
    const queryConstraints = [
        where("public", "==", true),
        where("approved", "==", true),
        orderBy("updateDate", "desc"),
        limit(args.limit)
    ];
    const albums = await queryOnce<AlbumType>(
        {
            path: `albums`, queryConstraints: queryConstraints
        }
    );
    const imageUrls = await fetchImageUrls({ items: albums, size: 's' });
    return albums.map((album, index) => ({ ...album, images: imageUrls[index] }));
}

export async function getEvents(
    args: { limit: number } = { limit: 8 }
): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
    const queryConstraints = [
        where("date", ">=", today),
        orderBy("date", "asc"),
        limit(args.limit)
    ];
    const events = await queryOnce<Event>(
        {
            path: `events`, queryConstraints: queryConstraints
        }
    );
    return events.map(event => {
        const eventDate = new Date(event.date);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expireAt, ...rest } = event;
        return {
            ...rest,
            formattedDate: uiDateFormat(eventDate.getTime()),
            formattedMonth: eventDate.toLocaleString('default', { month: 'short' }).toUpperCase(),
            formattedDay: eventDate.getDate().toString(),
            formattedYear: eventDate.getFullYear().toString(),
        };
    });
}

export async function getPaginatedNews(
    args: { limit: number, page: number }
): Promise<{ news: NewsArticle[], totalCount: number }> {
    const result = await getPaginatedCollection<NewsArticle, NewsArticle>({
        path: 'news',
        queryConstraints: [
            // where("apiSource", "==", "newsdata.io"), // uncomment to filter by source
            orderBy("expireAt", "desc"),
        ],
        page: args.page,
        limit: args.limit,
        preProcess: (items) => {
            const deduped = dedupeBySimilarTitle(items);
            return deduped.sort((a, b) => {
                const aTime = new Date(a.publishedAt || 0).getTime();
                const bTime = new Date(b.publishedAt || 0).getTime();
                return bTime - aTime;
            });
        },
        transform: (items) => items.map(article => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { expireAt, ...rest } = article;
            return {
                ...rest,
                formattedPubDate: uiDateFormat(new Date(article.publishedAt).getTime()),
            };
        })
    });

    return { news: result.items, totalCount: result.totalCount };
}

export async function getPaginatedPosts(
    args: { limit: number, page: number }
): Promise<{ posts: PostDisplayType[], totalCount: number }> {
    const result = await getPaginatedCollection<PostType, PostDisplayType>({
        path: 'posts',
        queryConstraints: [
            where("public", "==", true),
            where("approved", "==", true),
            orderBy("updateDate", "desc"),
        ],
        page: args.page,
        limit: args.limit,
        transform: async (paginatedPosts) => {
            // Fetch users for all posts
            const userIds = [...new Set(paginatedPosts.map(post => post.userId))].filter(Boolean);
            // Firestore "in" query requires non-empty array
            const users = userIds.length > 0
                ? await queryOnce<User>({ path: `users`, queryConstraints: [where("id", "in", userIds)] })
                : [];
            const userDict = users.reduce((dict, user) => {
                dict[user.id] = user;
                return dict;
            }, {} as { [key: string]: User });

            // Fetch images for all posts
            const imageUrls = await fetchImageUrls({ items: paginatedPosts, size: 's' });

            // Combine all data
            return paginatedPosts.map((post, index) => ({
                ...post,
                images: imageUrls[index],
                formattedUpdateDate: uiDateFormat(post.updateDate),
                author: userDict[post.userId]
            }));
        }
    });

    return { posts: result.items, totalCount: result.totalCount };
}

export async function getNews(
    args: { limit: number, preferredApiSource?: string } = { limit: 8 }
): Promise<NewsArticle[]> {
    // Fetch more than needed to account for deduplication losses
    const fetchLimit = args.limit * 4;
    const queryConstraints = [
        orderBy("expireAt", "desc"),
        limit(fetchLimit)
    ];
    const news = await queryOnce<NewsArticle>(
        {
            path: `news`, queryConstraints: queryConstraints
        }
    );
    
    // Remove near-duplicate titles while keeping the newest.
    const deduped = dedupeBySimilarTitle(news);

    // Prioritize a specific provider for homepage display while keeping fallback content.
    const prioritized = args.preferredApiSource
        ? deduped.sort((a, b) => {
            const aRank = a.apiSource === args.preferredApiSource ? 0 : 1;
            const bRank = b.apiSource === args.preferredApiSource ? 0 : 1;
            if (aRank !== bRank) return aRank - bRank;
            return (b.expireAt || 0) - (a.expireAt || 0);
        })
        : deduped;

    const selected = prioritized.slice(0, args.limit);
    
    return selected.map(article => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expireAt, ...rest } = article;
        return {
            ...rest,
            formattedPubDate: uiDateFormat(new Date(article.publishedAt).getTime()),
        };
    });
}

export async function getPosts(
    args: GetPostArgs = {}
): Promise<PostType[]> {
    const queryConstraints = []
    if (args.public !== undefined) {
        queryConstraints.push(where("public", "==", args.public))
        if (args.public === true) {
            queryConstraints.push(where("approved", "==", true))
        }
    }
    if (args.userId) {
        queryConstraints.push(where("userId", "==", args.userId))
    }
    queryConstraints.push(orderBy("updateDate", "desc"))
    if (args.limit) {
        queryConstraints.push(limit(args.limit))
    }
    return await queryOnce<PostType>(
        {
            path: `posts`, queryConstraints: queryConstraints
        }
    )
}

export type GetPostsWithDetailsArgs = GetPostArgs &{
    photoSize: 's' | 'm' | 'l'
}

export async function getPostsWithDetails(
    args: GetPostsWithDetailsArgs = { public: true, limit: 10, photoSize: 's' }
): Promise<PostDisplayType[]> {
    const posts = await getPosts(args)
    //Get the list of unique user ids from posts
    const userIds = [...new Set(posts.map(post => post.userId))].filter(Boolean)
    //Query all users - Firestore "in" query requires non-empty array
    const users = userIds.length > 0
        ? await queryOnce<User>({ path: `users`, queryConstraints: [where("id", "in", userIds)] })
        : []
    //Map users to a dictionary for easy lookup
    const userDict = users.reduce((dict, user) => {
        dict[user.id] = user
        return dict
    }, {} as { [key: string]: User })

    const imageUrls = await fetchImageUrls({ items: posts, size: args.photoSize });
    return posts.map((post, index) => ({
        ...post,
        images: imageUrls[index],
        formattedUpdateDate: uiDateFormat(post.updateDate),
        author: userDict[post.userId]
    }));
}

export async function getPostBySlug(category: string, slug: string): Promise<PostType> {
    const posts = await queryOnce<PostType>(
        {
            path: `posts`, queryConstraints: [
                where("category", "==", category),
                where("slug", "==", slug),
                where("public", "==", true),
                where("approved", "==", true),
                limit(1)
            ]
        }
    )
    return posts[0]
}

export async function getPostWithAuthor(post: PostType): Promise<PostDisplayType> {
    const author = await queryOnce<User>({ path: `users`, queryConstraints: [where("id", "==", post.userId)] });
    const postImages = [];
    if (post.images && post.images.length > 0) {
        const image = await getImageDownloadURLV2({ file: `users/${post.userId}/images/${post.images[0]}`, size: 'l' });
        postImages.push(image.url);
    }
    return {
        ...post,
        images: postImages,
        formattedUpdateDate: uiDateFormat(post.updateDate),
        author: author[0],
    };
}