import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {LikeDto} from "../likes/like.model";

export interface Post {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  user: UserDto;
  comments: Comment[];
  likes: LikeDto[];
}

export interface Comment {
  id: number;
  text: string;
  createdAt: Date;
  user: UserDto;
}

export interface CreatePost {
  text?: string | null;
  image?: File | null;
}
