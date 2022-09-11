import { useRouter } from 'next/router'
import ShowImage from '../../components/ui/showImage'
import { getDocument } from '../../firebase/firestore'
import { AlbumType } from '../account/editAlbum'

type AlbumPropType = {
    album: AlbumType
}

const AlbumSSR = (props: AlbumPropType) => {
    return (
        <>
            <p>Album: {props.album.name}</p>
            {[...props.album.images].map((x, i) =>
                <ShowImage file={`users/${props.album.userId}/images/${x}`} />
            )}
        </>
    )
}

export async function getServerSideProps({ req, res, query }) {
    const { aid } = query
    if (typeof (aid) !== 'string') return;
    const albumDoc = await getDocument<AlbumType>({ path: `albums`, pathSegments: [aid] })

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            album: albumDoc
        },
    }
}

export default AlbumSSR