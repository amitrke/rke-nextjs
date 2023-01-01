import { useEffect, useState } from "react"
import { Button, Card } from "react-bootstrap"
import { deleteDocument } from "../../firebase/firestore"
import { AlbumType } from "../../pages/account/editAlbum"
import { getImageDownloadURL } from "./showImage"
import { ShowModalParams } from "./showModal"

export type AlbumListItemParams = {
    album: AlbumType,
    confirmModalCB: (props: ShowModalParams) => void
}

const AlbumListItem = (params: AlbumListItemParams) => {
    const mainFile = params.album.images && params.album.images.length > 0 ? params.album.images[0] : undefined;
    const authorId = params.album.userId
    const mainImage = mainFile ? `users/${authorId}/images/${mainFile}` : undefined;
    const [mainImageUrl, setMainImageUrl] = useState("/no-image.png");

    useEffect(() => {
        const getImageUrl = async () => {
            try {
                const url = await getImageDownloadURL({ file: mainImage, size: "m" });
                setMainImageUrl(url);
            } catch (error) {
                console.log(`Image ${mainImage} not found`);
            }
        }
        getImageUrl();
    }, [mainImage])

    const onDelete = async (params: any) => {
        await deleteDocument({ path: `albums/${params.itemToDelete}` });
    }

    const onDeleteClick = (itemToDelete: string) => {
        params.confirmModalCB({ show: true, yesCallback: () => onDelete({ itemToDelete }) });
    }

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={mainImageUrl} />
            <Card.Body>
                <Card.Title>{params.album.name}</Card.Title>
                <Card.Text>
                    {params.album.description}
                </Card.Text>
                <Button variant="primary" href={'/account/editAlbum?id=' + params.album.id}>Edit</Button>{' '}
                <Button variant="secondary" onClick={() => onDeleteClick(params.album.id)}>Delete</Button>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">Public: {params.album.public.toString()}</small>
            </Card.Footer>
        </Card>
    )
}

AlbumListItem.noSSR = true;
export default AlbumListItem;