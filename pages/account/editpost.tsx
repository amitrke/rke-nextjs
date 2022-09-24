import { Button, Container, Form, Row } from 'react-bootstrap'
import { useUser } from '../../firebase/useUser'
import dynamic from 'next/dynamic'
import UploadFile, { UploadStatusType } from '../../components/storage/UploadFile'
import ToastMsg, { ToastMsgProps } from '../../components/ui/toastMsg'
import { ChangeEvent, useEffect, useState } from 'react'
import { arrayAppend, getDocument, write } from '../../firebase/firestore'
import { useRouter } from 'next/router'
import ShowImage from '../../components/ui/showImage'

const Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

export type PostType = {
  id: string;
  title: string;
  intro: string;
  edState: string;
  updateDate: number;
  images: string[];
  public: boolean;
  userId: string;
}

const EditPost = () => {
  const router = useRouter()
  const { id } = router.query

  const [toasts, setToasts] = useState<ToastMsgProps[]>([]);
  const { user } = useUser()

  const [post, setPost] = useState<PostType>({
    id: "",
    edState: "",
    images: [],
    intro: "",
    updateDate: (new Date()).getTime(),
    public: false,
    title: "",
    userId: ""
  })

  if (id && typeof (id) == "string" && post.id === "") {
    setPost({ ...post, id });
  }

  useEffect(() => {
    if (!post.id) return;
    console.log(`Post id change PostID=${post.id}`);
    loadPost(post.id);
  }, [post.id])

  useEffect(() => {
    if (!user) return
    setPost({ ...post, userId: user.id })
  }, [user]);

  const loadPost = async (postId: string) => {
    const post = await getDocument<PostType>({ path: `posts`, pathSegments: [postId] })
    if (post) {
      setPost(post);
    }
  }

  const toastCallback = async (props: ToastMsgProps) => {
    setToasts([...toasts, props]);
  }

  const onSave = async () => {
    if (post.id) {
      await write({ path: `posts`, existingDocId: post.id, data: post });
      console.log(`Updated document id=${post.id}`)
    } else {
      const doc = await write({ path: `posts`, data: post });
      setPost({ ...post, id: doc.id });
      console.log(`doc id=${doc.id}, path=${doc.path}`)
    }
  }

  const onFileUpload = async (props: UploadStatusType) => {
    if (!props.status) return;
    if (post.id === "") return;
    await arrayAppend({ path: `posts`, existingDocId: post.id, arrayAttribute: "images", newArrayItem: props.filename });
    setPost({ ...post, images: [...post.images, props.filename] })
    console.log(`Updated document id=${post.id}`)
  }

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
                  <Form.Control type="Text" placeholder="Content Title" name='title' value={post.title} onChange={(e) => { setPost({ ...post, title: e.target.value }) }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Intro</Form.Label>
                  <Form.Control as="textarea" rows={3} name='intro' value={post.intro} onChange={(e) => { setPost({ ...post, intro: e.target.value }) }} />
                </Form.Group>
                Images <br />
                {[...post.images].map((x, i) =>
                  <ShowImage size="s" key={x} file={`users/${user.id}/images/${x}`} />
                )}
                <UploadFile toastCallback={toastCallback} disabled={post.id === ""} statusCallback={onFileUpload} />
                Body
                <Editor onEdStateChange={(edState) => { setPost({ ...post, edState }) }} initState={post.edState} />
                <Button variant="primary" onClick={onSave}>
                  Save
                </Button>
                <Form.Check type="checkbox" label="Publish to Everyone" checked={post.public} onChange={(e) => { console.log(e.target.value); setPost({ ...post, public: e.target.value === "on" }) }} />
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