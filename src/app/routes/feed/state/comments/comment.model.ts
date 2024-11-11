import {UserDto} from "../../../profile/state/users/user.model";
import {PostDto} from "../posts/post.model";

export interface CommentDto {
  id: number;
  text: string;
  createdAt: Date;
  postId: number;
  user: UserDto;
  post?: PostDto;
}

export interface CreateCommentDto {
  text: string;
  postId: number;
}

export interface PaginatedCommentsDto {
  total: number;
  page: number;
  limit: number;
  comments: CommentDto[];
}
