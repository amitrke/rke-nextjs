import { useUser } from '../firebase/useUser'
import Button from 'react-bootstrap/Button'
import { Tab, Tabs, Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap'
import PostList from '../components/ui/postList'
import { useEffect, useState } from 'react'
import AlbumList from '../components/ui/albumList'
import { getPostsWithDetails } from '../service/PostService'
import { PostDisplayType, ModerationQueueItem, NotificationType } from '../firebase/types';
import { AlbumType } from '../pages/account/editAlbum'
import { subscribeToCollectionUpdates, write } from '../firebase/firestore'
import { where } from 'firebase/firestore'
import { getImageBucketUrl } from '../components/ui/showImage2'
import ShowModal, { ShowModalParams } from '../components/ui/showModal'
import Head from 'next/head'

const MyAccount = () => {
  const { user, logout } = useUser()
  const [posts, setPosts] = useState<PostDisplayType[]>([]);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [bucketUrlMap, setBucketUrlMap] = useState<{ [key: string]: string }>({});
  const [modalParams, setModalParams] = useState<ShowModalParams>({ show: false, yesCallback: async () => {} });
  const [modalTrigger, setModalTrigger] = useState(new Date());
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [queueStatusMap, setQueueStatusMap] = useState<{ [id: string]: string }>({});
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const confirmModalCB = (params: ShowModalParams) => {
    setModalTrigger(new Date());
    setModalParams(params);
  }

  useEffect(() => {
    if (user) {
      setIsLoadingPosts(true);
      getPostsWithDetails({ userId: user.id, photoSize: 's' })
        .then((posts) => {
          setPosts(posts);
        })
        .finally(() => {
          setIsLoadingPosts(false);
        });

      setIsLoadingAlbums(true);
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
          setIsLoadingAlbums(false);
        },
        queryConstraints: [where("userId", "==", user.id)]
      });

      subscribeToCollectionUpdates<ModerationQueueItem>({
        path: 'moderationQueue',
        updateCB: (items) => {
          const map: { [id: string]: string } = {};
          items.forEach(i => { map[i.itemId] = i.status; });
          setQueueStatusMap(map);
        },
        queryConstraints: [where("userId", "==", user.id)]
      });

      subscribeToCollectionUpdates<NotificationType>({
        path: 'notifications',
        updateCB: (notifs) => setNotifications(notifs),
        queryConstraints: [where("userId", "==", user.id), where("read", "==", false)]
      });
    }
  }, [user]);

  const markAsRead = async (notifId: string) => {
    await write({ path: 'notifications', existingDocId: notifId, data: { read: true } });
  };

  const markAllRead = async () => {
    await Promise.all(notifications.map(n => write({ path: 'notifications', existingDocId: n.id, data: { read: true } })));
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Head>
          <title>My Account - Roorkee.org</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="text-center shadow-sm">
              <Card.Body className="p-5">
                <h3 className="mb-3">Please Login</h3>
                <p className="text-muted mb-4">You need to be logged in to access your account.</p>
                <Button href="/auth" variant="primary">Go to Login</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Head>
        <title>My Account - {user.name} - Roorkee.org</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <ShowModal show={modalParams.show} changeTrigger={modalTrigger} yesCallback={modalParams.yesCallback} />

      {/* Profile Header */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center mb-3 mb-md-0">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: '80px', height: '80px', fontSize: '32px', fontWeight: 'bold' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="mb-1">{user.name}</h2>
                  <p className="text-muted mb-2">{user.email}</p>
                  <div className="d-flex gap-2">
                    <Badge bg="secondary" pill>{posts.length} Posts</Badge>
                    <Badge bg="secondary" pill>{albums.length} Albums</Badge>
                    {notifications.length > 0 && (
                      <Badge bg="danger" pill>{notifications.length} Notification{notifications.length !== 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-danger" onClick={logout}>
                Logout
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="profile" id="account-tabs" className="mb-4" fill>
        <Tab eventKey="profile" title="Profile">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-3">Profile Information</h5>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Name</label>
                    <p className="fw-semibold">{user.name}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Email</label>
                    <p className="fw-semibold">{user.email}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Total Posts</label>
                    <p className="fw-semibold">{posts.length}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Total Albums</label>
                    <p className="fw-semibold">{albums.length}</p>
                  </div>
                </Col>
              </Row>
              <hr />
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Button href="/account/editpost" variant="primary">
                  Create New Post
                </Button>
                <Button href="/account/editAlbum" variant="outline-primary">
                  Add Photo Album
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="posts" title={`Posts (${posts.length})`}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0">Manage your posts - edit or delete them.</p>
            <Button href="/account/editpost" variant="primary" size="sm">
              + New Post
            </Button>
          </div>

          {isLoadingPosts ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <h5 className="text-muted mb-3">No posts yet</h5>
                <p className="text-muted mb-4">Start sharing your stories with the community!</p>
                <Button href="/account/editpost" variant="primary">
                  Create Your First Post
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <PostList posts={posts} confirmModalCB={confirmModalCB} layout="cards" queueStatusMap={queueStatusMap} />
          )}
        </Tab>

        <Tab eventKey="albums" title={`Albums (${albums.length})`}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0">Manage your photo albums.</p>
            <Button href="/account/editAlbum" variant="primary" size="sm">
              + New Album
            </Button>
          </div>

          {isLoadingAlbums ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3">Loading albums...</p>
            </div>
          ) : albums.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <h5 className="text-muted mb-3">No albums yet</h5>
                <p className="text-muted mb-4">Create your first photo album to share memories!</p>
                <Button href="/account/editAlbum" variant="primary">
                  Create Your First Album
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <AlbumList albums={albums} bucketUrlMap={bucketUrlMap} confirmModalCB={confirmModalCB} queueStatusMap={queueStatusMap} />
          )}
        </Tab>
        <Tab
          eventKey="notifications"
          title={
            <>
              Notifications{' '}
              {notifications.length > 0 && (
                <Badge bg="danger" pill>{notifications.length}</Badge>
              )}
            </>
          }
        >
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0">
              {notifications.length === 0 ? 'No unread notifications.' : `${notifications.length} unread notification${notifications.length !== 1 ? 's' : ''}.`}
            </p>
            {notifications.length > 0 && (
              <Button variant="outline-secondary" size="sm" onClick={markAllRead}>
                Mark all as read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5 text-muted">
                You&apos;re all caught up!
              </Card.Body>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-3">
              {notifications.map((notif) => (
                <Card key={notif.id} className="border-0 shadow-sm">
                  <Card.Body className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold mb-1">{notif.title}</div>
                      <div className="text-muted small">{notif.body}</div>
                    </div>
                    <Button variant="outline-secondary" size="sm" className="ms-3 flex-shrink-0" onClick={() => markAsRead(notif.id)}>
                      Dismiss
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Tab>
      </Tabs>
    </Container>
  )
}

MyAccount.noSSR = true;

export default MyAccount;