import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { Col, Container, Image, Row } from "../../../../components/ui/tw";
import HeadTag from "../../../../components/ui/headTag";
import RecentPostsBox from "../../../../components/ui/recentPostsBox";
import { uiDateFormat } from "../../../../components/ui/uiUtils";
import { adminGetDocument, getAdminFirestore } from "../../../../firebase/firebaseAdmin";
import { User, PostType } from "../../../../firebase/types";
import { getPostsAdmin } from "../../../../service/PostServiceAdmin";
import type { AlbumType } from "../../../account/editAlbum";

type UserPropType = {
    user: User,
    posts: PostType[],
    albums: AlbumType[],
    recentPosts: PostType[],
    cacheCreatedAt?: string;
}

export async function getStaticPaths() {
    const db = getAdminFirestore();
    const snapshot = await db.collection('users').get();
    const paths = snapshot.docs.map(doc => ({ params: { userid: doc.id } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

export const getStaticProps = (async (context) => {
    const userId = context.params.userid as string;
    const db = getAdminFirestore();
    const userPromise = adminGetDocument<User>('users', userId);
    const postsPromise = db.collection('posts')
        .where('public', '==', true)
        .where('userId', '==', userId)
        .orderBy('updateDate', 'desc')
        .get()
        .then(snap => snap.docs.map(d => ({ id: d.id, ...(d.data() as PostType) })));
    const albumsPromise = db.collection('albums')
        .where('public', '==', true)
        .where('approved', '==', true)
        .where('userId', '==', userId)
        .orderBy('updateDate', 'desc')
        .get()
        .then(snap => snap.docs.map(d => ({ id: d.id, ...(d.data() as AlbumType) })));
    const recentPostsPromise = getPostsAdmin({ limit: 5 });

    const [user, posts, albums, recentPosts] = await Promise.all([userPromise, postsPromise, albumsPromise, recentPostsPromise])

    const props: UserPropType = {
        user,
        posts,
        albums,
        recentPosts,
        cacheCreatedAt: uiDateFormat(new Date().getTime())
    }

    return {
        props: { props },
        revalidate: 86400, // regenerate page every 24 hours
    }
}) satisfies GetStaticProps<{
    props: UserPropType
}>

export default function Page({
    props,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Container>
            <HeadTag title={`User - ${props.user.name}.`} />
            <Row>
                <Col md={8}>
                    <div className="flex items-center">
                        <Image src={props.user.profilePic} alt="" roundedCircle className="mr-2 shadow-sm" width="64" height="64" />
                        <div className="pt-4">
                            <h1>{props.user.name}</h1>
                        </div>
                    </div>
                    <hr />
                    <h2>Posts</h2>
                    <ul>
                        {props.posts.map((post) => {
                            return (
                                <li key={post.id}>
                                    <Link href={`/post/${post.category}/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <h2>Albums</h2>
                    <ul>
                        {props.albums.map((album) => {
                            return (
                                <li key={album.id}>
                                    <Link href={`/album/${album.id}`}>
                                        {album.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </Col>
                <Col className="gap-5" md={4}>
                    <div className="mb-3 rounded-sm bg-slate-100 p-4">
                        <h4 className="italic">About the website</h4>
                        <p className="mb-0">Born in 2001, this website is a personal project to bring people of this town together, not affiliated to government / corporation.</p>
                    </div>
                    <RecentPostsBox posts={props.recentPosts} />

                    <div className="p-4">
                        <h4 className="italic">Elsewhere</h4>
                        <ol className="list-none pl-0">
                            <li><a href="#">GitHub</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">Facebook</a></li>
                        </ol>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                    <p className="text-center">This page was generated at {props.cacheCreatedAt}</p>
                </Col>
            </Row>
        </Container>
    )
}