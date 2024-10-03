import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {FeedDto} from "./feed.model";

@Injectable({providedIn: 'root'})
export class FeedService {

  private http = inject(HttpClient);

  private readonly feedBaseUrl = `${environment.apiUrl}/feed`;

  getFeed(page: number, limit: number): Observable<{
    total: number, page: number, limit: number, data: FeedDto[]
  }> {
    return this.http.get<{
      total: number,
      page: number,
      limit: number,
      data: FeedDto[]
    }>(`${this.feedBaseUrl}?page=${page}&limit=${limit}`);
  }


  updateFeedPreference(feedClosingToGuildAndAllies: boolean): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/users/feed-preference`,
      {feedClosingToGuildAndAllies},
    );
  }
}
