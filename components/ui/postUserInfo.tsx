import { Image } from "./tw"
import Link from "next/link"
import { User } from "../../firebase/types"
import { uiDateFormat } from "./uiUtils"

export type PostUserInfoType = {
    user: User,
    postDate: number,
}

export default function PostUserInfo({ user, postDate }: PostUserInfoType) {
    return (
        <div className="flex items-center border-y border-slate-200 py-3">
            {user.profilePic ? (
                <Image
                    src={user.profilePic}
                    alt={user.name}
                    roundedCircle
                    className="mr-3"
                    width="48"
                    height="48"
                />
            ) : (
                <div
                    className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white"
                    style={{ width: '48px', height: '48px', fontSize: '20px', fontWeight: 'bold' }}
                >
                    {user.name?.charAt(0).toUpperCase()}
                </div>
            )}
            <div>
                <div className="font-semibold">
                    <Link href={`/user/${user.id}`} className="text-slate-900 no-underline hover:text-blue-700">
                        {user.name}
                    </Link>
                </div>
                <div className="text-sm text-slate-500">
                    Posted on {uiDateFormat(postDate)}
                </div>
            </div>
        </div>
    )
}