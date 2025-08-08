export type PostType = {
  id: string;
  title: string;
  intro: string;
  edState: string;
  updateDate: number;
  images: string[];
  public: boolean;
  userId: string;
  category: string;
  slug: string;
}

export type User = {
    id: string,
    email: string,
    token: string | undefined,
    name: string,
    profilePic: string | undefined
}

export type MessageType = {
    fromUserId: string;
    title: string;
    body: string;
    updateDate: number;
    toUserId: string;
    state: string;
    thread: string;
  }

export type PostDisplayType = PostType & {
    images: string[],
    author: User,
    formattedUpdateDate: string,
}
