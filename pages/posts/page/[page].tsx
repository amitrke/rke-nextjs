import { GetStaticPaths, GetStaticProps } from 'next';
import { getPaginatedPosts } from '../../../service/PostService';
import Pagination from '../../../components/ui/pagination';
import PublicPostList from '../../../components/ui/publicPostList';

import { PostDisplayType } from '../../../firebase/types';

type PostPageProps = {
    posts: PostDisplayType[];
    totalCount: number;
    page: number;
};

const PostsPage = ({ posts, totalCount, page }: PostPageProps) => {
    return (
        <div>
            <h1>Posts</h1>
            <PublicPostList posts={posts} />
            <Pagination currentPage={page} totalPages={Math.ceil(totalCount / 12)} basePath="/posts" />
        </div>
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
    const { posts, totalCount } = await getPaginatedPosts({ limit: 12, page });

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
    const { totalCount } = await getPaginatedPosts({ limit: 12, page: 1 });
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
