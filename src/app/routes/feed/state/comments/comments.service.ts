import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {CommentDto, CreateCommentDto, PaginatedCommentsDto} from "./comment.model";

@Injectable({providedIn: 'root'})
export class CommentsService {

  private http = inject(HttpClient);
  private readonly commentsBaseUrl = `${environment.apiUrl}/comments`;

  createComment(createComment: CreateCommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(
      `${this.commentsBaseUrl}`,
      createComment,
    );
  }

  getPaginatedComments(postId: number, cursor?: number, limit: number = 3): Observable<PaginatedCommentsDto> {
    let params = new HttpParams().set('limit', limit.toString());
    if (cursor) {
      params = params.set('cursor', cursor.toString());
    }

    return this.http.get<PaginatedCommentsDto>(`${this.commentsBaseUrl}/${postId}`, {params});
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.commentsBaseUrl}/${id}`);
  }
}
