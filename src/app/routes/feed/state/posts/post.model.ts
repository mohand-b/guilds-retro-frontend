import {UserDto} from "../../../authenticated/state/authed/authed.model";

export interface Post {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  user: UserDto;
  comments: Comment[];
  likes: Like[];
}

export interface Comment {
  id: number;
  text: string;
  createdAt: Date;
  user: UserDto;
}

export interface Like {
  id: number;
  user: UserDto;
}

export interface CreatePost {
  text?: string;
  image?: string;
}
