import { PostDisplayType } from '../../firebase/types';
import Link from 'next/link';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { ShowModalParams } from './showModal';
import { deleteDocument } from '../../firebase/firestore';

type PostListProps = {
    posts: PostDisplayType[];
    confirmModalCB: (params: ShowModalParams) => void;
    layout: 'cards' | 'list';
};

export default function PostList({ posts, confirmModalCB, layout }: PostListProps) {

    const deletePost = async (id: string) => {
        try {
            await deleteDocument({ path: 'posts', pathSegments: [id] });
            // TODO: Refresh the post list after deletion
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    if (layout === 'cards') {
        return (
            <Row>
                {posts.map((post) => (
                    <Col md={4} key={post.id} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={post.images && post.images.length > 0 ? post.images[0] : '/no-image.png'} />
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">By {post.author.name}</Card.Subtitle>
                                <Card.Text>
                                    {post.intro && post.intro.length > 120 ? `${post.intro.substring(0, 120)}...` : post.intro}
                                </Card.Text>
                                <Link href={`/post/${post.category}/${post.slug}`} passHref>
                                    <Button variant="link">Read More</Button>
                                </Link>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="outline-danger" size="sm" onClick={() => confirmModalCB({ show: true, yesCallback: () => deletePost(post.id) })}>Delete</Button>
                                <Link href={`/account/editpost?id=${post.id}`} passHref className='ps-2'>
                                    <Button variant="outline-primary" size="sm">Edit</Button>
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    } else {
        return (
            <div>
                {posts.map((post) => (
                    <div key={post.id}>
                        <Link href={`/post/${post.category}/${post.slug}`}>
                            {post.title}
                        </Link>
                    </div>
                ))}
            </div>
        )
    }
}
