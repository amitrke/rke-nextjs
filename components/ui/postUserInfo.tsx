import { Image } from "react-bootstrap"
import { User } from "../../firebase/types"
import { uiDateFormat } from "./uiUtils"

export type PostUserInfoType = {
    user: User,
    postDate: number,
}

export default function PostUserInfo({ user, postDate }: PostUserInfoType) {
    return (
        <div className="d-flex align-items-center">
            <Image src={user.profilePic} alt="" roundedCircle className="me-2" width="32" height="32" />
            <div style={{ paddingTop: '15px' }}>
                <p className="blog-post-meta">Posted by <a href={`/user/${user.id}`}>{user.name}</a> on {uiDateFormat(postDate)}</p>
            </div>
        </div>
    )
}