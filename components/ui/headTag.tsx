import Head from "next/head"

export type HeadTagType = {
    title: string,
    description?: string
    allowRobots?: boolean
    robots?: string
    image?: string
    imageWidth?: number
    imageHeight?: number
    url?: string
    type?: 'website' | 'article'
    author?: string
    publishedTime?: string
    modifiedTime?: string
    keywords?: string[]
    prevUrl?: string
    nextUrl?: string
    twitterSite?: string
}

export default function HeadTag ({
    title,
    description,
    allowRobots = true,
    robots,
    image,
    imageWidth,
    imageHeight,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    keywords,
    prevUrl,
    nextUrl,
    twitterSite,
}: HeadTagType) {
    const siteName = "Roorkee.org";
    const defaultDescription = "Roorkee.org: Town Information, Community Hub for Roorkee residents";
    const finalDescription = description || defaultDescription;
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.roorkee.org").replace(/\/+$/, "");

    const toAbsoluteUrl = (value?: string) => {
        if (!value) return baseUrl;
        if (/^https?:\/\//i.test(value)) return value.replace(/\/+$/, "");
        const path = value.startsWith("/") ? value : `/${value}`;
        return `${baseUrl}${path}`.replace(/\/+$/, "");
    };

    const finalUrl = toAbsoluteUrl(url);
    const defaultImage = `${baseUrl}/no-image.png`;
    const finalImage = toAbsoluteUrl(image || defaultImage);
    const robotsContent = robots ?? (allowRobots ? "index,follow" : "noindex,nofollow");

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={finalDescription} />
            <meta name="robots" content={robotsContent} />
            {keywords && keywords.length > 0 && (
                <meta name="keywords" content={keywords.join(", ")} />
            )}
            {author && <meta name="author" content={author} />}

            {/* Open Graph Tags */}
            <meta property="og:title" content={title} key="og:title" />
            <meta property="og:description" content={finalDescription} key="og:description" />
            <meta property="og:type" content={type} key="og:type" />
            <meta property="og:url" content={finalUrl} key="og:url" />
            <meta property="og:site_name" content={siteName} key="og:site_name" />
            <meta property="og:image" content={finalImage} key="og:image" />
            <meta property="og:image:alt" content={title} key="og:image:alt" />
            <meta property="og:image:width" content={String(imageWidth ?? 1200)} key="og:image:width" />
            <meta property="og:image:height" content={String(imageHeight ?? 630)} key="og:image:height" />
            <meta property="og:locale" content="en_IN" key="og:locale" />
            {publishedTime && type === 'article' && (
                <meta property="article:published_time" content={publishedTime} key="article:published_time" />
            )}
            {modifiedTime && type === 'article' && (
                <meta property="article:modified_time" content={modifiedTime} key="article:modified_time" />
            )}
            {author && type === 'article' && (
                <meta property="article:author" content={author} key="article:author" />
            )}

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
            <meta name="twitter:title" content={title} key="twitter:title" />
            <meta name="twitter:description" content={finalDescription} key="twitter:description" />
            <meta name="twitter:image" content={finalImage} key="twitter:image" />
            <meta name="twitter:url" content={finalUrl} key="twitter:url" />
            {twitterSite && <meta name="twitter:site" content={twitterSite} key="twitter:site" />}

            {/* Canonical URL */}
            <link rel="canonical" href={finalUrl} />

            {/* Pagination */}
            {prevUrl && <link rel="prev" href={toAbsoluteUrl(prevUrl)} />}
            {nextUrl && <link rel="next" href={toAbsoluteUrl(nextUrl)} />}
        </Head>
    )
}