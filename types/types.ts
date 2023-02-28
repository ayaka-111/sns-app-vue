import type { Timestamp } from "firebase/firestore";

export type User = {
  userId: string;
  userName: string;
  name: string;
  icon: string;
  email: string;
  password: string;
  Cpassword: string;
  follow: string[]; //userIdを格納
  follower: string[]; //userIdを格納
  favoritePosts: string[]; //postIdを格納
  posts: string[]; //postドキュメントidを格納
  profile: string;
  keepPosts: string[]; //postIdを格納
};

export type Post = {
  postId: string;
  userId: string; //ユーザーのuserId
  userName: string;
  imageUrl: string;
  caption: string;
  timestamp: Timestamp;
  favorites: string[]; //userNameを格納
  keeps: string[]; //userIdを格納
  comments: string[];
  icon: string;
};

export type Comment = {
  comment_id: number;
  comment: string;
  timestamp: Date;
  post_id: number;
  user_name: string;
  // hashtag: string;
};

export type DirectMessage = {
  message_id: number;
  message: string;
  timestamp: Date;
  user_id: string;
  with_user_id: string;
};
