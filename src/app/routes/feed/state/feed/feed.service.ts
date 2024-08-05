import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {FeedDto} from "./feed.model";

@Injectable({providedIn: 'root'})
export class FeedService {

  private http = inject(HttpClient);

  private readonly feedBaseUrl = `${environment.apiUrl}/feed`;

  getFeed(page: number = 1, limit: number = 10): Observable<FeedDto[]> {
    return this.http.get<FeedDto[]>(
      `${this.feedBaseUrl}?page=${page}&limit=${limit}`,
    );
  }


  updateFeedPreference(feedClosingToGuildAndAllies: boolean): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/users/feed-preference`,
      {feedClosingToGuildAndAllies},
    );
  }
}
