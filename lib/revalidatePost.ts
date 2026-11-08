import type { NextApiResponse } from 'next';

type RevalidatablePost = {
    id: string;
    category?: string;
    slug?: string;
    userId?: string;
};

// Pages that show a post and are cached with ISR. Refreshing them right after a
// save (or a moderation decision) makes the change visible immediately instead
// of after the page's revalidate period.
export function postPaths(post: RevalidatablePost, extraPaths: string[] = []): string[] {
    const paths = new Set<string>(['/', '/posts/page/1', `/posts/${post.id}`]);
    if (post.category && post.slug) paths.add(`/post/${post.category}/${post.slug}`);
    if (post.userId) paths.add(`/user/${post.userId}`);
    for (const p of extraPaths) paths.add(p);
    return [...paths];
}

// Revalidates each path independently so one failure (e.g. a path that was
// never generated) doesn't stop the rest. Returns the paths that failed.
export async function revalidatePaths(res: NextApiResponse, paths: string[]): Promise<string[]> {
    const failed: string[] = [];
    await Promise.all(paths.map(async (path) => {
        try {
            await res.revalidate(path);
        } catch (err) {
            console.error(`[revalidate] ${path} failed:`, err);
            failed.push(path);
        }
    }));
    return failed;
}
