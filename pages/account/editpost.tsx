import { Button, Container, Form, Row, Spinner } from '../../components/ui/tw'
import { useUser } from '../../firebase/useUser'
import { useAdminStatus } from '../../firebase/useAdminStatus'
import { getFirebaseAuth } from '../../firebase/initFirebase'
import dynamic from 'next/dynamic'
import UploadFile, { UploadStatusType } from '../../components/storage/UploadFile'
import ToastMsg, { ToastMsgProps } from '../../components/ui/toastMsg'
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'
import { arrayAppend, getDocument, write } from '../../firebase/firestore'
import { useRouter } from 'next/router'
import ShowImage from '../../components/ui/showImage'
import * as Slugify from 'slugify'
import { getPostBySlug } from '../../service/PostService'

const Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

import { PostType } from '../../firebase/types';

const postJson = async (url: string, body: unknown): Promise<Response> => {
  const idToken = await getFirebaseAuth().currentUser?.getIdToken();
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
    body: JSON.stringify(body),
  });
}

const submitPostForReview = async (postId: string): Promise<'ok' | 'failed'> => {
  try {
    const response = await postJson('/api/submitForReview', { itemId: postId, itemType: 'post' });
    return response.ok ? 'ok' : 'failed';
  } catch {
    return 'failed';
  }
}

// Returns false if the refresh call failed or any page couldn't be refreshed.
const refreshLivePages = async (postId: string, previousPath?: string): Promise<boolean> => {
  try {
    const response = await postJson('/api/revalidatePost', { postId, previousPath });
    if (!response.ok) return false;
    const result = await response.json() as { failed?: string[] };
    return (result.failed?.length ?? 0) === 0;
  } catch {
    return false;
  }
}

const EditPost = () => {
  const router = useRouter()
  const { id } = router.query

  const [toasts, setToasts] = useState<ToastMsgProps[]>([]);
  const { user } = useUser()
  const { isAdmin } = useAdminStatus()

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

  // Public URL of the post as last saved, so a title/category change can also
  // refresh the old URL's cached page.
  const savedPathRef = useRef<string | undefined>(undefined);

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
    try {
      const post = await getDocument<PostType>({ path: `posts`, pathSegments: [postId] });
      if (post) {
        if (!post.id) post.id = postId;
        savedPathRef.current = post.slug ? `/post/${post.category}/${post.slug}` : undefined;
        setPost(post);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      toastCallback({ header: "Error", body: "Failed to load post. Please try again." });
    }
  }

  const toastCallback = async (props: ToastMsgProps) => {
    setToasts([...toasts, props]);
  }

  const onSave = async (element: BaseSyntheticEvent) => {
    const button: HTMLElement = element.currentTarget;
    const spinner = button.querySelector('.spinner-border');
    if (spinner) spinner.classList.remove('hidden');
    const slug = Slugify.default(post.title, { lower: true, strict: true });
    setPost({ ...post, slug });
    
    if (post.public) {
      const postSearch = await getPostBySlug(post.category, slug);
      if (postSearch && postSearch.id !== post.id) {
        toastCallback({ header: "Error", body: "Post with same title already exists" });
        if (spinner) spinner.classList.add('hidden');
        return;
      }
    }

    // Write the freshly computed slug (setPost above won't update `post` until
    // the next render). Admins skip moderation, so their public posts are
    // approved directly; otherwise they'd never appear on public pages.
    const data = post.public && isAdmin ? { ...post, slug, approved: true } : { ...post, slug };

    let savedId = post.id;
    if (post.id) {
      await write({ path: `posts`, existingDocId: post.id, data });
      console.log(`Updated document id=${post.id}`);
    } else {
      const doc = await write({ path: `posts`, data });
      savedId = doc.id;
      setPost({ ...data, id: doc.id });
      console.log(`doc id=${doc.id}`);
    }

    // If user wants this public and is not an admin, submit for moderation
    if (post.public && !isAdmin && savedId) {
      const result = await submitPostForReview(savedId);
      toastCallback(result === 'ok'
        ? { header: "Submitted", body: "Your post has been submitted for review. It will be visible once approved by a moderator." }
        : { header: "Notice", body: "Post saved. Could not submit for review — please try again." });
    }

    // Refresh the live site's cached pages for this post so the change shows
    // up immediately rather than after the ISR revalidate period.
    if (savedId) {
      const previousPath = savedPathRef.current;
      savedPathRef.current = `/post/${data.category}/${slug}`;
      if (!(await refreshLivePages(savedId, previousPath))) {
        toastCallback({ header: "Notice", body: "Post saved, but the live page may take a while to update." });
      }
    }

    if (spinner) spinner.classList.add('hidden');
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
        <Row className={!user ? 'hidden' : 'justify-center'}>
          <div className="w-full md:basis-2/3 md:max-w-[66.666667%]">
            <h2>Create or Edit a Post</h2>
            <Form>
              <Form.Group controlId="editForm.title" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Content Title" name='title' value={post.title} onChange={(e) => { setPost({ ...post, title: e.target.value }) }} />
              </Form.Group>
              <Form.Group controlId="editForm.intro" className="mb-3">
                <Form.Label>Intro</Form.Label>
                <Form.Control as="textarea" rows={3} name='intro' value={post.intro} onChange={(e) => { setPost({ ...post, intro: e.target.value }) }} />
              </Form.Group>
              <Form.Group controlId="editForm.category" className="mb-3">
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
              <h3 className="mt-4">Content</h3>
              <hr />
              <h5>Images</h5>
              {[...post.images].map((x) =>
                <ShowImage size="s" key={x} file={`users/${user.id}/images/${x}`} />
              )}
              <UploadFile toastCallback={toastCallback} disabled={post.id === ""} statusCallback={onFileUpload} />
              <h5 className="mt-3">Body</h5>
              <Editor
                key={post.id}
                onEdStateChange={(edState) => { setPost({ ...post, edState }) }}
                initState={post.edState}
              />
              <div className="mt-4 flex items-center justify-between">
                <Button variant="primary" onClick={(element) => onSave(element)}>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="hidden"
                  />
                  <span>Save</span>
                </Button>
                <Form.Check type="checkbox" label="Publish to Everyone" checked={post.public} onChange={(e) => { setPost({ ...post, public: e.target.checked }) }} />
              </div>
            </Form>
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