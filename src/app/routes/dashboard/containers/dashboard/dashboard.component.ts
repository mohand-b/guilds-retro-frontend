import {Component, DestroyRef, effect, inject, Signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {CreatePostModalComponent} from "../../../feed/components/create-post-modal/create-post-modal.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {FeedFacade} from "../../../feed/feed.facade";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Post} from "../../../feed/state/posts/post.model";
import {FeedPostComponent} from "../../../feed/components/feed-post/feed-post.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormField,
    MatLabel,
    CharacterIconPipe,
    NgIf,
    MatIcon,
    DatePipe,
    NgForOf,
    FeedPostComponent,
    MatSlideToggle,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public dialog = inject(MatDialog);
  private authenticatedFacade = inject(AuthenticatedFacade)
  currentUser = this.authenticatedFacade.getCurrentUser() as UserDto
  private feedFacade = inject(FeedFacade);
  feed$: Signal<Post[]> = this.feedFacade.feed$;
  feedClosingToGuildAndAllies$: Signal<boolean> = this.feedFacade.feedClosingToGuildAndAllies$;
  private destroyRef: DestroyRef = inject(DestroyRef);

  feedPreferenceChanged = effect(() => {
    const feedPreference = this.feedClosingToGuildAndAllies$();
    this.feedFacade.setFeed().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  })

  openCreatePostModal() {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Post data received:', result);
      }
    });
  }

  toggleFeedClosingToGuildAndAllies(checked: boolean) {
    this.feedFacade.updateFeedPreference(checked).subscribe();
  }


}
