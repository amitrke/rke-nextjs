export type PostType = {
  id: string;
  title: string;
  intro: string;
  edState: string;
  updateDate: number;
  images: string[];
  public: boolean;
  approved?: boolean;
  userId: string;
  category: string;
  slug: string;
}

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export type ModerationQueueItem = {
  itemId: string;
  itemType: 'post' | 'album';
  userId: string;
  status: ModerationStatus;
  submittedAt: number;
  reviewedAt: number | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  title: string;
  authorName: string;
}

export type NotificationType = {
  id?: string;
  userId: string;
  type: 'approved' | 'rejected';
  itemId: string;
  itemTitle: string;
  itemType: 'post' | 'album';
  rejectionReason: string | null;
  createdAt: number;
  read: boolean;
}

export type User = {
    id: string,
    email: string,
  token?: string,
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
