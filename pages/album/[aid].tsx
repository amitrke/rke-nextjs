import { where } from 'firebase/firestore'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Container, Image, Modal } from 'react-bootstrap'
import HeadTag from '../../components/ui/headTag'
import PostUserInfo from '../../components/ui/postUserInfo'
import { getImageBucketUrl } from '../../components/ui/showImage'
import { jsonLdDateFormat, uiDateFormat } from '../../components/ui/uiUtils'
import { getDocument, queryOnce } from '../../firebase/firestore'
import { User } from '../../firebase/types'
import { AlbumType } from '../account/editAlbum'
import styles from '../../styles/AlbumDetails.module.css'

type AlbumPropType = {
    album: AlbumType,
    user: User,
    images: { m: string, l: string }[],
    cacheCreatedAt?: string
}

export async function getStaticPaths() {
    const topPosts = await queryOnce<AlbumType>({
        path: `albums`,
        queryConstraints: [
            where("public", "==", true),
            where("approved", "==", true)
        ]
    })
    const paths = topPosts.map(post => ({ params: { aid: post.id } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

export const getStaticProps = (async (context) => {
    const aid = context.params.aid as string;
    const albumDoc = await getDocument<AlbumType>({ path: `albums`, pathSegments: [aid] })

    if (!albumDoc) {
        return {
            notFound: true,
        };
    }

    if (albumDoc.public !== true || albumDoc.approved !== true) {
        return {
            notFound: true,
        };
    }

    const userDoc = await getDocument<User>({ path: `users`, pathSegments: [albumDoc.userId] })

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    // imageResponseMap to Array
    const imageResponseArray: { m: string, l: string }[] = []
    albumDoc.images.forEach(async (imageId) => {
        const mUrl = getImageBucketUrl(imageId, 'm', albumDoc.userId);
        const lUrl = getImageBucketUrl(imageId, 'l', albumDoc.userId);
        imageResponseArray.push({
            m: mUrl,
            l: lUrl
        });
    });

    const albumProp: AlbumPropType = {
        album: albumDoc,
        user: userDoc,
        images: imageResponseArray,
        cacheCreatedAt: uiDateFormat((new Date()).getTime())
    }

    return {
        props: {
            albumProp
        },
        revalidate: 86400, // regenerate page every 24 hours 
    }
}) satisfies GetStaticProps<{
    albumProp: AlbumPropType
}>

export default function Page({
    albumProp: { album, user, images }
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const [show, setShow] = useState(false);
    const [showImage, setShowImage] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = (item: string) => {
        setShowImage(item);
        setShow(true);
    }

    return (
        <>
            <HeadTag
                title={`${album.name} - Photo Album`}
                description={`Photo album by ${user.name} - ${album.images.length} photos from Roorkee`}
                url={`/album/${album.id}`}
                image={images.length > 0 ? images[0].m : undefined}
                keywords={['Roorkee', 'photos', 'album', album.name]}
                author={user.name}
                publishedTime={album.updateDate ? jsonLdDateFormat(album.updateDate) : undefined}
            />
            <Modal show={show} onHide={handleClose} fullscreen centered className={styles.imageModal}>
                <Modal.Body className={styles.modalBody}>
                    <Button variant="light" className={styles.closeButton} onClick={handleClose}>
                        ✕
                    </Button>
                    <Image src={showImage} alt="" className={styles.fullImage} />
                </Modal.Body>
            </Modal>
            <Container>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-3 mt-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link href="/albums">Albums</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{album.name}</li>
                    </ol>
                </nav>
                <div className={styles.header}>
                    <h1 className={styles.albumTitle}>{album.name}</h1>
                    <PostUserInfo user={user} postDate={album.updateDate} />
                    {album.description && (
                        <p className={styles.albumDescription}>{album.description}</p>
                    )}
                    <p className={styles.photoCount}>
                        {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
                    </p>
                </div>

                <div className={styles.imageGrid}>
                    {images.map((item, key) => (
                        <div
                            key={key}
                            className={styles.imageCard}
                            onClick={() => handleShow(item.l)}
                        >
                            <div className={styles.imageWrapper}>
                                <Image src={item.m} alt={`Photo ${key + 1}`} className={styles.image} />
                                <div className={styles.imageOverlay}>
                                    <Button variant="light" size="sm" className={styles.viewButton}>
                                        View Full Size
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
}