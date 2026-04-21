import { useUser } from '../firebase/useUser'
import Button from 'react-bootstrap/Button'
import { Tab, Tabs, Container, Row, Col, Card, Spinner, Badge, Form, Modal } from 'react-bootstrap'
import PostList from '../components/ui/postList'
import { useEffect, useState } from 'react'
import AlbumList from '../components/ui/albumList'
import { getPostsWithDetails, getPendingQueueItems } from '../service/PostService'
import { PostDisplayType, ModerationQueueItem, NotificationType } from '../firebase/types';
import { uiDateFormat } from '../components/ui/uiUtils';
import { AlbumType } from '../pages/account/editAlbum'
import { subscribeToCollectionUpdates, write } from '../firebase/firestore'
import { where } from 'firebase/firestore'
import { getImageBucketUrl } from '../components/ui/showImage2'
import ShowModal, { ShowModalParams } from '../components/ui/showModal'
import Head from 'next/head'
import { useAdminStatus } from '../firebase/useAdminStatus'
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { getFirebaseAuth } from '../firebase/initFirebase';

const MyAccount = () => {
  const { user, logout } = useUser()
  const { isAdmin } = useAdminStatus()
  const [posts, setPosts] = useState<PostDisplayType[]>([]);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [bucketUrlMap, setBucketUrlMap] = useState<{ [key: string]: string }>({});
  const [modalParams, setModalParams] = useState<ShowModalParams>({ show: false, yesCallback: async () => {} });
  const [modalTrigger, setModalTrigger] = useState(new Date());
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [queueStatusMap, setQueueStatusMap] = useState<{ [id: string]: string }>({});
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // Admin moderation state
  const [pendingPosts, setPendingPosts] = useState<ModerationQueueItem[]>([]);
  const [pendingAlbums, setPendingAlbums] = useState<ModerationQueueItem[]>([]);
  const [loadingPendingPosts, setLoadingPendingPosts] = useState(false);
  const [loadingPendingAlbums, setLoadingPendingAlbums] = useState(false);
  const [moderationActionLoading, setModerationActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ show: boolean; item: ModerationQueueItem | null }>({ show: false, item: null });
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState(false);

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

  useEffect(() => {
    if (isAdmin) {
      fetchPendingItems();
    }
  }, [isAdmin]);

  const fetchPendingItems = async () => {
    setLoadingPendingPosts(true);
    setLoadingPendingAlbums(true);
    try {
      const [posts, albums] = await Promise.all([
        getPendingQueueItems('post'),
        getPendingQueueItems('album'),
      ]);
      setPendingPosts(posts);
      setPendingAlbums(albums);
    } finally {
      setLoadingPendingPosts(false);
      setLoadingPendingAlbums(false);
    }
  };

  const getIdToken = async (): Promise<string> => {
    const { getFirebaseAuth } = await import('../firebase/initFirebase');
    const auth = getFirebaseAuth();
    return auth.currentUser?.getIdToken() ?? '';
  };

  const callReviewApi = async (itemId: string, itemType: 'post' | 'album', action: 'approve' | 'reject', rejectionReason?: string) => {
    const idToken = await getIdToken();
    const response = await fetch('/api/reviewContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
      body: JSON.stringify({ itemId, itemType, action, rejectionReason }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Review action failed');
    }
  };

  const handleApprove = async (item: ModerationQueueItem) => {
    setModerationActionLoading(item.itemId);
    try {
      await callReviewApi(item.itemId, item.itemType, 'approve');
      if (item.itemType === 'post') {
        setPendingPosts((prev) => prev.filter((p) => p.itemId !== item.itemId));
      } else {
        setPendingAlbums((prev) => prev.filter((a) => a.itemId !== item.itemId));
      }
    } catch (e) {
      console.error('Approve failed:', e);
    } finally {
      setModerationActionLoading(null);
    }
  };

  const openRejectModal = (item: ModerationQueueItem) => {
    setRejectReason('');
    setRejectModal({ show: true, item });
  };

  const handleRejectConfirm = async () => {
    const item = rejectModal.item;
    if (!item) return;
    setRejectModal({ show: false, item: null });
    setModerationActionLoading(item.itemId);
    try {
      await callReviewApi(item.itemId, item.itemType, 'reject', rejectReason || undefined);
      if (item.itemType === 'post') {
        setPendingPosts((prev) => prev.filter((p) => p.itemId !== item.itemId));
      } else {
        setPendingAlbums((prev) => prev.filter((a) => a.itemId !== item.itemId));
      }
    } catch (e) {
      console.error('Reject failed:', e);
    } finally {
      setModerationActionLoading(null);
      setRejectReason('');
    }
  };

  const markAsRead = async (notifId: string) => {
    await write({ path: 'notifications', existingDocId: notifId, data: { read: true } });
  };

  const markAllRead = async () => {
    await Promise.all(notifications.map(n => write({ path: 'notifications', existingDocId: n.id, data: { read: true } })));
  };

  const getPrimaryProviderId = (): string => {
    const auth = getFirebaseAuth();
    const provider = auth.currentUser?.providerData.find((x) => x.providerId && x.providerId !== 'firebase');
    return provider?.providerId || 'password';
  };

  const reauthenticateCurrentUser = async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No authenticated user found. Please login again.');
    }

    const providerId = getPrimaryProviderId();
    if (providerId === 'password') {
      if (!deletePassword) {
        throw new Error('Please enter your password to confirm account deletion.');
      }
      const credential = EmailAuthProvider.credential(currentUser.email, deletePassword);
      await reauthenticateWithCredential(currentUser, credential);
      return;
    }

    if (providerId === 'google.com') {
      await reauthenticateWithPopup(currentUser, new GoogleAuthProvider());
      return;
    }

    if (providerId === 'github.com') {
      await reauthenticateWithPopup(currentUser, new GithubAuthProvider());
      return;
    }

    if (providerId === 'twitter.com') {
      await reauthenticateWithPopup(currentUser, new TwitterAuthProvider());
      return;
    }

    throw new Error('Unsupported login provider for re-authentication. Please login again and retry.');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Type DELETE to confirm account deletion.');
      return;
    }

    setDeleteError('');
    setDeleteInProgress(true);

    try {
      await reauthenticateCurrentUser();

      const auth = getFirebaseAuth();
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account. Please try again.');
      }

      setDeleteModalOpen(false);
      setDeleteConfirmText('');
      setDeletePassword('');
      try {
        await logout();
      } finally {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete account. Please try again.';
      setDeleteError(message);
    } finally {
      setDeleteInProgress(false);
    }
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
            <Col md={4} className="text-md-end d-flex flex-column gap-2 align-items-end">
              {isAdmin && (
                <Button variant="outline-warning" href="/account/moderation">
                  Moderation Panel
                </Button>
              )}
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

              <hr className="my-4" />
              <h5 className="text-danger mb-2">Danger Zone</h5>
              <p className="text-muted mb-3">
                Delete your account and all associated content (posts, albums, messages, and uploaded images).
                This action cannot be undone.
              </p>
              <Button variant="outline-danger" onClick={() => setDeleteModalOpen(true)}>
                Delete My Account
              </Button>
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
                      <div className="fw-semibold mb-1">
                        {notif.type === 'approved' ? 'Content Approved' : 'Content Rejected'}
                        {' — '}{notif.itemTitle}
                      </div>
                      {notif.rejectionReason && (
                        <div className="text-muted small">Reason: {notif.rejectionReason}</div>
                      )}
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

        {isAdmin && (
          <Tab
            eventKey="moderation"
            title={
              <>
                Moderation{' '}
                {(pendingPosts.length + pendingAlbums.length) > 0 && (
                  <Badge bg="warning" text="dark" pill>{pendingPosts.length + pendingAlbums.length}</Badge>
                )}
              </>
            }
          >
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <p className="text-muted mb-0">Review and approve or reject pending submissions.</p>
              <Button variant="outline-secondary" size="sm" onClick={fetchPendingItems}>
                Refresh
              </Button>
            </div>

            <Tabs defaultActiveKey="mod-posts" className="mb-4">
              <Tab eventKey="mod-posts" title={`Posts (${pendingPosts.length})`}>
                {loadingPendingPosts ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : pendingPosts.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5 text-muted">No pending posts awaiting review.</Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {pendingPosts.map((item) => (
                      <Col md={6} lg={4} key={item.itemId} className="mb-4">
                        <Card className="h-100 shadow-sm">
                          <Card.Body>
                            <Card.Title className="fs-6">{item.title || '(Untitled)'}</Card.Title>
                            <Card.Subtitle className="text-muted mb-2 small">By {item.authorName}</Card.Subtitle>
                            <div className="small text-muted">Submitted: {uiDateFormat(item.submittedAt)}</div>
                          </Card.Body>
                          <Card.Footer className="d-flex gap-2">
                            <Button variant="success" size="sm" disabled={moderationActionLoading === item.itemId} onClick={() => handleApprove(item)}>
                              {moderationActionLoading === item.itemId ? <Spinner as="span" animation="border" size="sm" /> : 'Approve'}
                            </Button>
                            <Button variant="outline-danger" size="sm" disabled={moderationActionLoading === item.itemId} onClick={() => openRejectModal(item)}>
                              Reject
                            </Button>
                            <Button variant="link" size="sm" href={`/account/editpost?id=${item.itemId}`} target="_blank" rel="noopener noreferrer">
                              Preview
                            </Button>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>
              <Tab eventKey="mod-albums" title={`Albums (${pendingAlbums.length})`}>
                {loadingPendingAlbums ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : pendingAlbums.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5 text-muted">No pending albums awaiting review.</Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {pendingAlbums.map((item) => (
                      <Col md={6} lg={4} key={item.itemId} className="mb-4">
                        <Card className="h-100 shadow-sm">
                          <Card.Body>
                            <Card.Title className="fs-6">{item.title || '(Untitled)'}</Card.Title>
                            <Card.Subtitle className="text-muted mb-2 small">By {item.authorName}</Card.Subtitle>
                            <div className="small text-muted">Submitted: {uiDateFormat(item.submittedAt)}</div>
                          </Card.Body>
                          <Card.Footer className="d-flex gap-2">
                            <Button variant="success" size="sm" disabled={moderationActionLoading === item.itemId} onClick={() => handleApprove(item)}>
                              {moderationActionLoading === item.itemId ? <Spinner as="span" animation="border" size="sm" /> : 'Approve'}
                            </Button>
                            <Button variant="outline-danger" size="sm" disabled={moderationActionLoading === item.itemId} onClick={() => openRejectModal(item)}>
                              Reject
                            </Button>
                            <Button variant="link" size="sm" href={`/account/editAlbum?id=${item.itemId}`} target="_blank" rel="noopener noreferrer">
                              Preview
                            </Button>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>
            </Tabs>
          </Tab>
        )}
      </Tabs>

      {/* Reject confirmation modal */}
      <Modal show={rejectModal.show} onHide={() => setRejectModal({ show: false, item: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-2">Rejecting: <strong>{rejectModal.item?.title}</strong></p>
          <Form.Group>
            <Form.Label>Reason (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setRejectModal({ show: false, item: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleRejectConfirm}>Confirm Reject</Button>
        </Modal.Footer>
      </Modal>

      {/* Self-service account deletion modal */}
      <Modal show={deleteModalOpen} onHide={() => !deleteInProgress && setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton={!deleteInProgress}>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            This permanently deletes your account and your content from this platform.
          </p>
          <p className="text-muted mb-3">
            To confirm, type <strong>DELETE</strong> below.
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Confirmation</Form.Label>
            <Form.Control
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              disabled={deleteInProgress}
            />
          </Form.Group>

          {getPrimaryProviderId() === 'password' && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                disabled={deleteInProgress}
              />
              <Form.Text className="text-muted">
                Password is required to confirm this sensitive action.
              </Form.Text>
            </Form.Group>
          )}

          {deleteError && <div className="text-danger small">{deleteError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setDeleteModalOpen(false)}
            disabled={deleteInProgress}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={deleteInProgress}
          >
            {deleteInProgress ? 'Deleting...' : 'Permanently Delete Account'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

MyAccount.noSSR = true;

export default MyAccount;