import { useUser } from '../firebase/useUser'
import Button from 'react-bootstrap/Button'
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap'
import PostList from '../components/ui/postList'
import { useState } from 'react'
import ShowModal, { ShowModalParams } from '../components/ui/showModal'
import AlbumList from '../components/ui/albumList'

const MyAccount = () => {
  const modalYesCB = async () => {
    console.log(`Fake CB`)
  }

  const { user, logout } = useUser()
  const [modalParams, setModalParams] = useState<ShowModalParams>({ show: false, yesCallback: modalYesCB });
  const [showModal, setShowModal] = useState(new Date());

  const confirmModalCB = (params: ShowModalParams) => {
    setShowModal(new Date());
    setModalParams(params);
  }

  return (
    <>
      <ShowModal show={modalParams.show} changeTrigger={showModal} yesCallback={modalParams.yesCallback} />
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className={!user ? 'hidden' : 'mb-3 w-100'}
        fill justify
      >
        <Tab eventKey="profile" title="Profile" className='w-100'>
          Profile Tab
        </Tab>
        <Tab eventKey="posts" title="Posts" className='w-100'>
          <Button href="/account/editpost">Create a new post</Button>
          <PostList visibility='private' count={5} confirmModalCB={confirmModalCB} />
        </Tab>
        <Tab eventKey="albums" title="Albums" className='w-100'>
          <Button href="/account/editAlbum">Add Photoalbum</Button>
          <AlbumList publicOnly={false} count={5} confirmModalCB={confirmModalCB} />
        </Tab>
      </Tabs>
      <p className={user ? 'hidden' : undefined}>Please login!</p>
      <Button className={!user ? 'hidden' : undefined} onClick={logout}>Logout</Button>
    </>
  )
}

MyAccount.noSSR = true;

export default MyAccount;