import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { write } from "../../firebase/firestore";
import { useUser } from "../../firebase/useUser";

export type AlbumType = {
    id: string;
    name: string;
    description: string;
    updateDate: Date;
    pictures: string[];
    public: boolean;
}

const EditAlbum = () => {

    const { user } = useUser()

    const [albumId, setAlbumId] = useState<string>('')

    const [album, setAlbum] = useState<AlbumType>({
        id: '', name: '', description: '', updateDate: new Date(), pictures: [], public: false
    })

    const onSave = async () => {
        if (albumId === '') {
            const doc = await write<AlbumType>({ path: `users/${user.id}/albums`, data: album });
            setAlbumId(doc.id);
            console.log(`doc id=${doc.id}, path=${doc.path}`)
        } else {
            const doc = await write({ path: `users/${user.id}/albums`, existingDocId: albumId, data: album });
            console.log(`Updated document id=${doc.id}`)
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    Edit Album
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group controlId="editAlbumName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="Text" name='name' value={album.name} onChange={(e) => { setAlbum({ ...album, name: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group controlId="editAlbumDesc">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name='description' value={album.description} onChange={(e) => { setAlbum({ ...album, description: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group controlId="editAlbumSave">
                            <Button variant="primary" onClick={onSave}>
                                Save
                            </Button>
                            <Form.Check type="checkbox" label="Publish to Everyone" onChange={(e) => { console.log(e.target.value); setAlbum({ ...album, public: e.target.value === "checked" }) }} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    Images
                </Col>
            </Row>
        </Container>
    )
}

EditAlbum.noSSR = true;
export default EditAlbum;