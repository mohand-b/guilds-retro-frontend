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

  getPaginatedComments(postId: number, page?: number, limit?: number): Observable<PaginatedCommentsDto> {
    let params = new HttpParams();

    if (page) {
      params = params.set('page', page.toString());
    }

    if (limit) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<PaginatedCommentsDto>(
      `${this.commentsBaseUrl}/${postId}`,
      {params},
    );
  }
}
