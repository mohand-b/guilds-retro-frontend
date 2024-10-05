import {Component, DestroyRef, HostListener, inject, Input, Signal} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {FeedPostComponent} from "../../components/feed-post/feed-post.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {FeedFacade} from "../../feed.facade";
import {FeedEventComponent} from "../../components/feed-event/feed-event.component";
import {GenericModalService} from '../../../../shared/services/generic-modal.service';
import {FeedDto} from "../../state/feed/feed.model";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserDto} from "../../../profile/state/users/user.model";
import {EMPTY, switchMap} from "rxjs";
import {CreatePostModalComponent} from "../../components/create-post-modal/create-post-modal.component";
import {CreatePost} from "../../state/posts/post.model";
import {toFormData} from "../../../../shared/extensions/object.extension";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CharacterIconPipe,
    FeedPostComponent,
    MatSlideToggle,
    NgForOf,
    FeedEventComponent,
    MatProgressSpinnerModule,
    BadgeModule
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  @Input() currentUser!: UserDto;
  public dialog = inject(MatDialog);
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  private feedFacade = inject(FeedFacade);
  isFeedComplete: Signal<boolean> = this.feedFacade.isFeedComplete;
  feed: Signal<FeedDto[]> = this.feedFacade.feed;
  feedClosingToGuildAndAllies: Signal<boolean> = this.feedFacade.feedClosingToGuildAndAllies;
  private destroyRef: DestroyRef = inject(DestroyRef);

  private genericModalService = inject(GenericModalService);

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollPosition = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (scrollPosition < 1) {
      if (!this.isLoading && !this.isFeedComplete()) {
        this.loadNextPage();
      }
    }
  }

  openCreatePostModal() {
    const ref = this.genericModalService.open(
      'Créer une publication',
      {primary: 'Poster'},
      'md',
      {},
      CreatePostModalComponent,
      undefined,
      true
    );

    ref.onClose.pipe(
      switchMap((post: CreatePost) => post ? this.feedFacade.createPost(toFormData(post)) : EMPTY)
    ).subscribe();

  }

  toggleFeedClosingToGuildAndAllies(checked: boolean) {
    this.feedFacade.updateFeedPreference(checked).subscribe();
  }

  loadNextPage(): void {
    if (this.isLoading || this.isFeedComplete()) return;

    this.isLoading = true;
    this.feedFacade.loadFeed(this.currentPage + 1, this.pageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.currentPage++;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

}
