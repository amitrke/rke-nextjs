import { Form } from 'react-bootstrap'
import { useUser } from '../../firebase/useUser'
import dynamic from 'next/dynamic'
import ImageUpload from '../../components/ui/imageUpload'
import UploadFile from '../../components/storage/UploadFile'

var Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

const EditPost = () => {

  const { user } = useUser()

  if (user) {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col col-lg-2 d-none d-md-block border">
              Column 1
            </div>
            <div className="col col-xxl border">
              <Form >
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="Text" placeholder="Content Title" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Intro</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>

                <UploadFile/>

                <Editor />
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