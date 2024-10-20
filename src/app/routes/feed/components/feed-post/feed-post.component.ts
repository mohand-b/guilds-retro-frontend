import {ChangeDetectionStrategy, Component, computed, inject, Input, signal, WritableSignal} from '@angular/core';
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {FeedFacade} from "../../feed.facade";
import {RouterLink} from "@angular/router";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {LineClampDirective} from "../../../../shared/directives/line-clamp.directive";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {PostDto} from "../../state/posts/post.model";
import {UserDto} from "../../../profile/state/users/user.model";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommentDto, CreateCommentDto} from "../../state/comments/comment.model";
import {animate, style, transition, trigger} from "@angular/animations";
import {EMPTY, switchMap} from "rxjs";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {ImageModule} from "primeng/image";

@Component({
  selector: 'app-feed-post',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CharacterIconPipe,
    DatePipe,
    GuildMembershipPipe,
    RouterLink,
    DateFormatPipe,
    NgOptimizedImage,
    LineClampDirective,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    OverlayPanelModule,
    ImageModule
  ],
  templateUrl: './feed-post.component.html',
  styles: ``,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-10px)'}),
        animate('500ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
    ]),
    trigger('bump', [
      transition(':enter', [
        style({transform: 'scale(1)'}),
        animate('0.15s ease-in', style({transform: 'scale(1.3)'})),
        animate('0.15s ease-out', style({transform: 'scale(1)'}))
      ])
    ]),
    trigger('countAnimation', [
      transition(':increment', [
        style({transform: 'translateY(-100%)', opacity: 0}),
        animate('300ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':decrement', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('300ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ])
    ])
  ],
})
export class FeedPostComponent {

  @Input() post!: PostDto;
  @Input() currentUser!: UserDto;
  public showMore = false;
  public isClamped = false;
  commentControl = new FormControl('');
  public page = 1;
  public hasMoreComments = false;

  public initialCommentCount = computed(() => this.post.commentCount!);
  public recentComments: WritableSignal<CommentDto[]> = signal([]);
  public comments: WritableSignal<CommentDto[]> = signal([]);
  public filteredComments = computed(() =>
    [...this.recentComments(), ...this.comments()].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
  private feedFacade = inject(FeedFacade);
  private genericModalService = inject(GenericModalService);

  get isLiked(): boolean {
    return this.post.likes.some(like => like.user.id === this.currentUser.id);
  }

  get likesCount(): number {
    return this.post.likes.length;
  }

  shouldShowLoadComments(): boolean {
    return this.initialCommentCount() > 0 && this.comments().length < this.initialCommentCount();
  }

  shouldShowSeeMore(): boolean {
    return this.comments().length > 0;
  }

  likePost() {
    this.feedFacade.likePost(this.post.id).subscribe();
  }

  unlikePost() {
    this.feedFacade.unlikePost(this.post.id).subscribe();
  }

  addComment() {
    const createCommentDto: CreateCommentDto = {
      text: this.commentControl.value!,
      postId: this.post.id
    };

    this.feedFacade.commentPost(createCommentDto).subscribe({
      next: (comment) =>
        this.recentComments.update(comments => [comment, ...comments]),
    });
    this.commentControl.reset();
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  handleContentClamped(clamped: boolean) {
    this.isClamped = clamped;
  }

  deletePost() {
    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir supprimer ce post ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.feedFacade.deletePost(this.post.id) : EMPTY)
    ).subscribe();
  }


  reportPost() {
  }

  loadComments() {
    this.feedFacade.getPaginatedComments(this.post.id, this.page).subscribe({
      next: (paginatedComments) => {
        const newComments = paginatedComments.comments.filter(
          (comment) => !this.comments().some(existingComment => existingComment.id === comment.id) &&
            !this.recentComments().some(existingComment => existingComment.id === comment.id)
        );
        this.comments.update(comments => [...comments, ...newComments]);
        this.hasMoreComments = this.comments().length < paginatedComments.total;
        this.page++;
      },
      error: (error) => console.error(error),
    });
  }
}
