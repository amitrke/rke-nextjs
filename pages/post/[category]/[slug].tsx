import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'isomorphic-dompurify';
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Col, Container, Row } from "react-bootstrap";
import HeadTag from "../../../components/ui/headTag";
import PostUserInfo from "../../../components/ui/postUserInfo";
import RecentPostsBox from "../../../components/ui/recentPostsBox";

import { jsonLdDateFormat, uiDateFormat } from "../../../components/ui/uiUtils";
import { getDocument } from "../../../firebase/firestore";
import { PostDisplayType, PostType, User } from "../../../firebase/types";
import { getPostBySlug, getPosts } from "../../../service/PostService";
import ShowImage2, { getImageSizes, ImageDisplayType } from '../../../components/ui/showImage2';

type PageType = PostDisplayType & {
    cacheCreatedAt: string,
    recentPosts: PostType[],
    displayImages: ImageDisplayType[],
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
    const authorPromise = getDocument<User>({ path: 'users', pathSegments: [postDoc.userId] });
    const recentPostsPromise = getPosts({ limit: 5, public: true });
    const imagesPromise = getImageSizes([...postDoc.images], 'm', postDoc.userId);
    const [author, recentPosts, images] = await Promise.all([authorPromise, recentPostsPromise, imagesPromise]);

    const post: PageType = {
        ...postDoc,
        edState: postBody,
        formattedUpdateDate: uiDateFormat(postDoc.updateDate),
        author,
        cacheCreatedAt: uiDateFormat((new Date()).getTime()),
        recentPosts,
        displayImages: images
    }

    return {
        props: { post },
        revalidate: 86400, // regenerate page every 24 hours 
    }
}) satisfies GetStaticProps<{
    post: PageType
}>

export default function Page({
    post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'datePublished': jsonLdDateFormat(post.updateDate),
        "author": [{
            "@type": "Person",
            "name": post.author.name,
            "url": `/user/${post.author.id}`
        }],
        'image': post.displayImages.map(x => x.url),
        "speakable": {
            "@type": "SpeakableSpecification",
            "xPath": [
                "/html/head/title",
                '//*[@id="articleBody"]'
            ]
        }
    }
    return (
        <Container>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HeadTag title={post.title} description={post.intro} />
            <Row>
                <Col className="md-8">
                    <h1>{post.title}</h1>
                    <PostUserInfo user={post.author} postDate={post.updateDate} />
                    <p>{post.intro}</p>
                    {[...post.displayImages].map((x) =>
                        <ShowImage2 key={x.key} file={x.key} userId={post.userId} width={x.width} height={x.height} />
                    )}
                    <hr />
                    <div id="articleBody" dangerouslySetInnerHTML={createMarkup(post.edState)}></div>
                </Col>
                <Col className="g-5" md={4}>
                    <div className="p-4 mb-3 bg-light rounded">
                        <h4 className="fst-italic">About the website</h4>
                        <p className="mb-0">Born in 2001, this website is a personal project to bring people of this town together, not affiliated to government / corporation.</p>
                    </div>
                    <RecentPostsBox posts={post.recentPosts} />
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