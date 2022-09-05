import { Button, Col, Container, Row } from "react-bootstrap";
import { deleteDocument } from "../../firebase/firestore";
import ShowImage from "./showImage";
import { ShowModalParams } from "./showModal";

export type DisplayPostParams = {
    post: PostType
    confirmModalCB: (props: ShowModalParams) => void
}

export type PostType = {
    id: string;
    path: string;
    title: string;
    intro: string;
    body: string;
    images: string[];
}

// export const postConverter = {
//     toFirestore: (post: PostType) => {
//         return {
//             title: post.title,
//             intro: post.intro,
//             body: post.body,
//             images: post.images
//         };
//     },
//     fromFirestore: (snapshot, options): PostType => {
//         const data = snapshot.data(options);
//         return ({ title: data.title, body: data.body, intro: data.intro, images: data.images });
//     }
// };

const PostItem = (params: DisplayPostParams) => {
    const mainFile = params.post.images && params.post.images.length > 0 ? params.post.images[0] : undefined;
    const authorId = params.post.path.split("/")[1];
    const mainImage = mainFile ? `users/${authorId}/images/${mainFile}` : undefined;

    const onDelete = async () => {
        await deleteDocument({ path: params.post.path });
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
                    State: Draft
                </Col>
                <Col>
                    <Button variant="primary">Edit</Button>{' '}
                    <Button variant="secondary" onClick={onDeleteClick}>Delete</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default PostItem;