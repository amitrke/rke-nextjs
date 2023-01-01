import { where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { CardGroup } from "react-bootstrap"
import { subscribeToCollectionUpdates } from "../../firebase/firestore"
import { useUser } from "../../firebase/useUser"
import { AlbumType } from "../../pages/account/editAlbum"
import AlbumListItem from "./albumListItem"
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
        <CardGroup>
            {[...albums].map((x, i) =>
                <AlbumListItem album={x} confirmModalCB={params.confirmModalCB} key={x.id} />
            )}
        </CardGroup>
    )
}

AlbumList.noSSR = true;
export default AlbumList;