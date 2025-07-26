import { Button, Card } from "react-bootstrap";
import { deleteDocument } from "../../firebase/firestore";
import { PostType } from "../../pages/account/editpost";
import { ShowModalParams } from "./showModal";

export type DisplayPostParams = {
    post: PostType
    confirmModalCB: (props: ShowModalParams) => void
}

const PostItem = (params: DisplayPostParams) => {
    const mainFile = params.post.images && params.post.images.length > 0 ? params.post.images[0] : undefined;

    const onDelete = async () => {
        await deleteDocument({ path: `posts/${params.post.id}` });
    }

    const onDeleteClick = () => {
        params.confirmModalCB({ show: true, yesCallback: onDelete });
    }

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={mainFile} />
            <Card.Body>
                <Card.Title>{params.post.title}</Card.Title>
                <Card.Text>
                    {params.post.intro}
                </Card.Text>
                <Button variant="primary" href={'/account/editpost?id=' + params.post.id}>Edit</Button>{' '}
                <Button variant="secondary" onClick={onDeleteClick}>Delete</Button>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">Public: {params.post.public.toString()}</small>
            </Card.Footer>
        </Card>
    )
}

export default PostItem;