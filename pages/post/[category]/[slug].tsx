import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'isomorphic-dompurify';
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Col, Container, Row, Badge, Card } from "../../../components/ui/tw";
import HeadTag from "../../../components/ui/headTag";
import PostUserInfo from "../../../components/ui/postUserInfo";
import RecentPostsBox from "../../../components/ui/recentPostsBox";
import Link from "next/link";
import { jsonLdDateFormat, uiDateFormat } from "../../../components/ui/uiUtils";
import { adminGetDocument, getAdminFirestore } from "../../../firebase/firebaseAdmin";
import { PostDisplayType, PostType, User } from "../../../firebase/types";
import { getPostBySlugAdmin, getPostsAdmin } from "../../../service/PostServiceAdmin";
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
    const topPosts = await getPostsAdmin({ limit: 20 });
    const paths = topPosts.map(post => ({ params: { category: post.category, slug: post.slug } }))
    return {
        paths,
        fallback: 'blocking', // generate new pages on-demand
    }
}

export const getStaticProps = (async (context) => {
    const postDoc = await getPostBySlugAdmin(context.params.category as string, context.params.slug as string);
    const draftRaw = JSON.parse(postDoc.edState);
    const postBody = draftToHtml(draftRaw);
    const authorPromise: Promise<User> = (async () => {
        const db = getAdminFirestore();
        const byUserIdSnap = await db.collection('users').where('id', '==', postDoc.userId).limit(1).get();
        const byUserIdField = byUserIdSnap.docs.map(d => ({ id: d.id, ...(d.data() as User) }));
        const byDocId = await adminGetDocument<User>('users', postDoc.userId);
        const resolved = byUserIdField[0] || byDocId;

        if (!resolved) {
            return {
                id: postDoc.userId,
                email: '',
                name: 'Community Member',
                profilePic: undefined,
            };
        }

        const resolvedName = (resolved.name || '').trim();
        const altDisplayName = ((resolved as unknown as { displayName?: string; fullName?: string }).displayName
            || (resolved as unknown as { displayName?: string; fullName?: string }).fullName
            || '')
            .trim();
        const userNameCandidate = resolvedName || altDisplayName;
        const isIdentifierLikeName = userNameCandidate !== ''
            && [resolved.id, postDoc.userId].includes(userNameCandidate);
        const safeName = (!userNameCandidate || isIdentifierLikeName)
            ? 'Community Member'
            : userNameCandidate;

        return {
            ...resolved,
            id: resolved.id || postDoc.userId,
            email: resolved.email || '',
            ...(resolved.token ? { token: resolved.token } : {}),
            name: safeName,
            profilePic: resolved.profilePic,
        };
    })();
    const recentPostsPromise = getPostsAdmin({ limit: 5 });
    const imagesPromise: Promise<ImageDisplayType[]> = (async () => {
        const { probeRemoteImage } = await import('../../../lib/imageProbe');
        return Promise.all(
            [...postDoc.images].map(async (key) => {
                const url = getImageBucketUrl(key, 'm', postDoc.userId);
                try {
                    const { width, height } = await probeRemoteImage(url);
                    return { key, url, width, height };
                } catch {
                    return { key, url, width: 680, height: 680 };
                }
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
    console.log(`Generated page for post: ${postDoc.title} with author ${author.name} and ${images.length} images.`);
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
    const publishedDate = jsonLdDateFormat(post.updateDate);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'datePublished': publishedDate,
        'dateModified': publishedDate,
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
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteUrl },
            { '@type': 'ListItem', 'position': 2, 'name': post.category, 'item': `${siteUrl}/posts/page/1` },
            { '@type': 'ListItem', 'position': 3, 'name': post.title },
        ]
    }
    return (
        <Container className="py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <HeadTag
                title={post.title}
                description={post.intro}
                type="article"
                author={post.author.name}
                publishedTime={publishedDate}
                modifiedTime={publishedDate}
                url={`/post/${post.category}/${post.slug}`}
                image={post.displayImages.length > 0 ? post.displayImages[0].url : undefined}
                keywords={[post.category, 'Roorkee', post.title]}
            />

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <li><Link href="/" className="hover:text-blue-700">Home</Link></li>
                    <li>/</li>
                    <li><Link href="/posts/page/1" className="hover:text-blue-700">{post.category}</Link></li>
                    <li>/</li>
                    <li className="text-slate-900" aria-current="page">{post.title}</li>
                </ol>
            </nav>

            <Row className="gap-y-4">
                <Col lg={8}>
                    <article>
                        {/* Category Badge */}
                        <div className="mb-3">
                            <Link href="/posts/page/1" className="no-underline">
                                <Badge bg="primary" className="text-uppercase">{post.category}</Badge>
                            </Link>
                        </div>

                        {/* Title */}
                        <h1 className="mb-3 text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>

                        {/* Author and Date */}
                        <PostUserInfo user={post.author} postDate={post.updateDate} />

                        {/* Introduction */}
                        <p className="my-4 text-lg text-slate-500">{post.intro}</p>

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
                    <div className="sticky-top" style={{ top: '72px' }}>
                        {/* Recent Posts */}
                        <Card className="mb-3 border-0 shadow-xs">
                            <Card.Body className="p-4">
                                <RecentPostsBox posts={post.recentPosts} />
                            </Card.Body>
                        </Card>

                        {/* Share Section */}
                        <Card className="border-0 shadow-xs">
                            <Card.Body className="p-4">
                                <h5 className="mb-3 text-lg font-bold">Share This Post</h5>
                                <div className="grid gap-2">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.roorkee.org/post/${post.category}/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-md border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50"
                                    >
                                        Share on Twitter
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.roorkee.org/post/${post.category}/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-md border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50"
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