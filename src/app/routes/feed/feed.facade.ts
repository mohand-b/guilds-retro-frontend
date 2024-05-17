import {createStore} from "@ngneat/elf";
import {addEntities, selectAllEntities, setEntities, withEntities} from "@ngneat/elf-entities";
import {inject, Injectable, Signal} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {FeedService} from "./state/feed/feed.service";
import {CreatePost, Post} from "./state/posts/post.model";
import {PostsService} from "./state/posts/posts.service";

export const FEED_STORE_NAME = 'feed';

export const feedStore = createStore(
  {
    name: FEED_STORE_NAME,
  },
  withEntities<Post>(),
);

@Injectable({providedIn: 'root'})
export class FeedFacade {
  feed$: Signal<Post[]> = toSignal(feedStore.pipe(
    selectAllEntities(),
    map(posts => posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  ), {
    initialValue: []
  });

  private feedService = inject(FeedService);
  private postsService = inject(PostsService);

  setFeed(): Observable<Post[]> {
    return this.feedService.getFeed().pipe(
      tap({
        next: (posts: Post[]) => feedStore.update(setEntities(posts)),
        error: (error) => console.error(error),
      }),
    );
  }

  createPost(post: CreatePost): Observable<Post> {
    return this.postsService.create(post).pipe(
      tap({
        next: (post: Post) => {
          feedStore.update(addEntities(post))
          console.log('Post created:', post)
        },
        error: (error) => console.error(error),
      }),
    );
  }
}
