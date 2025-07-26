import AlbumList from '../components/ui/albumList';
import HeadTag from '../components/ui/headTag';
import { uiDateFormat } from '../components/ui/uiUtils';
import { queryOnce } from '../firebase/firestore';
import { AlbumType } from './account/editAlbum';
import { where } from 'firebase/firestore';
import { InferGetStaticPropsType } from 'next';
import { Container } from 'react-bootstrap';
import { getImageBucketUrl } from '../components/ui/showImage2';

export default function Page({
    dbList,
    cacheCreatedAt,
    bucketUrlMap,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <HeadTag title="Roorkee Photo Albums." />
            <Container>
                <AlbumList albums={dbList} bucketUrlMap={bucketUrlMap} />
                <hr />
                <p className="text-center">This page was generated at {cacheCreatedAt}</p>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const dbList = await queryOnce<AlbumType>({ path: `albums`, queryConstraints: [where("public", "==", true)] })
    const bucketUrlMap = {}
    dbList.forEach(x => {
        const url = getImageBucketUrl(x.images[0], 's', x.userId);
        bucketUrlMap[x.id] = url;
    })
    console.log('bucketUrlMap: ', bucketUrlMap);
    return {
        props: {
            time: new Date().toISOString(),
            dbList,
            bucketUrlMap,
            cacheCreatedAt: uiDateFormat(new Date().getTime())
        },
        revalidate: 86400, // regenerate page every 24 hours
    }
}
