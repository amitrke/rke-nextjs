export type DisplayPostParams = {
    post?: PostType
}

export type PostType = {
    title: string;
    intro: string;
    body: string;
    images: string[];
}

export const postConverter = {
    toFirestore: (post: PostType) => {
        return {
            title: post.title,
            intro: post.intro,
            body: post.body,
            images: post.images
        };
    },
    fromFirestore: (snapshot, options):PostType => {
        const data = snapshot.data(options);
        return ({title: data.title, body: data.body, intro: data.intro, images: data.images});
    }
};

const PostItem = (params: DisplayPostParams) => {
    return (
        <div>
            {params.post.title}
        </div>
    )
}

export default PostItem;