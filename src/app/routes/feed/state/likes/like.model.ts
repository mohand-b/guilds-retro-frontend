import {PostDto} from "../posts/post.model";
import {UserDto} from "../../../profile/state/users/user.model";

export interface LikeDto {
  id: number;
  user: UserDto;
  post: PostDto;
}
