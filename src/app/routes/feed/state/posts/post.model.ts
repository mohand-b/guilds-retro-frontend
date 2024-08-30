import {LikeDto} from "../likes/like.model";
import {UserDto} from "../../../profile/state/users/user.model";

export interface PostDto {
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
