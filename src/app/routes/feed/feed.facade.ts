import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  setEntities,
  updateEntities,
  withEntities
} from "@ngneat/elf-entities";
import {inject, Injectable, Signal} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {FeedService} from "./state/feed/feed.service";
import {PostsService} from "./state/posts/posts.service";
import {authenticatedStore} from "../authenticated/authenticated.facade";
import {LikesService} from "./state/likes/likes.service";
import {LikeDto} from "./state/likes/like.model";
import {FeedItem, PostFeedDto} from "./state/feed/feed.model";

export const FEED_STORE_NAME = 'feed';

export const feedStore = createStore(
  {
    name: FEED_STORE_NAME,
  },
  withEntities<FeedItem, 'feedId'>({idKey: 'feedId'}),
  withProps<{ feedClosingToGuildAndAllies: boolean }>({
    feedClosingToGuildAndAllies: authenticatedStore.value.user?.feedClosingToGuildAndAllies!
  }),
);

@Injectable({providedIn: 'root'})
export class FeedFacade {
  feed$: Signal<FeedItem[]> = toSignal(feedStore.pipe(
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

  setFeed(): Observable<FeedItem[]> {
    return this.feedService.getFeed().pipe(
      tap({
        next: (feedItem: FeedItem[]) => feedStore.update(setEntities(feedItem)),
        error: (error) => console.error(error),
      }),
    );
  }

  createPost(postFormData: FormData): Observable<PostFeedDto> {
    return this.postsService.create(postFormData).pipe(
      tap({
        next: (post: PostFeedDto) => feedStore.update(addEntities(post)),
        error: (error) => console.error(error),
      }),
    );
  }

  deletePost(postId: number): Observable<void> {
    return this.postsService.delete(postId).pipe(
      tap({
        next: () => feedStore.update(deleteEntities(`post-${postId}`)),
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
    const prefixedPostId = `post-${postId}`;
    return this.likesService.likePost(postId).pipe(
      tap({
        next: (like: LikeDto) => {
          feedStore.update(updateEntities(prefixedPostId, (entity) => {
            if (entity.feedType === 'post') {
              const post = entity as PostFeedDto;
              return {
                ...post,
                likes: [...post.likes, like],
              };
            }
            return entity;
          }));
        },
        error: (error) => console.error(error),
      }),
    );
  }


  unlikePost(postId: number): Observable<void> {
    const prefixedPostId = `post-${postId}`;
    return this.likesService.unlikePost(postId).pipe(
      tap({
        next: () => {
          feedStore.update(updateEntities(prefixedPostId, (entity) => {
            if (entity.feedType === 'post') {
              const post = entity as PostFeedDto;
              return {
                ...post,
                likes: post.likes.filter(like => like.user.id !== authenticatedStore.value.user!.id),
              };
            }
            return entity;
          }));
        },
        error: (error) => console.error(error),
      }),
    );
  }


}
