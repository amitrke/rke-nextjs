import { NewsArticle } from '../../service/PostService';
import styles from '../../styles/IndexDev.module.css';
import Link from 'next/link';

type NewsListProps = {
    news: NewsArticle[];
};

export default function NewsList({ news }: NewsListProps) {
    return (
        <div className={styles.cardGrid4}>
            {news.map((item) => (
                <div className={styles.card} key={item.id}>
                    <div className={styles.cardImage} style={{backgroundImage: `url(${item.urlToImage ? item.urlToImage : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className={styles.cardContent}>
                        <h3>{item.title}</h3>
                        <p>{item.formattedPubDate}</p>
                        <p>{item.description && item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}</p>
                        <Link href={item.url}>Read More</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}