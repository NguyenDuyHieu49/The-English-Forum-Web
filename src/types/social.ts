export interface SocialUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Story {
  id: string;
  user: SocialUser;
  image: string;
  viewed: boolean;
}

export interface Comment {
  id: string;
  user: SocialUser;
  text: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  user: SocialUser;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  saved: boolean;
  createdAt: string;
}
