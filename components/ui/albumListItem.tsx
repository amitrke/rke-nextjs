import { Button, Card } from "react-bootstrap";
import Link from 'next/link';
import { useUser } from "../../firebase/useUser";
import { deleteDocument } from "../../firebase/firestore";
import { AlbumType } from "../../pages/account/editAlbum";
import { ShowModalParams } from "./showModal";
import styles from '../../styles/AlbumListItem.module.css';

export type DisplayAlbumParams = {
    album: AlbumType
    confirmModalCB?: (props: ShowModalParams) => void
    mainImageUrl: string
}

const AlbumListItem = (params: DisplayAlbumParams) => {
    const { user } = useUser();

    const onDelete = async () => {
        await deleteDocument({ path: `albums/${params.album.id}` });
    }

    const onDeleteClick = () => {
        if (params.confirmModalCB) {
            params.confirmModalCB({ show: true, yesCallback: onDelete });
        }
    }

    return (
        <Card className={styles.albumCard}>
            <Link href={`/album/${params.album.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.imageWrapper}>
                    <Card.Img variant="top" src={params.mainImageUrl} className={styles.albumImage} />
                </div>
                <Card.Body>
                    <Card.Title className={styles.albumTitle}>{params.album.name}</Card.Title>
                    <Card.Text className={styles.albumDescription}>
                        {params.album.description && params.album.description.length > 100
                            ? `${params.album.description.substring(0, 100)}...`
                            : params.album.description}
                    </Card.Text>
                </Card.Body>
            </Link>
            {user && user.id === params.album.userId && (
                <Card.Body className={styles.actions}>
                    <Button variant="primary" size="sm" href={'/account/editAlbum?id=' + params.album.id}>Edit</Button>{' '}
                    <Button variant="secondary" size="sm" onClick={onDeleteClick}>Delete</Button>
                </Card.Body>
            )}
        </Card>
    )
}

export default AlbumListItem;