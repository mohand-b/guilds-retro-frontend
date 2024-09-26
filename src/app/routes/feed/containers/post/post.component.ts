import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FeedFacade} from "../../feed.facade";
import {PostDto} from "../../state/posts/post.model";
import {EMPTY, switchMap} from "rxjs";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../profile/state/users/user.model";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {LineClampDirective} from "../../../../shared/directives/line-clamp.directive";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CharacterIconPipe,
    DateFormatPipe,
    GuildMembershipPipe,
    MatIcon,
    MatMenu,
    MatMenuItem,
    RouterLink,
    MatMenuTrigger,
    LineClampDirective
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  public post: WritableSignal<PostDto | undefined> = signal(undefined);
  public showMore = false;
  public isClamped = false;
  private readonly activatedRoute = inject(ActivatedRoute);
  private feedFacade = inject(FeedFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);
  public currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  private genericModalService = inject(GenericModalService);

  get isLiked(): boolean {
    return this.post()!.likes.some(like => like.user.id === this.currentUser()!.id);
  }

  get likesCount(): number {
    return this.post()!.likes.length;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const postId = Number(params.get('id'));
        return this.feedFacade.getPost(postId);
      })
    ).subscribe(post => this.post.set(post));
  }

  likePost() {
    this.feedFacade.likePost(this.post()!.id).subscribe();
  }

  unlikePost() {
    this.feedFacade.unlikePost(this.post()!.id).subscribe();
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
        if (result) return this.feedFacade.deletePost(this.post()!.id)
        else return EMPTY;
      })
    ).subscribe();
  }

  reportPost() {

  }

}
