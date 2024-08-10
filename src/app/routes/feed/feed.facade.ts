import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {
  addEntities,
  deleteEntities,
  getAllEntities,
  selectAllEntities,
  setEntities,
  updateEntities,
  upsertEntities,
  withEntities
} from "@ngneat/elf-entities";
import {computed, effect, inject, Injectable, Signal} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {FeedService} from "./state/feed/feed.service";
import {PostsService} from "./state/posts/posts.service";
import {authenticatedStore} from "../authenticated/authenticated.facade";
import {LikesService} from "./state/likes/likes.service";
import {LikeDto} from "./state/likes/like.model";
import {FeedDto} from "./state/feed/feed.model";
import {
  deleteAllPages,
  getPaginationData,
  selectPaginationData,
  setPage,
  updatePaginationData,
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
  feed: Signal<FeedDto[]> = toSignal(feedStore.pipe(
    selectAllEntities(),
    map(posts => posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  ), {
    initialValue: []
  });
  feedClosingToGuildAndAllies: Signal<boolean> = toSignal(feedStore.pipe(
      select(state => state.feedClosingToGuildAndAllies)),
    {initialValue: authenticatedStore.value.user?.feedClosingToGuildAndAllies!}
  );
  pagination = toSignal(feedStore.pipe(selectPaginationData()));
  isFeedComplete: Signal<boolean> = computed(() => {
    const pagination = this.pagination();
    return pagination!.currentPage !== 0 && pagination!.currentPage >= pagination!.lastPage;
  });
  feedPrivacyUpdated = effect(() => {
    this.feedClosingToGuildAndAllies();
    this.loadFeed(1,
      this.perPage !== 0
        ? (this.perPage * this.currentPage)
        : 10,
      true
    ).subscribe();
  }, {
    allowSignalWrites: true
  })

  private feedService = inject(FeedService);
  private postsService = inject(PostsService);
  private likesService = inject(LikesService);

  get perPage(): number {
    return feedStore.query(getPaginationData()).perPage
  }

  get currentPage(): number {
    return feedStore.query(getPaginationData()).currentPage
  }

  get totalItems(): number {
    return feedStore.query(getPaginationData()).total
  }

  loadFeed(page: number, limit: number, loadFromEffect: boolean = false): Observable<FeedDto[]> {

    return this.feedService.getFeed(page, limit).pipe(
      tap({
        next: (response) => {
          const {total, page, limit, data} = response;

          if (loadFromEffect) {
            feedStore.update(
              setEntities(data),
              deleteAllPages(),
              updatePaginationData({
                currentPage: page,
                perPage: limit,
                total,
                lastPage: Math.ceil(total / limit)
              }),
              setPage(
                page,
                data.map((f) => f.id)
              )
            );
          } else {
            feedStore.update(
              upsertEntities(data),
              updatePaginationData({
                currentPage: page,
                perPage: limit,
                total,
                lastPage: Math.ceil(total / limit)
              }),
              setPage(
                page,
                data.map((f) => f.id)
              )
            );
          }
        },
        error: (error) => console.error(error),
      }),
      map(response => response.data)
    );
  }

  createPost(postFormData: FormData): Observable<FeedDto> {
    return this.postsService.create(postFormData).pipe(
      tap({
        next: (post: FeedDto) => {
          feedStore.update(addEntities(post));
          feedStore.update(
            updatePaginationData({
              currentPage: this.currentPage,
              perPage: this.perPage,
              total: this.totalItems + 1,
              lastPage: Math.ceil((this.totalItems + 1) / this.perPage),
            })
          );
        },
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
