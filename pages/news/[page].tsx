import { getPaginatedNews } from '../../service/PostService';
import { NewsArticle } from '../../service/PostService';
import HeadTag from '../../components/ui/headTag';
import NewsList from '../../components/ui/newsList';
import Pagination from '../../components/ui/pagination';
import { GetStaticPaths, GetStaticProps } from 'next';

const NEWS_PER_PAGE = 20;
const MAX_NEWS_ITEMS = 100;

type NewsPageProps = {
    news: NewsArticle[];
    page: number;
    totalPages: number;
};

export default function NewsPage({ news, page, totalPages }: NewsPageProps) {
    return (
        <div className="container">
            <HeadTag title={`News - Page ${page}`} />
            <h1>News</h1>
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
    const { news, totalCount } = await getPaginatedNews({ limit: NEWS_PER_PAGE, page });

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
