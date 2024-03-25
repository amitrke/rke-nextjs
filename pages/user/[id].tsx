import { orderBy, where } from "firebase/firestore";
import DOMPurify from 'isomorphic-dompurify';
import Link from "next/link";
import { Col, Container, Image, Row } from "react-bootstrap";
import { getDocument, queryOnce } from "../../firebase/firestore";
import { User } from "../../firebase/types";
import { AlbumType } from "../account/editAlbum";
import { PostType } from "../account/editpost";
import Head from "next/head";
import HeadTag from "../../components/ui/headTag";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { uiDateFormat } from "../../components/ui/uiUtils";
import { getPosts } from "../../service/PostService";
import RecentPostsBox from "../../components/ui/recentPostsBox";

type UserPropType = {
    user: User,
    posts: PostType[],
    albums: AlbumType[],
    recentPosts: PostType[],
    cacheCreatedAt?: string;
}

export async function getStaticPaths() {
    const users = await queryOnce<User>({ path: 'users' });
    const paths = users.map(user => ({ params: { id: user.id } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

export const getStaticProps = (async (context) => {
    const userId = context.params.id as string;
    const userPromise = getDocument<User>({ path: `users`, pathSegments: [userId] })
    //Get posts of this user
    const postsPromise = queryOnce<PostType>(
        {
            path: `posts`, queryConstraints: [
                where("public", "==", true),
                where("userId", "==", userId),
                orderBy("updateDate", "desc")
            ]
        });


    //Get albums of this user
    const albumsPromise = queryOnce<AlbumType>(
        {
            path: `albums`, queryConstraints: [
                where("public", "==", true),
                where("userId", "==", userId),
                orderBy("updateDate", "desc")
            ]
        });

    const recentPostsPromise = getPosts({ limit: 5, public: true });

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
                <Col className="md-8">
                    <div className="d-flex align-items-center">
                        <Image src={props.user.profilePic} alt="" roundedCircle className="me-2 shadow" width="64" height="64" />
                        <div style={{ paddingTop: '15px' }}>
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
                <Col className="g-5" md={4}>
                    <div className="p-4 mb-3 bg-light rounded">
                        <h4 className="fst-italic">About the website</h4>
                        <p className="mb-0">Born in 2001, this website is a personal project to bring people of this town together, not affiliated to government / corporation.</p>
                    </div>
                    <RecentPostsBox posts={props.recentPosts} />

                    <div className="p-4">
                        <h4 className="fst-italic">Elsewhere</h4>
                        <ol className="list-unstyled">
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