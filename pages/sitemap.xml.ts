import { getAdminFirestore } from "../firebase/firebaseAdmin";
import { PostType } from "../firebase/types";
import type { AlbumType } from "./account/editAlbum";

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
             <changefreq>weekly</changefreq>
             <priority>1.0</priority>
         </url>
     <url>
             <loc>${siteUrl}/disclaimer</loc>
             <changefreq>yearly</changefreq>
             <priority>0.3</priority>
     </url>
     <url>
             <loc>${siteUrl}/privacy</loc>
             <changefreq>yearly</changefreq>
             <priority>0.3</priority>
     </url>
     <url>
             <loc>${siteUrl}/contact</loc>
             <changefreq>yearly</changefreq>
             <priority>0.3</priority>
     </url>
         <url>
             <loc>${siteUrl}/account-deletion</loc>
             <changefreq>yearly</changefreq>
             <priority>0.1</priority>
         </url>
     <url>
             <loc>${siteUrl}/weather/roorkee-in</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
     </url>
         <url>
             <loc>${siteUrl}/posts/page/1</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
         </url>
         <url>
             <loc>${siteUrl}/news/1</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
         </url>
         <url>
             <loc>${siteUrl}/news/2</loc>
             <changefreq>daily</changefreq>
             <priority>0.6</priority>
         </url>
         <url>
             <loc>${siteUrl}/news/3</loc>
             <changefreq>daily</changefreq>
             <priority>0.6</priority>
         </url>
         <url>
             <loc>${siteUrl}/news/4</loc>
             <changefreq>daily</changefreq>
             <priority>0.6</priority>
         </url>
         <url>
             <loc>${siteUrl}/news/5</loc>
             <changefreq>daily</changefreq>
             <priority>0.6</priority>
         </url>
         <url>
             <loc>${siteUrl}/albums</loc>
             <changefreq>weekly</changefreq>
             <priority>0.8</priority>
         </url>
         <url>
             <loc>${siteUrl}/events</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
         </url>
     ${posts
                        .map(({ category, slug, updateDate }) => {
                                const lastmod = toIsoDate(updateDate);
                return `
            <url>
                                <loc>${siteUrl}/post/${category}/${slug}</loc>
                                ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
                                <changefreq>monthly</changefreq>
                                <priority>0.7</priority>
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
                                <changefreq>monthly</changefreq>
                                <priority>0.6</priority>
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
    const db = getAdminFirestore();
    const [postsSnap, albumsSnap] = await Promise.all([
        db.collection('posts').where('public', '==', true).get(),
        db.collection('albums').where('public', '==', true).where('approved', '==', true).get(),
    ]);
    const posts = postsSnap.docs.map(d => ({ id: d.id, ...(d.data() as PostType) }));
    const albums = albumsSnap.docs.map(d => ({ id: d.id, ...(d.data() as AlbumType) }));

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