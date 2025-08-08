import { PostDisplayType } from '../../firebase/types';
import styles from '../../styles/IndexDev.module.css';
import Link from 'next/link';

type PostListProps = {
    posts: PostDisplayType[];
};

export default function PublicPostList({ posts }: PostListProps) {
    return (
        <div className={styles.cardGrid4}>
            {posts.map((post) => (
                <div className={styles.card} key={post.id}>
                    <div className={styles.cardImage} style={{backgroundImage: `url(${post.images && post.images.length > 0 ? post.images[0] : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className={styles.cardContent}>
                        <h3>{post.title}</h3>
                        <p>By {post.author.name}</p>
                        <p>{post.intro && post.intro.length > 120 ? `${post.intro.substring(0, 120)}...` : post.intro}</p>
                        <Link href={`/post/${post.category}/${post.slug}`}>Read More</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
