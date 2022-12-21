import { Button, Col, Container, Row } from "react-bootstrap";
import { deleteDocument } from "../../firebase/firestore";
import { PostType } from "../../pages/account/editpost";
import ShowImage from "./showImage";
import { ShowModalParams } from "./showModal";

export type DisplayPostParams = {
    post: PostType
    confirmModalCB: (props: ShowModalParams) => void
}

const PostItem = (params: DisplayPostParams) => {
    const mainFile = params.post.images && params.post.images.length > 0 ? params.post.images[0] : undefined;
    const authorId = params.post.userId
    const mainImage = mainFile ? `users/${authorId}/images/${mainFile}` : undefined;

    const onDelete = async () => {
        await deleteDocument({ path: `posts/${params.post.id}` });
    }

    const onDeleteClick = () => {
        params.confirmModalCB({ show: true, yesCallback: onDelete });
    }

    return (
        <Container className="border">
            <Row>
                <Col>
                    <ShowImage size="s" file={mainImage} />
                </Col>
            </Row>
            <Row className="border-top">
                <Col>
                    {params.post.title}
                </Col>
            </Row>
            <Row className="border-top">
                <Col>
                    Public: {params.post.public.toString()}
                </Col>
                <Col>
                    <Button variant="primary" href={'/account/editpost?id='+params.post.id}>Edit</Button>{' '}
                    <Button variant="secondary" onClick={onDeleteClick}>Delete</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default PostItem;