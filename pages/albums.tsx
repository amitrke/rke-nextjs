import AlbumList from '../components/ui/albumList';
import HeadTag from '../components/ui/headTag';
import EmptyState from '../components/ui/EmptyState';
import { uiDateFormat } from '../components/ui/uiUtils';
import type { AlbumType } from './account/editAlbum';
import { getAdminFirestore } from '../firebase/firebaseAdmin';
import { InferGetStaticPropsType } from 'next';
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
            <div className="mx-auto w-full max-w-7xl px-4">
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
            </div>
        </>
    );
}

export async function getStaticProps() {
    const db = getAdminFirestore();
    const snapshot = await db.collection('albums')
        .where('public', '==', true)
        .where('approved', '==', true)
        .get();
    const dbList = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as AlbumType) }));
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
