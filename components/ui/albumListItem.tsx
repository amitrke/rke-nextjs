import { Badge, Button, Card } from "./tw";
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
    queueStatus?: string
}

const AlbumStatusBadge = ({ album, queueStatus }: { album: AlbumType; queueStatus?: string }) => {
    if (album.approved === true) {
        return <Badge bg="success">Published</Badge>;
    }
    if (album.public && queueStatus === 'rejected') {
        return <Badge bg="danger">Rejected</Badge>;
    }
    if (album.public) {
        return <Badge bg="warning" text="dark">Pending Review</Badge>;
    }
    return <Badge bg="secondary">Draft</Badge>;
};

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
                    <Button variant="secondary" size="sm" onClick={onDeleteClick}>Delete</Button>{' '}
                    {params.confirmModalCB && (
                        <AlbumStatusBadge album={params.album} queueStatus={params.queueStatus} />
                    )}
                </Card.Body>
            )}
        </Card>
    )
}

export default AlbumListItem;