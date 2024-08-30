import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {MatIcon} from "@angular/material/icon";
import {FeedFacade} from "../../feed.facade";
import {RouterLink} from "@angular/router";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {LineClampDirective} from "../../../../shared/directives/line-clamp.directive";
import {MatMenuModule} from "@angular/material/menu";
import {EMPTY, switchMap} from "rxjs";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {PostDto} from "../../state/posts/post.model";
import {UserDto} from "../../../profile/state/users/user.model";

@Component({
  selector: 'app-feed-post',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CharacterIconPipe,
    DatePipe,
    GuildMembershipPipe,
    MatMenuModule,
    MatIcon,
    RouterLink,
    DateFormatPipe,
    NgOptimizedImage,
    LineClampDirective
  ],
  templateUrl: './feed-post.component.html',
  styles: ``
})
export class FeedPostComponent {

  @Input() post!: PostDto;
  @Input() currentUser!: UserDto;
  public showMore = false;
  public isClamped = false;

  private feedFacade = inject(FeedFacade);
  private genericModalService = inject(GenericModalService);

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

  deletePost() {
    this.genericModalService.open(
      'Confirmation',
      {warn: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir supprimer ce post ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return this.feedFacade.deletePost(this.post.id)
        else return EMPTY;
      })
    ).subscribe();
  }

  reportPost() {

  }
}
