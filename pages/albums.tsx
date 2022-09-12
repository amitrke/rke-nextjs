import { where } from 'firebase/firestore'
import Head from 'next/head'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import ShowImage from '../components/ui/showImage'
import { queryOnce } from '../firebase/firestore'
import styles from '../styles/Home.module.css'
import { AlbumType } from './account/editAlbum'

type AlbumPropType = {
    time: string,
    dbList: AlbumType[]
}

export default function Albums(props: AlbumPropType) {

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        Albums
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {[...props.dbList].map((x, i) =>
                            <Card key={x.id} style={{ width: '18rem' }}>
                                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                <ShowImage size="s" file={`users/${x.userId}/images/${x.images[0]}`} />
                                <Card.Body>
                                    <Card.Title>{x.name}</Card.Title>
                                    <Card.Text>
                                       {x.description}
                                    </Card.Text>
                                    <Button variant="primary" href={`album/${x.id}`}>View Album</Button>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export async function getServerSideProps({ req, res }) {
    const dbList = await queryOnce<AlbumType>({ path: `albums`, queryConstraints: [where("public", "==", true)] })

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            time: new Date().toISOString(),
            dbList
        },
    }
}