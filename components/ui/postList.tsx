import { where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { subscribeToCollectionUpdates } from "../../firebase/firestore";
import { useUser } from "../../firebase/useUser";
import { PostType } from "../../pages/account/editpost";
import PostItem from "./postItem";
import { ShowModalParams } from "./showModal";

export type PostListParams = {
    count: number
    visibility: "public" | "private"
    confirmModalCB: (props: ShowModalParams) => void
}

const PostList = (params: PostListParams) => {

    const [posts, setPosts] = useState<Array<PostType>>([]);
    const { user } = useUser()

    useEffect(() => {
        if (user) {
            subscribeToCollectionUpdates<PostType>({ path: `posts`, updateCB: setPosts, queryConstraints: [ where("userId", "==", user.id) ] })
        }
    }, [user])

    return (
        <div>
            {[...posts].map((x, i) =>
                <PostItem key={x.id} post={x} confirmModalCB={params.confirmModalCB} />
            )}
        </div>
    )
}

export default PostList;