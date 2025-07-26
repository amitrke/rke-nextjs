import { CardGroup } from 'react-bootstrap';
import { AlbumType } from '../../pages/account/editAlbum';
import AlbumListItem from './albumListItem';
import { ShowModalParams } from './showModal';

type AlbumListProps = {
    albums: AlbumType[];
    bucketUrlMap: { [key: string]: string };
    confirmModalCB?: (props: ShowModalParams) => void
};

export default function AlbumList({ albums, bucketUrlMap, confirmModalCB }: AlbumListProps) {
    return (
        <CardGroup>
            {albums.map((album) => (
                <AlbumListItem key={album.id} album={album} mainImageUrl={bucketUrlMap[album.id]} confirmModalCB={confirmModalCB} />
            ))}
        </CardGroup>
    );
}
