import { Form } from 'react-bootstrap'
import { useUser } from '../../firebase/useUser'
import dynamic from 'next/dynamic'

var Editor = dynamic(() => import("../../components/ui/richTextEditor"), {
  ssr: false
})

const EditPost = () => {

  const { user } = useUser()

  if (user) {
    return (
      <>
        <div className="container text-center">
          <div className="row">
            <div className="col col-lg-2 border">
              Column
            </div>
            <div className="col col-xxl-auto border">
              Column
            </div>
            <div className="col col-xxl-2 border">
              Column
            </div>
          </div>
        </div>
        <Form >
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Example textarea</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <Editor />
        </Form>

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