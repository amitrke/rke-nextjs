import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/posts/page/1',
            permanent: true,
        },
    };
};

export default function PostsIndex() {
    return null;
}
