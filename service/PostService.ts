import { limit, orderBy, where } from "firebase/firestore"
import { queryOnce } from "../firebase/firestore"
import { PostType } from "../pages/account/editpost"
import { PostDisplayType } from "../pages/posts/[id]"
import { User } from "../firebase/types"
import { getImageDownloadURLV2 } from "../components/ui/showImage"
import { uiDateFormat } from "../components/ui/uiUtils"

export type GetPostArgs = {
    public: boolean,
    limit: number,
}

export async function getPosts(
    args: GetPostArgs = { public: true, limit: 10 }
): Promise<PostType[]> {
    return await queryOnce<PostType>(
        {
            path: `posts`, queryConstraints: [
                where("public", "==", args.public),
                orderBy("updateDate", "desc"),
                limit(args.limit)
            ]
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