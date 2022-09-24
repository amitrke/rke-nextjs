import ShowImage from "../../components/ui/showImage";
import { getDocument } from "../../firebase/firestore";
import { PostType } from "../account/editpost";
import draftToHtml from 'draftjs-to-html';

type PostPropType = {
    post: PostType
}

const PostDetailSSR = (props: PostPropType) => {
    return (
        <>
            <h1>{props.post.title}</h1>
            <h2>{props.post.intro}</h2>
            <p>
                {draftToHtml(props.post.edState)}
            </p>
            {[...props.post.images].map((x, i) =>
                <ShowImage key={x} file={`users/${props.post.userId}/images/${x}`} />
            )}
        </>
    )
}

export async function getServerSideProps({ req, res, query }) {
    const { id } = query
    if (typeof (id) !== 'string') return;
    const postDoc = await getDocument<PostType>({ path: `posts`, pathSegments: [id] })

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: {
            post: postDoc
        }
    }
}

export default PostDetailSSR;