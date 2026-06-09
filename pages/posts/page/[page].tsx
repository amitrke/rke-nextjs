import { GetStaticPaths, GetStaticProps } from 'next';
import { getPaginatedPostsAdmin } from '../../../service/PostServiceAdmin';
import Pagination from '../../../components/ui/pagination';
import PublicPostList from '../../../components/ui/publicPostList';
import HeadTag from '../../../components/ui/headTag';
import EmptyState from '../../../components/ui/EmptyState';

import { PostDisplayType } from '../../../firebase/types';
import styles from '../../../styles/PostsPage.module.css';

type PostPageProps = {
    posts: PostDisplayType[];
    totalCount: number;
    page: number;
};

const PostsPage = ({ posts, totalCount, page }: PostPageProps) => {
    const totalPages = Math.ceil(totalCount / 12);
    const canonicalPath = `/posts/page/${page}`;
    const prevPath = page > 1 ? `/posts/page/${page - 1}` : undefined;
    const nextPath = page < totalPages ? `/posts/page/${page + 1}` : undefined;

    return (
        <>
            <HeadTag
                title="Community Posts | Roorkee.org"
                description="Browse posts from the Roorkee community. Share stories, experiences, and memories about life in Roorkee."
                url={canonicalPath}
                prevUrl={prevPath}
                nextUrl={nextPath}
            />
            <div className="mx-auto w-full max-w-7xl px-4">
                <div className={styles.header}>
                    <h1>Community Posts</h1>
                    <p className={styles.description}>
                        Discover stories, experiences, and memories shared by the Roorkee community
                    </p>
                    {totalCount > 0 && (
                        <p className={styles.postCount}>
                            Showing {(page - 1) * 12 + 1}-{Math.min(page * 12, totalCount)} of {totalCount} posts
                        </p>
                    )}
                </div>

                {posts.length > 0 ? (
                    <>
                        <PublicPostList posts={posts} />
                        <Pagination currentPage={page} totalPages={totalPages} basePath="/posts/page" />
                    </>
                ) : (
                    <EmptyState
                        title="No Posts Found"
                        message="Be the first to share your story with the community!"
                        icon="📝"
                    />
                )}
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const pageParam = context.params?.page;
    // Validate that pageParam is a string representing a positive integer
    if (
        typeof pageParam !== 'string' ||
        !/^\d+$/.test(pageParam) ||
        Number(pageParam) < 1
    ) {
        return { notFound: true };
    }
    const page = Number(pageParam);
    const { posts, totalCount } = await getPaginatedPostsAdmin({ limit: 12, page });

    return {
        props: {
            posts,
            totalCount,
            page,
        },
        revalidate: 3600, // revalidate every hour
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { totalCount } = await getPaginatedPostsAdmin({ limit: 12, page: 1 });
    const totalPages = Math.ceil(totalCount / 12);

    const paths = Array.from({ length: totalPages }, (_, i) => ({
        params: { page: (i + 1).toString() },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
};

export default PostsPage;
