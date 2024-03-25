import ShowImage from "../../../components/ui/showImage";
import { getDocument } from "../../../firebase/firestore";
import { PostType } from "../../account/editpost";
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'isomorphic-dompurify';
import { Col, Container, Row } from "react-bootstrap";
import { uiDateFormat } from "../../../components/ui/uiUtils";
import Link from "next/link";
import HeadTag from "../../../components/ui/headTag";
import { User } from "../../../firebase/types";
import PostUserInfo from "../../../components/ui/postUserInfo";
import { getPostBySlug, getPosts } from "../../../service/PostService";
import { GetStaticProps, InferGetStaticPropsType } from "next";

export type PostDisplayType = PostType & {
    formattedUpdateDate: string;
    author: User;
    cacheCreatedAt?: string;
}

const createMarkup = (html: string) => {
    return {
        __html: DOMPurify.sanitize(html)
    }
}

export async function getStaticPaths() {
    // The developer has full flexibility to control
    // what pages are generated during the build or on-demand
    // For example, you could only generate the top products
    // const topProducts = await getTopProducts()
    const topPosts = await getPosts({ limit: 20, public: true });
    const paths = topPosts.map(post => ({ params: { category: post.category, slug: post.slug } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

export const getStaticProps = (async (context) => {
    const postDoc = await getPostBySlug(context.params.category as string, context.params.slug as string);
    const draftRaw = JSON.parse(postDoc.edState);
    const postBody = draftToHtml(draftRaw);
    const author = await getDocument<User>({ path: 'users', pathSegments: [postDoc.userId] });
    const post: PostDisplayType = {
        ...postDoc,
        edState: postBody,
        formattedUpdateDate: uiDateFormat(postDoc.updateDate),
        author,
        cacheCreatedAt: uiDateFormat((new Date()).getTime())
    }

    return {
        props: { post },
        revalidate: 86400, // regenerate page every 24 hours 
    }
}) satisfies GetStaticProps<{
    post: PostDisplayType
}>

export default function Page({
    post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Container>
            <HeadTag title={`Post - ${post.title}.`} />
            <Row>
                <Col className="md-8">
                    <h1>{post.title}</h1>
                    <PostUserInfo user={post.author} postDate={post.updateDate} />
                    <p>{post.intro}</p>
                    {[...post.images].map((x, i) =>
                        <ShowImage key={x} file={`users/${post.userId}/images/${x}`} />
                    )}
                    <hr />
                    <div dangerouslySetInnerHTML={createMarkup(post.edState)}></div>
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
            <Row>
                <Col>
                    <hr />
                    <p className="text-center">This page was generated at {post.cacheCreatedAt}</p>
                </Col>
            </Row>
        </Container>
    )
}