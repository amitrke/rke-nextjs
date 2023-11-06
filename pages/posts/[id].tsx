import ShowImage from "../../components/ui/showImage";
import { getDocument } from "../../firebase/firestore";
import { PostType } from "../account/editpost";
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'isomorphic-dompurify';
import { Col, Container, Row } from "react-bootstrap";
import { uiDateFormat } from "../../components/ui/uiUtils";
import Link from "next/link";
import Head from "next/head";
import HeadTag from "../../components/ui/headTag";
import { User } from "../../firebase/types";
import PostUserInfo from "../../components/ui/postUserInfo";

export type PostDisplayType = PostType & {
    formattedUpdateDate: string;
    author: User;
}

type PostPropType = {
    post: PostType,
    postBody: string,
}
const createMarkup = (html: string) => {
    return {
        __html: DOMPurify.sanitize(html)
    }
}

const PostDetailSSR = (props: PostDisplayType) => {
    return (
        <Container>
            <HeadTag title={`Post - ${props.title}.`} />
            <Row>
                <Col className="md-8">
                    <h1>{props.title}</h1>
                    <PostUserInfo user={props.author} postDate={props.updateDate} />
                    <p>{props.intro}</p>
                    {[...props.images].map((x, i) =>
                        <ShowImage key={x} file={`users/${props.userId}/images/${x}`} />
                    )}
                    <hr />
                    <div dangerouslySetInnerHTML={createMarkup(props.edState)}></div>
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
    const postDoc = await getDocument<PostType>({ path: `posts`, pathSegments: [id] })
    const draftRaw = JSON.parse(postDoc.edState);
    const postBody = draftToHtml(draftRaw);
    const author = await getDocument<User>({path: 'users', pathSegments:[postDoc.userId]});

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=31536000, stale-while-revalidate'
    )
    
    const response: PostDisplayType = {
        ...postDoc,
        edState: postBody,
        formattedUpdateDate: uiDateFormat(postDoc.updateDate),
        author
    }

    return {
        props: response
    }
}

export default PostDetailSSR;