import { useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import { getImageDownloadURLV2, ImageDownloadURLResponse } from '../../components/ui/showImage'
import { getDocument, queryOnce } from '../../firebase/firestore'
import { AlbumType } from '../account/editAlbum'
import { User } from '../../firebase/types'
import HeadTag from '../../components/ui/headTag'
import PostUserInfo from '../../components/ui/postUserInfo'
import { where } from 'firebase/firestore'
import { uiDateFormat } from '../../components/ui/uiUtils'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

type AlbumPropType = {
    album: AlbumType,
    user: User,
    images: { m: ImageDownloadURLResponse, l: ImageDownloadURLResponse }[],
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
    console.log(`context: ${JSON.stringify(context)}`)
    const aid = context.params.aid as string;
    console.log(`aid: ${aid}`)
    const albumDoc = await getDocument<AlbumType>({ path: `albums`, pathSegments: [aid] })
    const userDoc = await getDocument<User>({ path: `users`, pathSegments: [albumDoc.userId] })

    const imageRequestPromises: Promise<ImageDownloadURLResponse>[] = [];
    albumDoc.images.forEach((image) => {
        imageRequestPromises.push(
            getImageDownloadURLV2({ file: `users/${albumDoc.userId}/images/${image}`, size: 'm' })
        )
        imageRequestPromises.push(
            getImageDownloadURLV2({ file: `users/${albumDoc.userId}/images/${image}`, size: 'l' })
        )
    })
    const imageResponses = await Promise.all(imageRequestPromises)

    //Group imageResponses by key
    const imageResponseMap = new Map<string, ImageDownloadURLResponse[]>()
    imageResponses.forEach((imageResponse) => {
        if (!imageResponseMap.has(imageResponse.key)) {
            imageResponseMap.set(imageResponse.key, [])
        }
        imageResponseMap.get(imageResponse.key)[imageResponse.size] = imageResponse
    })

    // imageResponseMap to Array
    const imageResponseArray: { m: ImageDownloadURLResponse, l: ImageDownloadURLResponse }[] = []
    imageResponseMap.forEach((value, key) => {
        imageResponseArray.push({
            m: value['m'],
            l: value['l']
        })
    })

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
                                    <Image src={item.m.url} alt="" onClick={() => handleShow(item.l.url)} />
                                    <Card.Body>
                                        {/* <Card.Text>{item.l.url}</Card.Text> */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <ButtonGroup>
                                                <Button
                                                    color="secondary"
                                                    size="sm" onClick={() => handleShow(item.l.url)}
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