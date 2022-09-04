import { useUser } from '../firebase/useUser'
import Button from 'react-bootstrap/Button'
import { Col, Container, Row } from 'react-bootstrap'
import PostList from '../components/ui/postList'

const MyAccount = () => {

  const { user, logout } = useUser()

  if (user) {
    return (
      <>
        <Container>
          <Row>
            <Col>
              Posts
              <Button href="/account/editpost">Add Post</Button>
              <PostList visibility='private' count={5}/>
            </Col>
            <Col>Images
            </Col>
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

MyAccount.noSSR = true;

export default MyAccount;