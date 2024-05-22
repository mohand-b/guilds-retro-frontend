import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {addEntities, selectAllEntities, setEntities, updateEntities, withEntities} from "@ngneat/elf-entities";
import {inject, Injectable, Signal} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {FeedService} from "./state/feed/feed.service";
import {CreatePost, Post} from "./state/posts/post.model";
import {PostsService} from "./state/posts/posts.service";
import {authenticatedStore} from "../authenticated/authenticated.facade";
import {LikesService} from "./state/likes/likes.service";
import {LikeDto} from "./state/likes/like.model";

export const FEED_STORE_NAME = 'feed';

export const feedStore = createStore(
  {
    name: FEED_STORE_NAME,
  },
  withEntities<Post>(),
  withProps<{ feedClosingToGuildAndAllies: boolean }>({
    feedClosingToGuildAndAllies: authenticatedStore.value.user?.feedClosingToGuildAndAllies!
  }),
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

  feedClosingToGuildAndAllies$: Signal<boolean> = toSignal(feedStore.pipe(
      select(state => state.feedClosingToGuildAndAllies)),
    {initialValue: authenticatedStore.value.user?.feedClosingToGuildAndAllies!}
  );

  private feedService = inject(FeedService);
  private postsService = inject(PostsService);
  private likesService = inject(LikesService);

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

  updateFeedPreference(feedClosingToGuildAndAllies: boolean): Observable<void> {
    return this.feedService.updateFeedPreference(feedClosingToGuildAndAllies).pipe(
      tap({
        next: () => {
          feedStore.update(setProps({feedClosingToGuildAndAllies}))
          authenticatedStore.update(setProps((state) => {
            state.user!.feedClosingToGuildAndAllies = feedClosingToGuildAndAllies;
            return state;
          }))
        },
        error: (error) => console.error(error),
      }),
    );
  }

  likePost(postId: number): Observable<LikeDto> {
    return this.likesService.likePost(postId).pipe(
      tap({
        next: (like: LikeDto) => {
          feedStore.update(updateEntities(like.post.id, (post) => ({
              ...post,
              likes: [...post.likes, like],
            }))
          );
        },
        error: (error) => console.error(error),
      }),
    );
  }

  unlikePost(postId: number): Observable<void> {
    return this.likesService.unlikePost(postId).pipe(
      tap({
        next: () => {
          feedStore.update(updateEntities(postId, (post) => ({
              ...post,
              likes: post.likes.filter(like => like.user.id !== authenticatedStore.value.user!.id),
            }))
          );
        },
        error: (error) => console.error(error),
      }),
    )
  }


}
