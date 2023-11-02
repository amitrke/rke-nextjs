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

type UserPropType = {
    user: User,
    posts: PostType[],
    albums: AlbumType[],
}
const createMarkup = (html: string) => {
    return {
        __html: DOMPurify.sanitize(html)
    }
}

const UserDetailSSR = (props: UserPropType) => {
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
                    <hr/>
                    <h2>Posts</h2>
                    <ul>
                        {props.posts.map((post) => {
                            return (
                                <li key={post.id}>
                                    <Link href={`/posts/${post.id}`}>
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
                    <div className="p-4">
                        <h4 className="fst-italic">Recent Posts</h4>
                        <ol className="list-unstyled mb-0">
                            <li><Link href="/posts/m3BbY0r1SfDprLkyUJc6">IIT Roorkee</Link></li>
                            <li><a href="#">February 2021</a></li>
                        </ol>
                    </div>

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
        </Container>
    )
}

export async function getServerSideProps({ req, res, query }) {
    const { id } = query
    if (typeof (id) !== 'string') return;
    const userDoc = await getDocument<User>({ path: `users`, pathSegments: [id] })
    if (!userDoc) {
        return {
            notFound: true
        }
    }

    //Get posts of this user
    const postsPromise = queryOnce<PostType>(
        { path: `posts`, queryConstraints: [
            where("public", "==", true), 
            where("userId", "==", id),
            orderBy("updateDate", "desc")
        ] });

    
    //Get albums of this user
    const albumsPromise = queryOnce<AlbumType>(
        { path: `albums`, queryConstraints: [
            where("public", "==", true), 
            where("userId", "==", id),
            orderBy("updateDate", "desc")
        ] });
    
    const [posts, albums] = await Promise.all([postsPromise, albumsPromise])

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=31536000, stale-while-revalidate=59'
    )

    const response: UserPropType = {
        user: userDoc,
        posts,
        albums
    }

    return {
        props: response
    }
}

export default UserDetailSSR;