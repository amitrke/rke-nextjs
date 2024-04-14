import { where } from 'firebase/firestore'
import Head from 'next/head'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import ShowImage from '../components/ui/showImage'
import { queryOnce } from '../firebase/firestore'
import { AlbumType } from './account/editAlbum'
import { uiDateFormat } from '../components/ui/uiUtils'
import { InferGetStaticPropsType } from 'next'
import HeadTag from '../components/ui/headTag'

type AlbumPropType = {
    time: string,
    dbList: AlbumType[],
    cacheCreatedAt?: string
}

export default function Page({
    time, dbList, cacheCreatedAt
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <HeadTag title="Roorkee Photo Albums." />
            <Container>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {[...dbList].map((x, i) =>
                        <div className="col" key={x.id}>
                            <Card key={x.id} style={{ width: '18rem' }}>
                                <ShowImage size="s" userId={x.userId} file={x.images[0]} />
                                <Card.Body>
                                    <Card.Title>{x.name}</Card.Title>
                                    <Card.Text>
                                        {x.description}
                                    </Card.Text>
                                    <Button variant="primary" href={`album/${x.id}`}>View Album</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </div>
                <hr />
                <p className="text-center">This page was generated at {cacheCreatedAt}</p>
            </Container>
        </>
    )
}

export async function getStaticProps() {
    const dbList = await queryOnce<AlbumType>({ path: `albums`, queryConstraints: [where("public", "==", true)] })
    return {
        props: {
            time: new Date().toISOString(),
            dbList,
            cacheCreatedAt: uiDateFormat(new Date().getTime())
        },
        revalidate: 86400, // regenerate page every 24 hours
    }
}
