import { Button, Form } from 'react-bootstrap'
import { useUser } from '../../firebase/useUser'
import dynamic from 'next/dynamic'
import UploadFile from '../../components/storage/UploadFile'
import ToastMsg, { ToastMsgProps } from '../../components/ui/toastMsg'
import { ChangeEvent, useState } from 'react'
import { write } from '../../firebase/firestore'
import { DocumentReference } from 'firebase/firestore'
var Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

type EditPostParams = {
  postId?: string;
}

const EditPost = (params: EditPostParams) => {
  const [toasts, setToasts] = useState<ToastMsgProps[]>([]);
  const { user } = useUser()
  const [title, setTitle] = useState<string>("")
  const [intro, setIntro] = useState<string>("")
  const [docId, setDocId] = useState<string>("");

  const toastCallback = (props: ToastMsgProps) => {
    setToasts([...toasts, props]);
  }

  const onUpdateForm = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget;
    if (name == 'title'){
      setTitle(value);
    }
    if (name == 'intro'){
      setIntro(value);
    }
  }

  const onSave = async() => {
    if (docId) {
      const doc = await write({path: `users/${user.id}/posts`, existingDocId: docId, data: {title, intro}});
      console.log(`Updated document id=${docId}`)
    } else {
      const doc = await write({path: `users/${user.id}/posts`, data: {title, intro}});
      setDocId(doc.id);
      console.log(`doc id=${doc.id}, path=${doc.path}`)
    }
  }

  if (user && typeof window !== 'undefined') {
    return (
      <>
        {[...toasts].map((x, i) =>
          <ToastMsg header={x.header} body={x.body} />
        )}
        <div className="container">
          <div className="row">
            <div className="col col-lg-2 d-none d-md-block border">
              Column 1
            </div>
            <div className="col col-xxl border">
              <Form >
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="Text" placeholder="Content Title" name='title' value={title} onChange={onUpdateForm}/>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Intro</Form.Label>
                  <Form.Control as="textarea" rows={3} name='intro' value={intro} onChange={onUpdateForm}/>
                </Form.Group>

                <UploadFile toastCallback={toastCallback} />

                <Editor />
                <Button variant="primary" onClick={onSave}>
                  Save
                </Button>
              </Form>
            </div>
            <div className="col col-xxl-2 d-none d-xxl-block border">
              Column 3
            </div>
          </div>
        </div>
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