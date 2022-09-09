import { Button, Container, Form, Row } from 'react-bootstrap'
import { useUser } from '../../firebase/useUser'
import dynamic from 'next/dynamic'
import UploadFile, { UploadStatusType } from '../../components/storage/UploadFile'
import ToastMsg, { ToastMsgProps } from '../../components/ui/toastMsg'
import { ChangeEvent, useEffect, useState } from 'react'
import { arrayAppend, getDocument, queryOnce, write } from '../../firebase/firestore'
import { useRouter } from 'next/router'
import { PostType } from '../../components/ui/postItem'
import ShowImage from '../../components/ui/showImage'

const Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

const EditPost = () => {
  const router = useRouter()
  const { id } = router.query
  console.log(`PostID=${id}`);

  const DOC_STATE_NEW = "";
  const [toasts, setToasts] = useState<ToastMsgProps[]>([]);
  const { user } = useUser()
  const [pId, setPId] = useState<string>();
  const [title, setTitle] = useState<string>("")
  const [intro, setIntro] = useState<string>("")
  const [docId, setDocId] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [docState, setDocState] = useState<string>(DOC_STATE_NEW);

  if (id && typeof(id) == "string" && !pId) {
    setPId(id);
  }

  useEffect(() => {
    if (!pId) return;
    console.log(`pId change PostID=${pId}`);
    loadPost(pId);
  }, [pId])

  const loadPost = async (postId: string) => {
    const post = await getDocument<PostType>({ path: `users/${user.id}/posts`, pathSegments: [postId] })
    if (post) {
      setTitle(post.title)
      setIntro(post.intro)
      setImages(post.images)
      setDocId(post.id)
    }
  }

  

  const toastCallback = async (props: ToastMsgProps) => {
    setToasts([...toasts, props]);
  }

  const onUpdateForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (name == 'title') {
      setTitle(value);
    }
    if (name == 'intro') {
      setIntro(value);
    }
  }

  const onSave = async () => {
    if (docId) {
      const doc = await write({ path: `users/${user.id}/posts`, existingDocId: docId, data: { title, intro } });
      console.log(`Updated document id=${docId}`)
    } else {
      const doc = await write({ path: `users/${user.id}/posts`, data: { title, intro } });
      setDocId(doc.id);
      console.log(`doc id=${doc.id}, path=${doc.path}`)
    }
  }

  const onFileUpload = async (props: UploadStatusType) => {
    if (!props.status) return;
    if (docState === DOC_STATE_NEW) return;
    await arrayAppend({ path: `users/${user.id}/posts`, existingDocId: docId, arrayAttribute: "images", newArrayItem: props.filename });
    setImages([...images, props.filename])
    console.log(`Updated document id=${docId}`)
  }

  useEffect(() => {
    if (!docId) return;
    if (docId.length < 1) return;
    if (docState !== DOC_STATE_NEW) return;
    setDocState("Draft");
  }, [docId])

  if (user && typeof window !== 'undefined') {
    return (
      <>
        {[...toasts].map((x, i) =>
          <ToastMsg key={x.body} header={x.header} body={x.body} />
        )}
        <Container fluid>
          <Row>
            <div className="col col-lg-2 d-none d-md-block border">
              Column 1
            </div>
            <div className="col col-xxl border">
              <Form >
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="Text" placeholder="Content Title" name='title' value={title} onChange={onUpdateForm} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Intro</Form.Label>
                  <Form.Control as="textarea" rows={3} name='intro' value={intro} onChange={onUpdateForm} />
                </Form.Group>
                Images
                {[...images].map((x, i) =>
                  <ShowImage size="s" key={x} file={`users/${user.id}/images/${x}`} />
                )}
                <UploadFile toastCallback={toastCallback} disabled={docState == DOC_STATE_NEW} statusCallback={onFileUpload} />
                Body
                <Editor />
                <Button variant="primary" onClick={onSave}>
                  Save
                </Button>
                State: {docState}
              </Form>
            </div>
            <div className="col col-xxl-2 d-none d-xxl-block border">
              Column 3
            </div>
          </Row>
        </Container>
      </>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
}

EditPost.noSSR = true;

export default EditPost;