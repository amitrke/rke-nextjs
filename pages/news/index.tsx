import { useRouter } from 'next/router';
import { useEffect } from 'react';

const NewsIndex = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/news/1');
    }, [router]);

    return null;
};

export default NewsIndex;
