import { limit, orderBy, where } from "firebase/firestore"
import { queryOnce } from "../firebase/firestore"
import { PostType } from "../pages/account/editpost"
import { PostDisplayType } from "../pages/posts/[id]"
import { User } from "../firebase/types"
import { getImageDownloadURLV2 } from "../components/ui/showImage"
import { uiDateFormat } from "../components/ui/uiUtils"

export type GetPostArgs = {
    public?: boolean,
    limit?: number,
    userId?: string,
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
    console.log('getNews', news);
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