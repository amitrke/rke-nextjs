import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/news/1',
            permanent: true,
        },
    };
};

export default function NewsIndex() {
    return null;
}
