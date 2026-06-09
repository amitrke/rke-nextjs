import { getPaginatedNewsAdmin } from '../../service/PostServiceAdmin';
import type { NewsArticle } from '../../service/PostService';
import HeadTag from '../../components/ui/headTag';
import NewsList from '../../components/ui/newsList';
import Pagination from '../../components/ui/pagination';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../styles/PostsPage.module.css';

const NEWS_PER_PAGE = 20;
const MAX_NEWS_ITEMS = 100;

type NewsPageProps = {
    news: NewsArticle[];
    page: number;
    totalPages: number;
};

export default function NewsPage({ news, page, totalPages }: NewsPageProps) {
    const canonicalPath = `/news/${page}`;
    const prevPath = page > 1 ? `/news/${page - 1}` : undefined;
    const nextPath = page < totalPages ? `/news/${page + 1}` : undefined;

    return (
        <div className="mx-auto w-full max-w-7xl px-4">
            <HeadTag
                title={`News - Page ${page} | Roorkee.org`}
                description="Latest Roorkee news and updates from around the region."
                url={canonicalPath}
                prevUrl={prevPath}
                nextUrl={nextPath}
            />
            <div className={styles.header}>
                <h1>Latest News</h1>
                <p className={styles.description}>
                    Stay up to date with news and stories from in and around Roorkee
                </p>
            </div>
            <NewsList news={news} />
            <Pagination currentPage={page} totalPages={totalPages} basePath="/news" />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    // Pre-render the first 5 pages (up to 100 articles)
    const totalPages = Math.ceil(MAX_NEWS_ITEMS / NEWS_PER_PAGE);
    const paths = Array.from({ length: totalPages }, (_, i) => ({
        params: { page: (i + 1).toString() },
    }));

    return {
        paths,
        fallback: 'blocking', // or false if you don't want to generate more pages
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const page = parseInt(context.params.page as string, 10);
    // Validate that page is a positive integer
    if (isNaN(page) || page < 1) {
        return { notFound: true };
    }
    const { news, totalCount } = await getPaginatedNewsAdmin({ limit: NEWS_PER_PAGE, page });

    const totalPages = Math.ceil(Math.min(totalCount, MAX_NEWS_ITEMS) / NEWS_PER_PAGE);

    return {
        props: {
            news,
            page,
            totalPages,
        },
        revalidate: 3600, // Regenerate page every hour
    };
};
