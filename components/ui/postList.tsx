import { useEffect, useState } from "react";
import { queryOnce } from "../../firebase/firestore";
import { useUser } from "../../firebase/useUser";
import PostItem, { PostType } from "./postItem";

export type PostListParams = {
    count: number;
    visibility: "public" | "private"
}

const PostList = (params: PostListParams) => {
    
    const [posts, setPosts] = useState<Array<PostType>>([]);
    const { user } = useUser()

    useEffect(() => {
        updateData();
    }, [user])

    const updateData = async() => {
        if (params.visibility == "private") {
            if (!user) return;     
            const dbList = await queryOnce<PostType>({path: `users/${user.id}/posts`})
            setPosts(dbList);
        }
    }

    return (
        <div>
            {[...posts].map((x, i) =>
                <PostItem post={x} />
            )}
        </div>
    )
}

export default PostList;