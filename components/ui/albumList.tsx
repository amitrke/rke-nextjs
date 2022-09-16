import { where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { subscribeToCollectionUpdates } from "../../firebase/firestore"
import { useUser } from "../../firebase/useUser"
import { AlbumType } from "../../pages/account/editAlbum"
import { ShowModalParams } from "./showModal"

export type AlbumListParams = {
    count: number
    publicOnly: boolean
    confirmModalCB: (props: ShowModalParams) => void
}

const AlbumList = (params: AlbumListParams) => {

    const [albums, setAlbums] = useState<Array<AlbumType>>([]);
    const { user } = useUser()

    useEffect(() => {
        if (!params.publicOnly && user) {
            subscribeToCollectionUpdates<AlbumType>({ path: `albums`, updateCB: setAlbums, queryConstraints: [ where("userId", "==", user.id) ] })
        }
    }, [user])

    return (
        <Container>
            {[...albums].map((x, i) =>
                <Row key={x.id}>
                    <Col>
                        {x.name}
                    </Col>
                    <Col>
                        <Button variant="primary" href={'/account/editAlbum?id='+x.id}>Edit</Button>{' '}
                        <Button variant="secondary">Delete</Button>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

AlbumList.noSSR = true;
export default AlbumList;