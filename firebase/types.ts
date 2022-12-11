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