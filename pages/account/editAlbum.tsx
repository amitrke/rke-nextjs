import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import UploadFile, { UploadStatusType } from "../../components/storage/UploadFile";
import ShowImage from "../../components/ui/showImage";
import ToastMsg, { ToastMsgProps } from "../../components/ui/toastMsg";
import { arrayAppend, getDocument, write } from "../../firebase/firestore";
import { useUser } from "../../firebase/useUser";

export type AlbumType = {
    id: string;
    name: string;
    description: string;
    updateDate: Date;
    images: string[];
    public: boolean;
}

const EditAlbum = () => {
    const router = useRouter()
    const { id } = router.query
    const { user } = useUser()

    const [toasts, setToasts] = useState<ToastMsgProps[]>([]);
    const [albumId, setAlbumId] = useState<string>('')

    const [album, setAlbum] = useState<AlbumType>({
        id: '', name: '', description: '', updateDate: new Date(), images: [], public: false
    })

    if (id && typeof (id) == "string" && !albumId) {
        setAlbumId(id);
    }

    const loadAlbum = async(alId) => {
        const albumData = await getDocument<AlbumType>({ path: `users/${user.id}/albums`, pathSegments: [alId] })
        if (albumData) {
            setAlbum(albumData)
        }
    }

    useEffect(() => {
        if (albumId && !album.id) {
            loadAlbum(albumId);
        }
    }, [albumId])

    const onSave = async () => {
        if (albumId === '' && album.id === '') {
            console.log(`Create new album`);
            const doc = await write<AlbumType>({ path: `users/${user.id}/albums`, data: album });
            setAlbumId(doc.id);
            console.log(`doc id=${doc.id}, path=${doc.path}`)
        } else {
            const doc = await write({ path: `users/${user.id}/albums`, existingDocId: albumId, data: album });
            console.log(`Updated document id=${doc.id}`)
        }
    }

    const toastCallback = async (props: ToastMsgProps) => {
        setToasts([...toasts, props]);
    }

    const onFileUpload = async (props: UploadStatusType) => {
        if (!props.status) return;
        if (albumId === '') return;
        await arrayAppend({ path: `users/${user.id}/albums`, existingDocId: albumId, arrayAttribute: "images", newArrayItem: props.filename });
        setAlbum({...album, images: [...album.images, props.filename]})
        console.log(`Updated document id=${albumId}`)
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    Edit Album
                    {[...toasts].map((x, i) =>
                        <ToastMsg key={x.body} header={x.header} body={x.body} />
                    )}
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
                        <Form.Group controlId="editAlbumUploadPic">
                            <UploadFile toastCallback={toastCallback} disabled={albumId === ''} statusCallback={onFileUpload} />
                        </Form.Group>
                        <Form.Group controlId="editAlbumSave">
                            <Button variant="primary" onClick={onSave}>
                                Save
                            </Button>
                            <Form.Check type="checkbox" label="Publish to Everyone" checked={album.public} onChange={(e) => { console.log(e.target.value); setAlbum({ ...album, public: e.target.value === "on" }) }} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    Images
                    {[...album.images].map((x, i) =>
                        <ShowImage size="s" key={x} file={`users/${user.id}/images/${x}`} />
                    )}
                </Col>
            </Row>
        </Container>
    )
}

EditAlbum.noSSR = true;
export default EditAlbum;