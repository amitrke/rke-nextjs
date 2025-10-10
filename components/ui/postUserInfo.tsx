import { Image } from "react-bootstrap"
import Link from "next/link"
import { User } from "../../firebase/types"
import { uiDateFormat } from "./uiUtils"

export type PostUserInfoType = {
    user: User,
    postDate: number,
}

export default function PostUserInfo({ user, postDate }: PostUserInfoType) {
    return (
        <div className="d-flex align-items-center py-3 border-top border-bottom">
            {user.profilePic ? (
                <Image
                    src={user.profilePic}
                    alt={user.name}
                    roundedCircle
                    className="me-3"
                    width="48"
                    height="48"
                />
            ) : (
                <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: '48px', height: '48px', fontSize: '20px', fontWeight: 'bold' }}
                >
                    {user.name?.charAt(0).toUpperCase()}
                </div>
            )}
            <div>
                <div className="fw-semibold">
                    <Link href={`/user/${user.id}`} className="text-decoration-none text-dark">
                        {user.name}
                    </Link>
                </div>
                <div className="text-muted small">
                    Posted on {uiDateFormat(postDate)}
                </div>
            </div>
        </div>
    )
}