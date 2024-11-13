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
import {MatMenuTrigger} from "@angular/material/menu";
import {DateTime} from "luxon";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {ReportFormComponent} from "../../../../shared/components/report-form/report-form.component";
import {CreateReportDto, ReportTypeEnum} from "../../../console/state/reports/report.model";
import {ReportsService} from "../../../console/state/reports/reports.service";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CharacterIconPipe,
    DateFormatPipe,
    GuildMembershipPipe,
    RouterLink,
    MatMenuTrigger,
    LineClampDirective,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    OverlayPanelModule
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
export class PostComponent implements OnInit {
  public post: WritableSignal<PostDto | undefined> = signal(undefined);
  public currentUser: Signal<UserDto | undefined> = inject(AuthenticatedFacade).currentUser;
  public recentComments: WritableSignal<CommentDto[]> = signal([]);
  public comments: WritableSignal<CommentDto[]> = signal([]);
  public filteredComments = computed(() =>
    [...this.recentComments(), ...this.comments()].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  public showMore = false;
  public isClamped = false;
  public hasMoreComments = false;
  public cursor?: number;

  commentControl = new FormControl('');

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly feedFacade = inject(FeedFacade);
  private readonly genericModalService = inject(GenericModalService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const postId = Number(params.get('id'));
        return this.feedFacade.getPost(postId);
      })
    ).subscribe(post => {
      const localDate = DateTime.fromISO(post.createdAt, {zone: 'utc'})
        .setZone(DateTime.local().zoneName)
        .toLocaleString(DateTime.DATETIME_MED);
      this.post.set(post);
    });
  }

  shouldShowLoadComments(): boolean {
    return this.post()!.commentCount > 0 && this.filteredComments().length < this.post()!.commentCount;
  }

  shouldShowSeeMore(): boolean {
    return this.comments().length > 0;
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

  deleteComment(commentId: number) {
    this.feedFacade.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update((comments) => comments.filter((comment) => comment.id !== commentId));
        this.recentComments.update((comments) => comments.filter((comment) => comment.id !== commentId));
      },
    });
  }

  loadComments(postId: number) {
    this.feedFacade.getPaginatedComments(postId, this.cursor).subscribe({
      next: (paginatedComments) => {
        const newComments = paginatedComments.comments.filter(
          (comment) =>
            !this.comments().some((existingComment) => existingComment.id === comment.id) &&
            !this.recentComments().some((existingComment) => existingComment.id === comment.id)
        );

        this.comments.update((comments) => [...comments, ...newComments]);
        this.hasMoreComments = !!paginatedComments.cursor;

        if (newComments.length > 0) {
          this.cursor = paginatedComments.cursor;
        }
      },
      error: (error) => console.error(error),
    });
  }

  get isLiked(): boolean {
    return this.post()!.likes.some(like => like.user.id === this.currentUser()!.id);
  }

  get likesCount(): number {
    return this.post()!.likes.length;
  }


  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  handleContentClamped(clamped: boolean) {
    this.isClamped = clamped;
  }

  likePost(postId: number) {
    this.post.update(post => (
      {...post!, likes: [...post!.likes, {user: this.currentUser()!}]}
    ) as PostDto);

    this.feedFacade.likePost(postId).subscribe({
      error: () => {
        this.post.update(post => (
          {...post!, likes: post!.likes.filter(like => like.user.id !== this.currentUser()!.id)}
        ));
      }
    });
  }

  unlikePost(postId: number) {
    const oldLikes = this.post()!.likes;
    this.post.update(post => (
      {...post, likes: post!.likes.filter(like => like.user.id !== this.currentUser()!.id)}
    ) as PostDto);

    this.feedFacade.unlikePost(postId).subscribe({
      error: () => {
        this.post.update(post => (
          {...post, likes: oldLikes}
        ) as PostDto);
      }
    });
  }

  deletePost(postId: number) {
    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir supprimer ce post ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.feedFacade.deletePost(postId) : EMPTY)
    ).subscribe(() => this.router.navigate(['/dashboard']));
  }

  reportPost(postId: number) {
    const dialogRef = this.genericModalService.open(
      'Signaler le post',
      {primary: 'Signaler'},
      'sm',
      null,
      ReportFormComponent,
      undefined,
      true,
      true
    );

    dialogRef.onClose.pipe(
      switchMap((report: Pick<CreateReportDto, 'reason' | 'reasonText'>) => {
        if (report) {
          const createReportDto: CreateReportDto = {
            entityId: postId,
            entityType: ReportTypeEnum.POST,
            reason: report.reason,
            reasonText: report.reasonText,
          };
          return this.reportsService.report(createReportDto);
        }
        return EMPTY;
      })
    ).subscribe();
  }

  reportComment(commentId: number) {
    const dialogRef = this.genericModalService.open(
      'Signaler le commentaire',
      {primary: 'Signaler'},
      'sm',
      null,
      ReportFormComponent,
      undefined,
      true,
      true
    );

    dialogRef.onClose.pipe(
      switchMap((report: Pick<CreateReportDto, 'reason' | 'reasonText'>) => {
        if (report) {
          const createReportDto: CreateReportDto = {
            entityId: commentId,
            entityType: ReportTypeEnum.COMMENT,
            reason: report.reason,
            reasonText: report.reasonText,
          };
          return this.reportsService.report(createReportDto);
        }
        return EMPTY;
      })
    ).subscribe();
  }


  goBack() {
    this.location.back();
  }

}
