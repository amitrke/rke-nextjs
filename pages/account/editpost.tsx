import { Button, Container, Form, Row } from 'react-bootstrap'
import { useUser } from '../../firebase/useUser'
import dynamic from 'next/dynamic'
import UploadFile, { UploadStatusType } from '../../components/storage/UploadFile'
import ToastMsg, { ToastMsgProps } from '../../components/ui/toastMsg'
import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { arrayAppend, getDocument, write } from '../../firebase/firestore'
import { useRouter } from 'next/router'
import ShowImage from '../../components/ui/showImage'
import Spinner from 'react-bootstrap/Spinner';
import * as Slugify from 'slugify'
import { getPostBySlug } from '../../service/PostService'

const Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

import { PostType } from '../../firebase/types';

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
    userId: "",
    category: "town",
    slug: ""
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
      if (!post.id) post.id = postId;
      setPost(post);
    }
  }

  const toastCallback = async (props: ToastMsgProps) => {
    setToasts([...toasts, props]);
  }

  const onSave = async (element: BaseSyntheticEvent) => {
    const button: HTMLElement = element.currentTarget;
    const spinner = button.querySelector('.spinner-border');
    if (spinner) spinner.classList.remove('visually-hidden');
    const slug = Slugify.default(post.title, { lower: true, strict: true });
    setPost({ ...post, slug });
    
    if (post.public) {
      const postSearch = await getPostBySlug(post.category, slug);
      if (postSearch && postSearch.id !== post.id) {
        toastCallback({ header: "Error", body: "Post with same title already exists" });
        if (spinner) spinner.classList.add('visually-hidden');
        return;
      }
    }

    if (post.id) {
      await write({ path: `posts`, existingDocId: post.id, data: post });
      console.log(`Updated document id=${post.id}`)
    } else {
      const doc = await write({ path: `posts`, data: post });
      setPost({ ...post, id: doc.id });
      console.log(`doc id=${doc.id}`)
    }
    if (spinner) spinner.classList.add('visually-hidden');
  }

  const onFileUpload = async (props: UploadStatusType) => {
    if (!props.status) return;
    if (post.id === "") return;
    await arrayAppend({ path: `posts`, existingDocId: post.id, arrayAttribute: "images", newArrayItem: props.filename });
    setPost({ ...post, images: [...post.images, props.filename] })
    console.log(`Updated document id=${post.id}`)
  }

  return (
    <>
      {[...toasts].map((x) =>
        <ToastMsg key={x.body} header={x.header} body={x.body} />
      )}
      <Container fluid>
        <Row className={!user ? 'hidden' : undefined}>
          <div className="col col-lg-2 d-none d-md-block border">
            Column 1
          </div>
          <div className="col col-xxl border">
            <Form >
              <Form.Group controlId="editForm.title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" placeholder="Content Title" name='title' value={post.title} onChange={(e) => { setPost({ ...post, title: e.target.value }) }} />
              </Form.Group>
              <Form.Group controlId="editForm.intro">
                <Form.Label>Intro</Form.Label>
                <Form.Control as="textarea" rows={3} name='intro' value={post.intro} onChange={(e) => { setPost({ ...post, intro: e.target.value }) }} />
              </Form.Group>
              <Form.Group controlId="editForm.category">
                <Form.Label>Category</Form.Label>
                <Form.Select value={post.category}
                  onChange={(e) => { setPost({ ...post, category: e.target.value }) }}>
                  <option value={"town"}>Town</option>
                  <option value={"blog"}>Blog</option>
                  <option value={"recipe"}>Recipe</option>
                  <option value={"event"}>Event</option>
                  <option value={"news"}>News</option>
                  <option value={"business"}>Business</option>
                </Form.Select>
              </Form.Group>
              Images <br />
              {[...post.images].map((x) =>
                <ShowImage size="s" key={x} file={`users/${user.id}/images/${x}`} />
              )}
              <UploadFile toastCallback={toastCallback} disabled={post.id === ""} statusCallback={onFileUpload} />
              Body
              <Editor
                key={post.id}
                onEdStateChange={(edState) => { setPost({ ...post, edState }) }}
                initState={post.edState}
              />
              <Button variant="primary" onClick={(element) => onSave(element)}>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="visually-hidden"
                />
                <span>Save</span>
              </Button>
              <Form.Check type="checkbox" label="Publish to Everyone" checked={post.public} onChange={(e) => { setPost({ ...post, public: e.target.checked }) }} />
            </Form>
          </div>
          <div className="col col-xxl-2 d-none d-xxl-block border">
            Column 3
          </div>
        </Row>
        <Row className={user ? 'hidden' : undefined}>
          <p>Please login!</p>
        </Row>
      </Container>
    </>
  )
}

EditPost.noSSR = true;

export default EditPost;