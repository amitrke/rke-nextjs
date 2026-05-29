import AlbumList from '../components/ui/albumList';
import HeadTag from '../components/ui/headTag';
import EmptyState from '../components/ui/EmptyState';
import { uiDateFormat } from '../components/ui/uiUtils';
import { queryOnce } from '../firebase/firestore';
import { AlbumType } from './account/editAlbum';
import { where } from 'firebase/firestore';
import { InferGetStaticPropsType } from 'next';
import { Container } from 'react-bootstrap';
import { getImageBucketUrl } from '../components/ui/showImage2';
import styles from '../styles/AlbumsPage.module.css';

export default function Page({
    dbList,
    bucketUrlMap,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <HeadTag
                title="Photo Albums | Roorkee.org"
                description="Browse photo albums from the Roorkee community. Explore memories, places, and moments captured by residents."
                url="/albums"
            />
            <Container>
                <div className={styles.header}>
                    <h1>Photo Albums</h1>
                    <p className={styles.description}>
                        Explore visual memories and moments captured by the Roorkee community
                    </p>
                    {dbList.length > 0 && (
                        <p className={styles.albumCount}>
                            {dbList.length} {dbList.length === 1 ? 'album' : 'albums'} available
                        </p>
                    )}
                </div>

                {dbList.length > 0 ? (
                    <AlbumList albums={dbList} bucketUrlMap={bucketUrlMap} />
                ) : (
                    <EmptyState
                        title="No Albums Yet"
                        message="Be the first to share your photos with the community!"
                        icon="📸"
                    />
                )}
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const dbList = await queryOnce<AlbumType>({
        path: `albums`,
        queryConstraints: [
            where("public", "==", true),
            where("approved", "==", true)
        ]
    })
    const bucketUrlMap = {}
    dbList.forEach(x => {
        const url = getImageBucketUrl(x.images[0], 's', x.userId);
        bucketUrlMap[x.id] = url;
    })
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
