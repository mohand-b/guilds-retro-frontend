import {LikeDto} from "../likes/like.model";
import {UserDto} from "../../../profile/state/users/user.model";
import {CommentDto} from "../comments/comment.model";

export interface PostDto {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  user: UserDto;
  comments: CommentDto[];
  likes: LikeDto[];
  commentCount: number;
}

export interface CreatePost {
  text?: string | null;
  image?: File | null;
}
