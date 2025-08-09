import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PostsIndex = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/posts/page/1');
    }, [router]);

    return null;
};

export default PostsIndex;
