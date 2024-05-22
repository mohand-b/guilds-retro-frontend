import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CreatePost, Post} from "./post.model";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {

  private http = inject(HttpClient);

  private readonly postsBaseUrl = `${environment.apiUrl}/posts`;

  create(post: CreatePost): Observable<Post> {
    return this.http.post<Post>(`${this.postsBaseUrl}`, post);
  }


}
