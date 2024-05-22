import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {Post} from "../posts/post.model";

@Injectable({providedIn: 'root'})
export class FeedService {

  private http = inject(HttpClient);

  private readonly feedBaseUrl = `${environment.apiUrl}/feed`;

  getFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${this.feedBaseUrl}`,
    );
  }

  updateFeedPreference(feedClosingToGuildAndAllies: boolean): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/users/feed-preference`,
      {feedClosingToGuildAndAllies},
    );
  }
}
