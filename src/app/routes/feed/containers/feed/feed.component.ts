import {Component, DestroyRef, effect, inject, Input, Signal} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {FeedPostComponent} from "../../components/feed-post/feed-post.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {FeedFacade} from "../../feed.facade";
import {Post} from "../../state/posts/post.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CreatePostModalComponent} from "../../components/create-post-modal/create-post-modal.component";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CharacterIconPipe,
    FeedPostComponent,
    MatSlideToggle,
    NgForOf
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  @Input() currentUser!: UserDto;
  public dialog = inject(MatDialog);
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
