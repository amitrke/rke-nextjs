import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'isomorphic-dompurify';
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Col, Container, Row, Badge, Card } from "react-bootstrap";
import HeadTag from "../../../components/ui/headTag";
import PostUserInfo from "../../../components/ui/postUserInfo";
import RecentPostsBox from "../../../components/ui/recentPostsBox";
import Link from "next/link";

import { jsonLdDateFormat, uiDateFormat } from "../../../components/ui/uiUtils";
import { getDocument } from "../../../firebase/firestore";
import { PostDisplayType, PostType, User } from "../../../firebase/types";
import { getPostBySlug, getPosts } from "../../../service/PostService";
import ShowImage2, { ImageDisplayType, getImageBucketUrl } from '../../../components/ui/showImage2';

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
    const imagesPromise: Promise<ImageDisplayType[]> = (async () => {
        const { probeRemoteImage } = await import('../../../lib/imageProbe');
        return Promise.all(
            [...postDoc.images].map(async (key) => {
                const url = getImageBucketUrl(key, 'm', postDoc.userId);
                const { width, height } = await probeRemoteImage(url);
                return { key, url, width, height };
            })
        );
    })();
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
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.roorkee.org').replace(/\/+$/, '');
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'datePublished': jsonLdDateFormat(post.updateDate),
        "author": [{
            "@type": "Person",
            "name": post.author.name,
            "url": `${siteUrl}/user/${post.author.id}`
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
        <Container className="py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HeadTag
                title={post.title}
                description={post.intro}
                type="article"
                author={post.author.name}
                publishedTime={jsonLdDateFormat(post.updateDate)}
                url={`/post/${post.category}/${post.slug}`}
                image={post.displayImages.length > 0 ? post.displayImages[0].url : undefined}
                keywords={[post.category, 'Roorkee', post.title]}
            />

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link href="/posts/page/1">{post.category}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
                </ol>
            </nav>

            <Row className="g-4">
                <Col lg={8}>
                    <article>
                        {/* Category Badge */}
                        <div className="mb-3">
                            <Link href="/posts/page/1" className="text-decoration-none">
                                <Badge bg="primary" className="text-uppercase">{post.category}</Badge>
                            </Link>
                        </div>

                        {/* Title */}
                        <h1 className="display-4 fw-bold mb-3">{post.title}</h1>

                        {/* Author and Date */}
                        <PostUserInfo user={post.author} postDate={post.updateDate} />

                        {/* Introduction */}
                        <p className="lead my-4 text-muted">{post.intro}</p>

                        {/* Featured Images */}
                        {post.displayImages.length > 0 && (
                            <div className="mb-4">
                                {[...post.displayImages].map((x) =>
                                    <div key={x.key} className="mb-3">
                                        <ShowImage2 file={x.key} userId={post.userId} width={x.width} height={x.height} />
                                    </div>
                                )}
                            </div>
                        )}

                        <hr className="my-4" />

                        {/* Article Body */}
                        <div
                            id="articleBody"
                            className="article-content"
                            style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: '#333'
                            }}
                            dangerouslySetInnerHTML={createMarkup(post.edState)}
                        />
                    </article>
                </Col>

                {/* Sidebar */}
                <Col lg={4}>
                    <div className="sticky-top" style={{ top: '20px' }}>
                        {/* Recent Posts */}
                        <Card className="mb-3 border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <RecentPostsBox posts={post.recentPosts} />
                            </Card.Body>
                        </Card>

                        {/* Share Section */}
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">Share This Post</h5>
                                <div className="d-grid gap-2">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.roorkee.org/post/${post.category}/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        Share on Twitter
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.roorkee.org/post/${post.category}/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        Share on Facebook
                                    </a>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}