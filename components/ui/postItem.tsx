import { Button, Col, Container, Row } from "react-bootstrap";
import ShowImage from "./showImage";

export type DisplayPostParams = {
    post: PostType
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
                    <Button variant="secondary">Delete</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default PostItem;