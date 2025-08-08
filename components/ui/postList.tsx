import { PostDisplayType } from '../../firebase/types';
import styles from '../../styles/IndexDev.module.css';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { ShowModalParams } from './showModal';

type PostListProps = {
    posts: PostDisplayType[];
    confirmModalCB: (params: ShowModalParams) => void;
    layout: 'cards' | 'list';
};

export default function PostList({ posts, confirmModalCB, layout }: PostListProps) {

    const deletePost = async (id: string) => {
        console.log('delete post', id);
    }

    if (layout === 'cards') {
        return (
            <div className={styles.cardGrid4}>
                {posts.map((post) => (
                    <div className={styles.card} key={post.id}>
                        <div className={styles.cardImage} style={{ backgroundImage: `url(${post.images && post.images.length > 0 ? post.images[0] : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className={styles.cardContent}>
                            <h3>{post.title}</h3>
                            <p>By {post.author.name}</p>
                            <p>{post.intro && post.intro.length > 120 ? `${post.intro.substring(0, 120)}...` : post.intro}</p>
                            <Link href={`/post/${post.category}/${post.slug}`}>Read More</Link>
                            <div className='pt-2'>
                                <Button variant="outline-danger" size="sm" onClick={() => confirmModalCB({ show: true, yesCallback: () => deletePost(post.id) })}>Delete</Button>
                                <Link href={`/account/editpost?id=${post.id}`} passHref className='ps-2'>
                                    <Button variant="outline-primary" size="sm">Edit</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div>
                {posts.map((post) => (
                    <div key={post.id}>
                        <Link href={`/post/${post.category}/${post.slug}`}>
                            <a>{post.title}</a>
                        </Link>
                    </div>
                ))}
            </div>
        )
    }
}
