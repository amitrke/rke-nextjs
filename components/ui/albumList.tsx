import { AlbumType } from '../../pages/account/editAlbum';
import AlbumListItem from './albumListItem';
import { ShowModalParams } from './showModal';
import styles from '../../styles/AlbumList.module.css';

type AlbumListProps = {
    albums: AlbumType[];
    bucketUrlMap: { [key: string]: string };
    confirmModalCB?: (props: ShowModalParams) => void;
    queueStatusMap?: { [id: string]: string };
};

export default function AlbumList({ albums, bucketUrlMap, confirmModalCB, queueStatusMap }: AlbumListProps) {
    return (
        <div className={styles.albumGrid}>
            {albums.map((album) => (
                <AlbumListItem key={album.id} album={album} mainImageUrl={bucketUrlMap[album.id]} confirmModalCB={confirmModalCB} queueStatus={queueStatusMap?.[album.id]} />
            ))}
        </div>
    );
}
