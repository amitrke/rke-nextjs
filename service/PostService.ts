import { limit, orderBy, where } from "firebase/firestore"
import { queryOnce } from "../firebase/firestore"
import { AlbumType } from "../pages/account/editAlbum"
import { PostType } from "../firebase/types";
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
    image_url: string,
    urlToImage: string,
    pubDate: string,
    publishedAt: string,
    source_id: string,
    keywords: string[],
    creator: string[],
    content: string,
    country: string[],
    category: string[],
    language: string,
    createdAt: number,
    formattedPubDate?: string,
    expireAt?: number,
}

export async function getAlbums(
    args: { limit: number } = { limit: 6 }
): Promise<AlbumType[]> {
    const queryConstraints = [
        where("public", "==", true),
        orderBy("updateDate", "desc"),
        limit(args.limit)
    ];
    const albums = await queryOnce<AlbumType>(
        {
            path: `albums`, queryConstraints: queryConstraints
        }
    );
    const albumsWithImageUrls = await Promise.all(albums.map(async (album) => {
        const images = [];
        if (album.images && album.images.length > 0) {
            const image = await getImageDownloadURLV2({ file: `users/${album.userId}/images/${album.images[0]}`, size: 's' });
            images.push(image.url);
        }
        return { ...album, images: images };
    }));
    return albumsWithImageUrls;
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
    const queryConstraints = [
        where("apiSource", "==", "newsdata.io"),
        orderBy("expireAt", "desc"),
    ];

    // Get all documents to determine total count and for pagination snapshots
    const allNews = await queryOnce<NewsArticle>({
        path: `news`,
        queryConstraints: queryConstraints
    });
    const totalCount = allNews.length;

    // Get the subset of documents for the current page
    const startIndex = (args.page - 1) * args.limit;
    const endIndex = startIndex + args.limit;
    const paginatedNews = allNews.slice(startIndex, endIndex);

    const formattedNews = paginatedNews.map(article => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expireAt, ...rest } = article;
        return {
            ...rest,
            formattedPubDate: uiDateFormat(new Date(article.publishedAt).getTime()),
        };
    });

    return { news: formattedNews, totalCount };
}

export async function getPaginatedPosts(
    args: { limit: number, page: number }
): Promise<{ posts: PostDisplayType[], totalCount: number }> {
    const queryConstraints = [
        where("public", "==", true),
        orderBy("updateDate", "desc"),
    ];

    const allPosts = await queryOnce<PostType>({
        path: `posts`,
        queryConstraints: queryConstraints
    });
    const totalCount = allPosts.length;

    const startIndex = (args.page - 1) * args.limit;
    const endIndex = startIndex + args.limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    const postDisplay = new Array<PostDisplayType>();
    const userIds = [...new Set(paginatedPosts.map(post => post.userId))];
    const users = await queryOnce<User>({ path: `users`, queryConstraints: [where("id", "in", userIds)] });
    const userDict = users.reduce((dict, user) => {
        dict[user.id] = user;
        return dict;
    }, {} as { [key: string]: User });

    for (const post of paginatedPosts) {
        const postImages = [];
        if (post.images && post.images.length > 0) {
            const image = await getImageDownloadURLV2({ file: `users/${post.userId}/images/${post.images[0]}`, size: 's' });
            postImages.push(image.url);
        }
        postDisplay.push({ ...post, images: postImages, formattedUpdateDate: uiDateFormat(post.updateDate), author: userDict[post.userId] });
    }

    return { posts: postDisplay, totalCount };
}

export async function getNews(
    args: { limit: number } = { limit: 8 }
): Promise<NewsArticle[]> {
    const queryConstraints = [
        where("apiSource", "==", "newsdata.io"),
        orderBy("expireAt", "desc"),
        limit(args.limit)
    ];
    const news = await queryOnce<NewsArticle>(
        {
            path: `news`, queryConstraints: queryConstraints
        }
    );
    return news.map(article => {
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
    const postDisplay = new Array<PostDisplayType>();
    //Get the list of unique user ids from posts
    const userIds = [...new Set(posts.map(post => post.userId))]
    //Query all users
    const users = await queryOnce<User>({ path: `users`, queryConstraints: [where("id", "in", userIds)] })
    //Map users to a dictionary for easy lookup
    const userDict = users.reduce((dict, user) => {
        dict[user.id] = user
        return dict
    }, {} as { [key: string]: User })
    for (const post of posts) {
        const postImages = [];
        if (post.images && post.images.length > 0) {
            const image = await getImageDownloadURLV2({ file: `users/${post.userId}/images/${post.images[0]}`, size: args.photoSize });
            postImages.push(image.url);
        }
        // console.log(postImages);
        postDisplay.push({ ...post, images: postImages, formattedUpdateDate: uiDateFormat(post.updateDate), author: userDict[post.userId] })
    }
    return postDisplay;
}

export async function getPostBySlug(category: string, slug: string): Promise<PostType> {
    const posts = await queryOnce<PostType>(
        {
            path: `posts`, queryConstraints: [
                where("category", "==", category),
                where("slug", "==", slug),
                where("public", "==", true),
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