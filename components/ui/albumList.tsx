import { useEffect, useState } from "react"
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
            subscribeToCollectionUpdates<AlbumType>({ path: `users/${user.id}/albums`, updateCB: setAlbums })
        }
    }, [user])

    return (
        <div>
            {[...albums].map((x, i) =>
                <span>{x.id} - {x.name}</span>
                // <PostItem key={x.id} post={x} confirmModalCB={params.confirmModalCB} />
            )}
        </div>
    )
}

AlbumList.noSSR = true;
export default AlbumList;