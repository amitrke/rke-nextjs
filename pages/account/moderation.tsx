import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Badge, Card, Col, Container, Form, Modal, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import Head from 'next/head';
import { useAdminStatus } from '../../firebase/useAdminStatus';
import { useUser } from '../../firebase/useUser';
import { getFirebaseAuth } from '../../firebase/initFirebase';
import { getPendingQueueItems } from '../../service/PostService';
import { ModerationQueueItem } from '../../firebase/types';
import { uiDateFormat } from '../../components/ui/uiUtils';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';
import { initApp } from '../../firebase/initFirebase';

const ModerationPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const { isAdmin, loading: adminLoading } = useAdminStatus();

    const [pendingPosts, setPendingPosts] = useState<ModerationQueueItem[]>([]);
    const [pendingAlbums, setPendingAlbums] = useState<ModerationQueueItem[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [migratingLegacy, setMigratingLegacy] = useState(false);

    // Reject modal state
    const [rejectModal, setRejectModal] = useState<{ show: boolean; item: ModerationQueueItem | null }>({ show: false, item: null });
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        if (adminLoading) return;
        if (!isAdmin) {
            router.replace('/myaccount');
            return;
        }
        fetchPending();
    }, [isAdmin, adminLoading]);

    const fetchPending = async () => {
        setLoadingPosts(true);
        setLoadingAlbums(true);
        try {
            const [posts, albums] = await Promise.all([
                getPendingQueueItems('post'),
                getPendingQueueItems('album'),
            ]);
            setPendingPosts(posts);
            setPendingAlbums(albums);
        } finally {
            setLoadingPosts(false);
            setLoadingAlbums(false);
        }
    };

    const getToken = async (): Promise<string> => {
        const auth = getFirebaseAuth();
        return auth.currentUser?.getIdToken() ?? '';
    };

    const callReviewApi = async (itemId: string, itemType: 'post' | 'album', action: 'approve' | 'reject', rejectionReason?: string) => {
        const idToken = await getToken();
        const response = await fetch('/api/reviewContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ itemId, itemType, action, rejectionReason }),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Review action failed');
        }
    };

    const handleApprove = async (item: ModerationQueueItem) => {
        setActionLoading(item.itemId);
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
            setActionLoading(null);
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
        setActionLoading(item.itemId);
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
            setActionLoading(null);
            setRejectReason('');
        }
    };

    // One-time migration: approve all legacy posts/albums that have public=true but no approved field
    const handleMigrateLegacy = async () => {
        setMigratingLegacy(true);
        try {
            const db = getFirestore(initApp());
            const batch = writeBatch(db);
            let count = 0;

            for (const col of ['posts', 'albums']) {
                const snap = await getDocs(
                    collection(db, col)
                );
                snap.forEach((docSnap) => {
                    const data = docSnap.data();
                    if (data.public === true && data.approved === undefined) {
                        batch.update(docSnap.ref, { approved: true });
                        count++;
                    }
                });
            }

            if (count > 0) {
                await batch.commit();
                alert(`Migration complete: ${count} legacy item(s) approved.`);
            } else {
                alert('No legacy items found to migrate.');
            }
        } catch (e) {
            console.error('Migration failed:', e);
            alert('Migration failed. Check console for details.');
        } finally {
            setMigratingLegacy(false);
        }
    };

    if (adminLoading || (user && adminLoading)) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!user || !isAdmin) {
        return null; // redirect in useEffect
    }

    const renderQueueItems = (items: ModerationQueueItem[], loading: boolean, type: 'post' | 'album') => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }
        if (items.length === 0) {
            return (
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5 text-muted">
                        No pending {type}s awaiting review.
                    </Card.Body>
                </Card>
            );
        }
        return (
            <Row>
                {items.map((item) => (
                    <Col md={6} lg={4} key={item.itemId} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title className="fs-6">{item.title || '(Untitled)'}</Card.Title>
                                <Card.Subtitle className="text-muted mb-2 small">By {item.authorName}</Card.Subtitle>
                                <div className="small text-muted">
                                    Submitted: {uiDateFormat(item.submittedAt)}
                                </div>
                            </Card.Body>
                            <Card.Footer className="d-flex gap-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    disabled={actionLoading === item.itemId}
                                    onClick={() => handleApprove(item)}
                                >
                                    {actionLoading === item.itemId ? (
                                        <Spinner as="span" animation="border" size="sm" />
                                    ) : 'Approve'}
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    disabled={actionLoading === item.itemId}
                                    onClick={() => openRejectModal(item)}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="link"
                                    size="sm"
                                    href={type === 'post' ? `/account/editpost?id=${item.itemId}` : `/account/editAlbum?id=${item.itemId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Preview
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Container className="py-4">
            <Head>
                <title>Moderation - Roorkee.org</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">Content Moderation</h2>
                    <p className="text-muted small mb-0">Review and approve or reject pending submissions.</p>
                </div>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={fetchPending}
                >
                    Refresh
                </Button>
            </div>

            <Tabs defaultActiveKey="posts" className="mb-4">
                <Tab
                    eventKey="posts"
                    title={
                        <>
                            Posts{' '}
                            {pendingPosts.length > 0 && (
                                <Badge bg="warning" text="dark" pill>{pendingPosts.length}</Badge>
                            )}
                        </>
                    }
                >
                    {renderQueueItems(pendingPosts, loadingPosts, 'post')}
                </Tab>
                <Tab
                    eventKey="albums"
                    title={
                        <>
                            Albums{' '}
                            {pendingAlbums.length > 0 && (
                                <Badge bg="warning" text="dark" pill>{pendingAlbums.length}</Badge>
                            )}
                        </>
                    }
                >
                    {renderQueueItems(pendingAlbums, loadingAlbums, 'album')}
                </Tab>
            </Tabs>

            {/* Legacy Migration */}
            <Card className="mt-5 border-warning">
                <Card.Header className="bg-warning bg-opacity-10">
                    <strong>One-Time Migration</strong>
                </Card.Header>
                <Card.Body>
                    <p className="text-muted small mb-3">
                        Run this once after deploying the moderation system to approve all pre-existing public posts and albums.
                        This sets <code>approved: true</code> on all items that have <code>public: true</code> but no <code>approved</code> field yet.
                    </p>
                    <Button
                        variant="warning"
                        onClick={handleMigrateLegacy}
                        disabled={migratingLegacy}
                    >
                        {migratingLegacy ? (
                            <><Spinner as="span" animation="border" size="sm" className="me-2" />Migrating…</>
                        ) : 'Approve All Legacy Content'}
                    </Button>
                </Card.Body>
            </Card>

            {/* Reject reason modal */}
            <Modal show={rejectModal.show} onHide={() => setRejectModal({ show: false, item: null })}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject &ldquo;{rejectModal.item?.title}&rdquo;</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Reason (optional — will be shown to the author)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Content does not meet community guidelines."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setRejectModal({ show: false, item: null })}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRejectConfirm}>
                        Confirm Reject
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

ModerationPage.noSSR = true;
export default ModerationPage;
