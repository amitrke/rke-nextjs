import { PostType } from "../../firebase/types";
import Link from "next/link"

export type RecentPostsBoxProps = {
    posts: PostType[]
}

export default function RecentPostsBox(props: RecentPostsBoxProps) {
    return (
        <div>
            <h5 className="mb-3 text-lg font-bold">Recent Posts</h5>
            <div className="divide-y divide-slate-200">
                {[...props.posts].map((post: PostType, i) =>
                    <Link
                        key={i.toString()}
                        href={`/post/${post.category}/${post.slug}`}
                        className="block px-0 py-2 transition-colors hover:bg-slate-50"
                    >
                        <div className="flex items-start">
                            <span className="mr-2 text-blue-600">→</span>
                            <span className="text-slate-900" style={{ fontSize: '0.95rem' }}>
                                {post.title}
                            </span>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}