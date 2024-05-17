import {Component, DestroyRef, inject, OnInit, Signal} from '@angular/core';
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
import {switchMap} from "rxjs";
import {GuildFacade} from "../../../guild/guild.facade";

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public dialog = inject(MatDialog);
  private authenticatedFacade = inject(AuthenticatedFacade)
  currentUser = this.authenticatedFacade.getCurrentUser() as UserDto
  private feedFacade = inject(FeedFacade);
  feed$: Signal<Post[]> = this.feedFacade.feed$;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private guildFacade = inject(GuildFacade);
  currentGuild$ = this.guildFacade.currentGuild$;

  ngOnInit() {
    this.feedFacade.setFeed().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(res => console.log('Feed:', res));

    this.guildFacade.getCurrentGuild().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((guild) => this.guildFacade.getPendingMembershipRequests(guild.id!))
    ).subscribe();
  }

  openCreatePostModal() {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Post data received:', result);
      }
    });
  }
}
