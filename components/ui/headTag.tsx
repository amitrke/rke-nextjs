import Head from "next/head"

export type HeadTagType = {
    title: string,
    description?: string
    allowRobots?: boolean
}

export default function HeadTag ({ title, description, allowRobots = true }: HeadTagType) {
    return (
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} key="title" />
            <meta name="robots" content={allowRobots ? "all" : "noindex"} />
            {description && (
                <>
                    <meta name="description" content={description} />
                    <meta property="og:description" content={description} />
                </>
            )}
        </Head>
    )
}