import { where } from "firebase/firestore";
import { queryOnce } from "../firebase/firestore";
import { PostType } from "../firebase/types";
import { AlbumType } from "./account/editAlbum";

const DEFAULT_SITE_URL = 'https://www.roorkee.org';

function toIsoDate(timestamp?: number) {
        if (!timestamp) return undefined;
        try {
                return new Date(timestamp).toISOString();
        } catch {
                return undefined;
        }
}

function generateSiteMap(siteUrl: string, posts: PostType[], albums: AlbumType[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         <url>
             <loc>${siteUrl}/</loc>
         </url>
     <url>
             <loc>${siteUrl}/disclaimer</loc>
     </url>
     <url>
             <loc>${siteUrl}/privacy</loc>
     </url>
     <url>
             <loc>${siteUrl}/contact</loc>
     </url>
     <url>
             <loc>${siteUrl}/weather/roorkee-in</loc>
     </url>
         <url>
             <loc>${siteUrl}/posts/page/1</loc>
         </url>
         <url>
             <loc>${siteUrl}/news/1</loc>
         </url>
         <url>
             <loc>${siteUrl}/albums</loc>
         </url>
         <url>
             <loc>${siteUrl}/events</loc>
         </url>
     ${posts
                        .map(({ category, slug, updateDate }) => {
                                const lastmod = toIsoDate(updateDate);
                return `
            <url>
                                <loc>${siteUrl}/post/${category}/${slug}</loc>
                                ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
            </url>
            `;
            })
            .join('')}
         ${albums
                        .map(({ id, updateDate }) => {
                                const lastmod = toIsoDate(updateDate);
                return `
            <url>
                                <loc>${siteUrl}/album/${id}</loc>
                                ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
            </url>
            `;
            })
            .join('')}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
    const postsPromise = queryOnce<PostType>(
        {
            path: `posts`, queryConstraints: [
                where("public", "==", true)
            ]
        }
    )

    const albumsPromise = queryOnce<AlbumType>(
        {
            path: `albums`, queryConstraints: [
                where("public", "==", true)
            ]
        }
    )

    const [posts, albums] = await Promise.all([postsPromise, albumsPromise]);

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(siteUrl, posts, albums);

    res.setHeader('Content-Type', 'text/xml');
    res.statusCode = 200;
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;