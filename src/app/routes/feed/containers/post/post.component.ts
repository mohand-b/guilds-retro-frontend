import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EMPTY, switchMap} from "rxjs";
import {Location} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {FeedFacade} from "../../feed.facade";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {PostDto} from "../../state/posts/post.model";
import {UserDto} from "../../../profile/state/users/user.model";
import {CommentDto, CreateCommentDto} from "../../state/comments/comment.model";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {LineClampDirective} from "../../../../shared/directives/line-clamp.directive";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";

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
    LineClampDirective,
    FormsModule,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
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
    ])
  ],
})
export class PostComponent implements OnInit {
  public post: WritableSignal<PostDto | undefined> = signal(undefined);
  public currentUser: Signal<UserDto | undefined> = inject(AuthenticatedFacade).currentUser;
  public recentComments: WritableSignal<CommentDto[]> = signal([]);
  public comments: WritableSignal<CommentDto[]> = signal([]);
  public initialCommentCount = computed(() => this.post()!.commentCount!);
  public filteredComments = computed(() =>
    [...this.recentComments(), ...this.comments()].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  public showMore = false;
  public isClamped = false;
  public page = 1;
  public hasMoreComments = false;

  commentControl = new FormControl('');

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly feedFacade = inject(FeedFacade);
  private readonly genericModalService = inject(GenericModalService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

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

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  handleContentClamped(clamped: boolean) {
    this.isClamped = clamped;
  }

  goBack() {
    this.location.back();
  }

  addComment(postId: number) {
    const createCommentDto: CreateCommentDto = {
      text: this.commentControl.value!,
      postId
    };

    this.feedFacade.commentPost(createCommentDto).subscribe({
      next: (comment) => this.recentComments.update(comments => [comment, ...comments]),
    });
    this.commentControl.reset();
  }

  loadComments(postId: number) {
    this.feedFacade.getPaginatedComments(postId, this.page).subscribe({
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

  likePost() {
    this.post.update(post => (
      {...post!, likes: [...post!.likes, {user: this.currentUser()!}]}
    ) as PostDto);

    this.feedFacade.likePost(this.post()!.id).subscribe({
      error: () => {
        this.post.update(post => (
          {...post!, likes: post!.likes.filter(like => like.user.id !== this.currentUser()!.id)}
        ));
      }
    });
  }

  unlikePost() {
    const oldLikes = this.post()!.likes;
    this.post.update(post => (
      {...post, likes: post!.likes.filter(like => like.user.id !== this.currentUser()!.id)}
    ) as PostDto);

    this.feedFacade.unlikePost(this.post()!.id).subscribe({
      error: () => {
        this.post.update(post => (
          {...post, likes: oldLikes}
        ) as PostDto);
      }
    });
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
        if (result) return this.feedFacade.deletePost(this.post()!.id);
        else return EMPTY;
      })
    ).subscribe(() => this.router.navigate(['/dashboard']));
  }

  reportPost() {
  }

  shouldShowLoadComments(): boolean {
    return this.initialCommentCount() > 0 && this.comments().length < this.initialCommentCount();
  }

  shouldShowSeeMore(): boolean {
    return this.comments().length > 0;
  }
}
