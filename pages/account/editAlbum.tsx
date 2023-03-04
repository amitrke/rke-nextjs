import { where } from "firebase/firestore";
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
    updateDate: number;
    images: string[];
    public: boolean;
    userId: string;
}

const EditAlbum = () => {
    const router = useRouter()
    const { id } = router.query
    const { user } = useUser()

    const [toasts, setToasts] = useState<ToastMsgProps[]>([]);
    const [albumId, setAlbumId] = useState<string>('')

    const [album, setAlbum] = useState<AlbumType>({
        id: '', name: '', description: '', updateDate: (new Date()).getTime(), images: [], public: false, userId: ''
    })

    if (id && typeof (id) == "string" && !albumId) {
        setAlbumId(id);
    }

    async function loadAlbum (alId) {
        const albumData = await getDocument<AlbumType>({ path: `albums`, pathSegments: [alId], queryConstraints: [where("userId", "==", user.id)] })
        if (albumData) {
            setAlbum(albumData)
        }
    }

    useEffect(() => {
        if (albumId && !album.id) {
            loadAlbum(albumId);
        }
    }, [albumId, album.id])

    useEffect(() => {
        if (!user) return
        setAlbum({ ...album, userId: user.id })
    }, [user]);

    const onSave = async () => {
        if (albumId === '' && album.id === '') {
            console.log(`Create new album`);
            const doc = await write<AlbumType>({ path: `albums`, data: album });
            setAlbumId(doc.id);
            console.log(`doc id=${doc.id}, path=${doc.path}`)
        } else {
            const doc = await write({ path: `albums`, existingDocId: albumId, data: album });
            console.log(`Updated document id=${doc.id}`)
        }
        toastCallback({body: 'Album Updated!', header: "Album"});
    }

    const toastCallback = async (props: ToastMsgProps) => {
        setToasts([...toasts, props]);
    }

    const onFileUpload = async (props: UploadStatusType) => {
        if (!props.status) return;
        if (albumId === '') return;
        await arrayAppend({ path: `albums`, existingDocId: albumId, arrayAttribute: "images", newArrayItem: props.filename });
        setAlbum({ ...album, images: [...album.images, props.filename] })
        console.log(`Updated document id=${albumId}`)
    }

    const onFileDelete = async (image: string) => {
        //Delete image from album
        const newImages = album.images.filter(x => x !== image);
        setAlbum({ ...album, images: newImages })
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
                            <Form.Check type="checkbox" label="Publish to Everyone" checked={album.public} onChange={(e) => { setAlbum({ ...album, public: e.target.checked }) }} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>Images</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    {[...album.images].map((x, i) =>
                        <div style={{ maxWidth: "200px", float: "left" }}>
                            <ShowImage size="s" key={x} file={`users/${user.id}/images/${x}`} />
                            <Button variant="danger" onClick={() => onFileDelete(x)} >Delete</Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

EditAlbum.noSSR = true;
export default EditAlbum;