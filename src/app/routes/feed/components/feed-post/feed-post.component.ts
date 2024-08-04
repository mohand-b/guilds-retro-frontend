import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgIf} from "@angular/common";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {MatIcon} from "@angular/material/icon";
import {FeedFacade} from "../../feed.facade";
import {RouterLink} from "@angular/router";
import {PostFeedDto} from "../../state/feed/feed.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";

@Component({
  selector: 'app-feed-post',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CharacterIconPipe,
    DatePipe,
    GuildMembershipPipe,
    NgIf,
    MatIcon,
    RouterLink,
    DateFormatPipe
  ],
  templateUrl: './feed-post.component.html',
  styles: ``
})
export class FeedPostComponent {

  @Input() post!: PostFeedDto;
  @Input() currentUser!: UserDto;

  private feedFacade = inject(FeedFacade);

  get isLiked(): boolean {
    return this.post.likes.some(like => like.user.id === this.currentUser.id);
  }

  get likesCount(): number {
    return this.post.likes.length;
  }

  likePost() {
    this.feedFacade.likePost(this.post.id).subscribe();
  }

  unlikePost() {
    this.feedFacade.unlikePost(this.post.id).subscribe();
  }
}
