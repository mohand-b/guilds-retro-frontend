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
}
