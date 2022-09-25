import ShowImage from "../../components/ui/showImage";
import { getDocument } from "../../firebase/firestore";
import { PostType } from "../account/editpost";
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'isomorphic-dompurify';

export type PostDisplayType = PostType & {
    formattedUpdateDate: string;
}

type PostPropType = {
    post: PostType,
    postBody: string
}
const createMarkup = (html: string) => {
    return {
        __html: DOMPurify.sanitize(html)
    }
}

const PostDetailSSR = (props: PostPropType) => {
    return (
        <>
            <h1>{props.post.title}</h1>
            <p>{props.post.intro}</p>
            {[...props.post.images].map((x, i) =>
                <ShowImage key={x} file={`users/${props.post.userId}/images/${x}`} />
            )}
            <div dangerouslySetInnerHTML={createMarkup(props.postBody)}></div>
        </>
    )
}

export async function getServerSideProps({ req, res, query }) {
    const { id } = query
    if (typeof (id) !== 'string') return;
    const postDoc = await getDocument<PostType>({ path: `posts`, pathSegments: [id] })
    const draftRaw = JSON.parse(postDoc.edState);
    const postBody = draftToHtml(draftRaw)
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            post: postDoc,
            postBody
        }
    }
}

export default PostDetailSSR;