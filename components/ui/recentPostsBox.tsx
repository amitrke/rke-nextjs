import { PostType } from "../../pages/account/editpost"
import Link from "next/link"

export type RecentPostsBoxProps = {
    posts: PostType[]
}

export default function RecentPostsBox(props: RecentPostsBoxProps) {
    return (
        <div className="p-4">
            <h4 className="fst-italic">Recent Posts</h4>
            <ol className="list-unstyled mb-0">
                {[...props.posts].map((post: PostType, i) =>

                    <li><Link href={`/post/${post.category}/${post.slug}`}>{post.title}</Link></li>

                )}
            </ol>
        </div>
    )
}