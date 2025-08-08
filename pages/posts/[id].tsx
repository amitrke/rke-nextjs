import ShowImage from "../../components/ui/showImage";
import { getDocument } from "../../firebase/firestore";
import { PostType } from "../../firebase/types";
import DOMPurify from 'isomorphic-dompurify';
import { Col, Container, Row } from "react-bootstrap";
import { uiDateFormat } from "../../components/ui/uiUtils";
import Link from "next/link";
import HeadTag from "../../components/ui/headTag";

import PostUserInfo from "../../components/ui/postUserInfo";
import { getPosts } from "../../service/PostService";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";

interface IParams extends ParsedUrlQuery {
    id: string;
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
    const paths = topPosts.map(post => ({ params: { id: post.id } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

import { getPostWithAuthor } from '../../service/PostService';

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params as IParams;
    const post = await getDocument<PostType>({ path: 'posts', pathSegments: [id] });
    const postDisplay = await getPostWithAuthor(post);
    return {
        props: {
            post: postDisplay,
            cacheCreatedAt: uiDateFormat(new Date().getTime()),
        },
        revalidate: 86400, // regenerate page every 24 hours
    };
};

export default function Page({
    post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Container>
            <HeadTag title={post.title} description={post.intro} />
            <Row>
                <Col className="md-8">
                    <h1>{post.title}</h1>
                    <PostUserInfo user={post.author} postDate={post.updateDate} />
                    <p>{post.intro}</p>
                    {[...post.images].map((x) =>
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