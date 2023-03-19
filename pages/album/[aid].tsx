import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, ButtonGroup, Card, CardImg, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import ShowImage, { getImageDownloadURLV2, ImageDownloadURLResponse } from '../../components/ui/showImage'
import { getDocument } from '../../firebase/firestore'
import { AlbumType } from '../account/editAlbum'

type AlbumPropType = {
    album: AlbumType,
    images: {m: ImageDownloadURLResponse, l: ImageDownloadURLResponse}[]
}

const AlbumSSR = (props: AlbumPropType) => {

    const [show, setShow] = useState(false);
    const [showImage, setShowImage] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = (item: string) => {
        setShowImage(item);
        setShow(true);
    }

    return (
        <div className="album py-5 bg-light">
            <Modal show={show} onHide={handleClose} fullscreen centered>
                {/* <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <Image src={showImage} alt="" className="w-100"/>
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
                    {props.images.map((item, key) => {
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
            </Container>
        </div>
    );
}

export async function getServerSideProps({ req, res, query }) {
    const { aid } = query
    if (typeof (aid) !== 'string') return;
    const albumDoc = await getDocument<AlbumType>({ path: `albums`, pathSegments: [aid] })
    const imageRequestPromises: Promise<ImageDownloadURLResponse> [] = [];
    albumDoc.images.forEach((image) => {
        imageRequestPromises.push(
            getImageDownloadURLV2({file: `users/${albumDoc.userId}/images/${image}`, size: 'm'})
        )
        imageRequestPromises.push(
            getImageDownloadURLV2({file: `users/${albumDoc.userId}/images/${image}`, size: 'l'})
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
    const imageResponseArray: {m: ImageDownloadURLResponse, l: ImageDownloadURLResponse}[] = []
    imageResponseMap.forEach((value, key) => {
        imageResponseArray.push({
            m: value['m'],
            l: value['l']
        })
    })
    

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=7200, stale-while-revalidate=59'
    )

    return {
        props: {
            album: albumDoc,
            images: imageResponseArray
        },
    }
}

export default AlbumSSR