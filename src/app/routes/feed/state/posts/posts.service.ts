import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostDto} from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {

  private http = inject(HttpClient);

  private readonly postsBaseUrl = `${environment.apiUrl}/posts`;

  create(postFormData: FormData): Observable<PostDto> {
    return this.http.post<PostDto>(`${this.postsBaseUrl}`, postFormData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.postsBaseUrl}/${id}`);
  }

  getLastPosts(userId: number): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.postsBaseUrl}/user/${userId}/last-posts`);
  }

  getPost(id: number): Observable<PostDto> {
    return this.http.get<PostDto>(`${this.postsBaseUrl}/${id}`);
  }


}
