import { PostType } from "../../firebase/types";
import Link from "next/link"

export type RecentPostsBoxProps = {
    posts: PostType[]
}

export default function RecentPostsBox(props: RecentPostsBoxProps) {
    return (
        <div>
            <h5 className="fw-bold mb-3">Recent Posts</h5>
            <div className="list-group list-group-flush">
                {[...props.posts].map((post: PostType, i) =>
                    <Link
                        key={i.toString()}
                        href={`/post/${post.category}/${post.slug}`}
                        className="list-group-item list-group-item-action border-0 px-0 py-2"
                    >
                        <div className="d-flex align-items-start">
                            <span className="text-primary me-2">→</span>
                            <span className="text-dark" style={{ fontSize: '0.95rem' }}>
                                {post.title}
                            </span>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}