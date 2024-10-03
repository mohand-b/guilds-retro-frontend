import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {LikeDto} from "./like.model";

@Injectable({providedIn: 'root'})
export class LikesService {

  private http = inject(HttpClient);

  private readonly likesBaseUrl = `${environment.apiUrl}/likes`;

  likePost(postId: number): Observable<LikeDto> {
    return this.http.post<LikeDto>(`${this.likesBaseUrl}/${postId}`, {});
  }

  unlikePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.likesBaseUrl}/${postId}`);
  }
}
