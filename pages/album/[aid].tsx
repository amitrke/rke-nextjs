import { where } from 'firebase/firestore'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import HeadTag from '../../components/ui/headTag'
import PostUserInfo from '../../components/ui/postUserInfo'
import { getImageBucketUrl } from '../../components/ui/showImage'
import { uiDateFormat } from '../../components/ui/uiUtils'
import { getDocument, queryOnce } from '../../firebase/firestore'
import { User } from '../../firebase/types'
import { AlbumType } from '../account/editAlbum'

type AlbumPropType = {
    album: AlbumType,
    user: User,
    images: { m: string, l: string }[],
    cacheCreatedAt?: string
}

export async function getStaticPaths() {
    const topPosts = await queryOnce<AlbumType>({ path: `albums`, queryConstraints: [where("public", "==", true)] })
    const paths = topPosts.map(post => ({ params: { aid: post.id } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

export const getStaticProps = (async (context) => {
    const aid = context.params.aid as string;
    const albumDoc = await getDocument<AlbumType>({ path: `albums`, pathSegments: [aid] })
    const userDoc = await getDocument<User>({ path: `users`, pathSegments: [albumDoc.userId] })

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
    albumProp: { album, user, images, cacheCreatedAt }
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const [show, setShow] = useState(false);
    const [showImage, setShowImage] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = (item: string) => {
        setShowImage(item);
        setShow(true);
    }

    return (
        <div className="album py-5 bg-light">
            <HeadTag title={`Photo Album - ${album.name}.`} />
            <Modal show={show} onHide={handleClose} fullscreen centered>
                {/* <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <Image src={showImage} alt="" className="w-100" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button> */}
                </Modal.Footer>
            </Modal>
            <Container>
                <Row>
                    <Col>
                        <h1>{album.name}</h1>
                        <PostUserInfo user={user} postDate={album.updateDate} />
                        <p>{album.description}</p>
                    </Col>
                </Row>
                <Row>
                    {images.map((item, key) => {
                        return (
                            <Col md="4" key={key}>
                                <Card className="mb-4 box-shadow">
                                    <Image src={item.m} alt="" onClick={() => handleShow(item.l)} />
                                    <Card.Body>
                                        {/* <Card.Text>{item.l.url}</Card.Text> */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <ButtonGroup>
                                                <Button
                                                    color="secondary"
                                                    size="sm" onClick={() => handleShow(item.l)}
                                                >
                                                    View
                                                </Button>
                                                {/* <Button
                                                    color="secondary"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button> */}
                                            </ButtonGroup>
                                            {/* <small className="text-muted">
                                                Time
                                            </small> */}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
                <Row>
                    <Col>
                        <hr />
                        <p className="text-center">This page was generated at {cacheCreatedAt}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}