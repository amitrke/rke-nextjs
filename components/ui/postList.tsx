import Link from 'next/link';
import { CardGroup, Col, Row } from 'react-bootstrap';
import { PostDisplayType } from '../../pages/posts/[id]';
import { ShowImageRaw } from './showImage';
import PostItem from './postItem';
import { ShowModalParams } from './showModal';

type PostListProps = {
    posts: PostDisplayType[];
    confirmModalCB?: (props: ShowModalParams) => void
    layout?: "list" | "cards"
};

export default function PostList({ posts, confirmModalCB, layout = "list" }: PostListProps) {
    if (layout === "cards") {
        return (
            <CardGroup>
                {posts.map((post: PostDisplayType) => (
                    <PostItem key={post.id} post={post} confirmModalCB={confirmModalCB} />
                ))}
            </CardGroup>
        );
    }
    return (
        <>
            {posts.map((post: PostDisplayType) => (
                <Link key={post.id} href={`post/${post.category}/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <Row className="blog-post">
                        <Col md={8}>
                            <h2 className="blog-post-title mb-1 text-black">{post.title}</h2>
                            <p className="blog-post-meta">
                                Posted on {post.formattedUpdateDate} by {post.author.name}
                            </p>
                            <p className="text-black">{post.intro}</p>
                        </Col>
                        <Col md={4}>
                            <ShowImageRaw size="s" imageUrl={post.images[0]} classes="img-thumbnail imgshadow" />
                        </Col>
                        <hr />
                    </Row>
                </Link>
            ))}
        </>
    );
}
