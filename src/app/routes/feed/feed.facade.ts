import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {
  addEntities,
  deleteEntities,
  getAllEntities,
  selectAllEntities,
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
import {FeedDto} from "./state/feed/feed.model";
import {
  getPaginationData,
  selectPaginationData,
  setPage,
  skipWhilePageExists,
  withPagination
} from '@ngneat/elf-pagination';

export const FEED_STORE_NAME = 'feed';


export const feedStore = createStore(
  {
    name: FEED_STORE_NAME,
  },
  withEntities<FeedDto>(),
  withPagination(),
  withProps<{ feedClosingToGuildAndAllies: boolean }>({
    feedClosingToGuildAndAllies: authenticatedStore.value.user?.feedClosingToGuildAndAllies!
  }),
);

@Injectable({providedIn: 'root'})
export class FeedFacade {
  feed$: Signal<FeedDto[]> = toSignal(feedStore.pipe(
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
  pagination = toSignal(feedStore.pipe(selectPaginationData()));


  private feedService = inject(FeedService);
  private postsService = inject(PostsService);
  private likesService = inject(LikesService);

  loadFeed(page: number, limit: number): Observable<FeedDto[]> {
    return this.feedService.getFeed(page, limit).pipe(
      tap({
        next: (feedItems: FeedDto[]) => {
          feedStore.update(
            addEntities(feedItems),
            setPage(page, feedItems.map(item => item.id))
          );
        },
        error: (error) => console.error(error),
      }),
      skipWhilePageExists(feedStore, page)
    );
  }

  getPageData() {
    return feedStore.query(getPaginationData());
  }

  createPost(postFormData: FormData): Observable<FeedDto> {
    return this.postsService.create(postFormData).pipe(
      tap({
        next: (post: FeedDto) => feedStore.update(addEntities(post)),
        error: (error) => console.error(error),
      }),
    );
  }

  deletePost(postId: number): Observable<void> {
    return this.postsService.delete(postId).pipe(
      tap({
        next: () => {
          const feedItem = feedStore.query(getAllEntities()).find(entity => entity.post && entity.post.id === postId);
          if (feedItem) feedStore.update(deleteEntities(feedItem.id));
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
          const feedItem = feedStore.query(getAllEntities())
            .find(entity => entity.post && entity.post.id === postId);
          if (feedItem) {
            feedStore.update(updateEntities(feedItem.id, (entity) => ({
              ...entity,
              post: {
                ...entity.post!,
                likes: [...entity.post!.likes, like]
              }
            })));
          }
        },
        error: (error) => console.error(error),
      }),
    );
  }

  unlikePost(postId: number): Observable<void> {
    return this.likesService.unlikePost(postId).pipe(
      tap({
        next: () => {
          const feedItem = feedStore.query(getAllEntities())
            .find(entity => entity.post && entity.post.id === postId);
          if (feedItem) {
            feedStore.update(updateEntities(feedItem.id, (entity) => ({
              ...entity,
              post: {
                ...entity.post!,
                likes: entity.post!.likes.filter(like => like.user.id !== authenticatedStore.value.user!.id)
              }
            })));
          }
        },
        error: (error) => console.error(error),
      }),
    );
  }


}
