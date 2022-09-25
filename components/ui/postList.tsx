import { where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { queryOnce } from "../../firebase/firestore";
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
        updateData();
    }, [user])

    async function updateData() {
        if (params.visibility == "private") {
            if (!user) return;
            const dbList = await queryOnce<PostType>({ path: `posts`, queryConstraints: [ where("userId", "==", user.id) ] });
            setPosts(dbList);
        }
    }

    return (
        <div>
            {[...posts].map((x, i) =>
                <PostItem key={x.id} post={x} confirmModalCB={params.confirmModalCB} />
            )}
        </div>
    )
}

export default PostList;