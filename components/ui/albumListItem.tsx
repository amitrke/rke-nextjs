import { Button, Card } from "react-bootstrap";
import Link from 'next/link';
import { useUser } from "../../firebase/useUser";
import { deleteDocument } from "../../firebase/firestore";
import { AlbumType } from "../../pages/account/editAlbum";
import { ShowModalParams } from "./showModal";

export type DisplayAlbumParams = {
    album: AlbumType
    confirmModalCB: (props: ShowModalParams) => void
    mainImageUrl: string
}

const AlbumListItem = (params: DisplayAlbumParams) => {
    const { user } = useUser();

    const onDelete = async () => {
        await deleteDocument({ path: `albums/${params.album.id}` });
    }

    const onDeleteClick = () => {
        params.confirmModalCB({ show: true, yesCallback: onDelete });
    }

    return (
        <Card style={{ width: '18rem' }}>
            <Link href={`/album/${params.album.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Img variant="top" src={params.mainImageUrl} />
                <Card.Body>
                    <Card.Title>{params.album.name}</Card.Title>
                    <Card.Text>
                        {params.album.description}
                    </Card.Text>
                </Card.Body>
            </Link>
            <Card.Body>
                <div className={user && user.id === params.album.userId ? '' : 'd-none'}>
                    <Button variant="primary" href={'/account/editAlbum?id=' + params.album.id}>Edit</Button>{' '}
                    <Button variant="secondary" onClick={onDeleteClick}>Delete</Button>
                </div>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">Public: {params.album.public.toString()}</small>
            </Card.Footer>
        </Card>
    )
}

export default AlbumListItem;