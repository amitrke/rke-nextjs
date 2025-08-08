import { useUser } from '../firebase/useUser'
import Button from 'react-bootstrap/Button'
import { Tab, Tabs } from 'react-bootstrap'
import PostList from '../components/ui/postList'
import { useEffect, useState } from 'react'
import AlbumList from '../components/ui/albumList'
import { getPostsWithDetails } from '../service/PostService'
import { PostDisplayType } from '../firebase/types';
import { AlbumType } from '../pages/account/editAlbum'
import { subscribeToCollectionUpdates } from '../firebase/firestore'
import { where } from 'firebase/firestore'
import { getImageBucketUrl } from '../components/ui/showImage2'
import ShowModal, { ShowModalParams } from '../components/ui/showModal'

const MyAccount = () => {
  const { user, logout } = useUser()
  const [posts, setPosts] = useState<PostDisplayType[]>([]);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [bucketUrlMap, setBucketUrlMap] = useState<{ [key: string]: string }>({});
  const [modalParams, setModalParams] = useState<ShowModalParams>({ show: false, yesCallback: async () => {} });
  const [showModal, setShowModal] = useState(new Date());

  const confirmModalCB = (params: ShowModalParams) => {
    setShowModal(new Date());
    setModalParams(params);
  }

  useEffect(() => {
    if (user) {
      getPostsWithDetails({ userId: user.id, photoSize: 's' }).then((posts) => {
        setPosts(posts);
      });
      subscribeToCollectionUpdates<AlbumType>({ 
        path: `albums`, 
        updateCB: (newAlbums) => {
          setAlbums(newAlbums);
          const newBucketUrlMap = {};
          newAlbums.forEach(x => {
            if (x.images && x.images.length > 0) {
              const url = getImageBucketUrl(x.images[0], 's', x.userId);
              newBucketUrlMap[x.id] = url;
            }
          });
          setBucketUrlMap(newBucketUrlMap);
        }, 
        queryConstraints: [where("userId", "==", user.id)] 
      })
    }
  }, [user]);

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
          <PostList posts={posts} confirmModalCB={confirmModalCB} layout="cards" />
        </Tab>
        <Tab eventKey="albums" title="Albums" className='w-100'>
          <Button href="/account/editAlbum">Add Photoalbum</Button>
          <AlbumList albums={albums} bucketUrlMap={bucketUrlMap} confirmModalCB={confirmModalCB} />
        </Tab>
      </Tabs>
      <p className={user ? 'hidden' : undefined}>Please login!</p>
      <Button className={!user ? 'hidden' : undefined} onClick={logout}>Logout</Button>
    </>
  )
}

MyAccount.noSSR = true;

export default MyAccount;