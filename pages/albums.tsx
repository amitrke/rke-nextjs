import { where } from 'firebase/firestore'
import { InferGetStaticPropsType } from 'next'
import { Button, Card, Container } from 'react-bootstrap'
import HeadTag from '../components/ui/headTag'
import ShowImage2, { getImageBucketUrl } from '../components/ui/showImage2'
import { uiDateFormat } from '../components/ui/uiUtils'
import { queryOnce } from '../firebase/firestore'
import { AlbumType } from './account/editAlbum'

export default function Page({
    time, dbList, cacheCreatedAt, bucketUrlMap
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <HeadTag title="Roorkee Photo Albums." />
            <Container>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {[...dbList].map((x, i) =>
                        <div className="col" key={x.id}>
                            <Card key={x.id} style={{ width: '18rem' }}>
                                {/* <ShowImage2 size="s" userId={x.userId} file={x.images[0]} classes='h-50'/> */}
                                <Card.Img variant="top" src={bucketUrlMap[x.id]} />
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
