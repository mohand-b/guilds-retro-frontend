import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostFeedDto} from "../feed/feed.model";

@Injectable({providedIn: 'root'})
export class PostsService {

  private http = inject(HttpClient);

  private readonly postsBaseUrl = `${environment.apiUrl}/posts`;

  create(postFormData: FormData): Observable<PostFeedDto> {
    return this.http.post<PostFeedDto>(`${this.postsBaseUrl}`, postFormData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.postsBaseUrl}/${id}`);
  }


}
