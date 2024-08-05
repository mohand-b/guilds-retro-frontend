import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {MatIcon} from "@angular/material/icon";
import {FeedFacade} from "../../feed.facade";
import {RouterLink} from "@angular/router";
import {PostFeedDto} from "../../state/feed/feed.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {LineClampDirective} from "../../../../shared/directives/line-clamp.directive";

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
    DateFormatPipe,
    NgOptimizedImage,
    LineClampDirective
  ],
  providers: [LineClampDirective],
  templateUrl: './feed-post.component.html',
  styles: ``
})
export class FeedPostComponent {

  @Input() post!: PostFeedDto;
  @Input() currentUser!: UserDto;
  public showMore = false;
  public isClamped = false;

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

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  handleContentClamped(clamped: boolean) {
    this.isClamped = clamped;
  }
}
