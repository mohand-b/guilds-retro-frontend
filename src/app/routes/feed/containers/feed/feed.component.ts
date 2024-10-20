import {Component, DestroyRef, HostListener, inject, Input, Signal} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {FeedPostComponent} from "../../components/feed-post/feed-post.component";
import {FeedFacade} from "../../feed.facade";
import {FeedEventComponent} from "../../components/feed-event/feed-event.component";
import {GenericModalService} from '../../../../shared/services/generic-modal.service';
import {FeedDto} from "../../state/feed/feed.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserDto} from "../../../profile/state/users/user.model";
import {EMPTY, switchMap} from "rxjs";
import {CreatePostModalComponent} from "../../components/create-post-modal/create-post-modal.component";
import {CreatePost} from "../../state/posts/post.model";
import {toFormData} from "../../../../shared/extensions/object.extension";
import {BadgeModule} from "primeng/badge";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CharacterIconPipe,
    FeedPostComponent,
    FeedEventComponent,
    BadgeModule,
    PageBlockComponent,
    ToggleButtonModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    Button
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-in', style({opacity: 1})),
      ])
    ])
  ]
})
export class FeedComponent {
  @Input() currentUser!: UserDto;

  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  private feedFacade = inject(FeedFacade);
  feedClosingToGuildAndAllies: Signal<boolean> = this.feedFacade.feedClosingToGuildAndAllies;
  isFeedComplete: Signal<boolean> = this.feedFacade.isFeedComplete;
  feed: Signal<FeedDto[]> = this.feedFacade.feed;
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
      'xl',
      {},
      CreatePostModalComponent,
      undefined,
      true
    );

    ref.onClose.pipe(
      switchMap((post: CreatePost) => post ? this.feedFacade.createPost(toFormData(post)) : EMPTY)
    ).subscribe();

  }

  toggleFeedClosingToGuildAndAllies(checked: any) {
    const messageForLock = "Seuls les membres de votre guilde et de ses alliés pourront voir vos publications et vous les leurs.";
    const messageForUnlock = "Tout le monde peut voir vos publications, à condition qu'ils aient aussi leur fil d'actualité ouvert à tous. Et vous verrez aussi les publications de tous les utilisateurs qui ont ce paramètre ouvert.";
    const ref = this.genericModalService.open(
      checked ? "Fermer son fil d'actualité" : "Ouvrir son fil d'actualité",
      {
        primary: 'Confirmer',
        icon: checked ? 'pi pi-lock' : 'pi pi-lock-open'
      },
      'md',
      null,
      undefined,
      checked ? messageForLock : messageForUnlock
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.feedFacade.updateFeedPreference(checked) : EMPTY)
    ).subscribe();
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
