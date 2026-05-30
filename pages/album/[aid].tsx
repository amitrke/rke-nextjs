import { where } from 'firebase/firestore'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Container, Image, Modal } from '../../components/ui/tw'
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = (index: number) => {
        setCurrentIndex(index);
        setShow(true);
    }

    const goPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    const goNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }

    const currentImage = images[currentIndex]?.l ?? '';

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
                    {images.length > 1 && (
                        <>
                            <Button variant="light" className={styles.navButtonLeft} onClick={goPrev} aria-label="Previous photo">
                                ‹
                            </Button>
                            <Button variant="light" className={styles.navButtonRight} onClick={goNext} aria-label="Next photo">
                                ›
                            </Button>
                        </>
                    )}
                    <Image src={currentImage} alt={`Photo ${currentIndex + 1}`} className={styles.fullImage} />
                    <div className={styles.imageCounter}>
                        {currentIndex + 1} / {images.length}
                    </div>
                </Modal.Body>
            </Modal>
            <Container>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-3 mt-3">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <li><Link href="/" className="hover:text-blue-700">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/albums" className="hover:text-blue-700">Albums</Link></li>
                        <li>/</li>
                        <li className="text-slate-700" aria-current="page">{album.name}</li>
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
                            onClick={() => handleShow(key)}
                        >
                            <div className={styles.imageWrapper}>
                                <Image src={item.m} alt={`Photo ${key + 1}`} className={styles.image} />
                                <div className={styles.imageOverlay}>
                                    <div className={styles.previewCopy}>
                                        <span className={styles.previewTitle}>Open photo</span>
                                        <span className={styles.previewHint}>Tap to view full size</span>
                                    </div>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className={styles.viewButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShow(key);
                                        }}
                                        aria-label={`Open photo ${key + 1} in full size`}
                                    >
                                        View photo ↗
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