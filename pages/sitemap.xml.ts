import { where } from "firebase/firestore";
import { queryOnce } from "../firebase/firestore";
import { PostType } from "./account/editpost";
import { AlbumType } from "./account/editAlbum";
import { User } from "../firebase/types";

const hostname = 'https://www.roorkee.org';

function generateSiteMap(posts: PostType[], albums: AlbumType[], users: User[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://www.roorkee.org/disclaimer</loc>
     </url>
     <url>
       <loc>https://www.roorkee.org/privacy</loc>
     </url>
     <url>
       <loc>https://www.roorkee.org/contact</loc>
     </url>
     <url>
       <loc>https://www.roorkee.org/weather/roorkee-in</loc>
     </url>
     ${posts
            .map(({ category, slug }) => {
                return `
            <url>
                <loc>${hostname}/post/${category}/${slug}</loc>
            </url>
            `;
            })
            .join('')}
         ${albums
            .map(({ id }) => {
                return `
            <url>
                <loc>${`${hostname}/album/${id}`}</loc>
            </url>
            `;
            })
            .join('')}
            ${users
            .map(({ id }) => {
                return `
                <url>
                    <loc>${`${hostname}/user/${id}`}</loc>
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

    const usersPromise = queryOnce<User>(
        { path: `users` }
    )

    const [posts, albums, users] = await Promise.all([postsPromise, albumsPromise, usersPromise]);

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts, albums, users);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;