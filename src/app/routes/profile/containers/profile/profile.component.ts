import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EMPTY, forkJoin, switchMap, tap} from 'rxjs';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';

import {ProfileFacade} from "../../profile.facade";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {JobImagePipe} from "../../../../shared/pipes/job-image.pipe";
import {JobDto} from "../../state/jobs/job.model";
import {JobDisplayComponent} from "../../components/job-display/job-display.component";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {AddJobComponent} from "../../components/add-job/add-job.component";
import {EditJobLevelComponent} from "../../components/edit-job-level/edit-job-level.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {Location} from "@angular/common";
import {PostDto} from "../../../feed/state/posts/post.model";
import {PostSummaryComponent} from "../../components/post-summary/post-summary.component";
import {AddLinkedAccountComponent} from "../../components/add-linked-account/add-linked-account.component";
import {QuestionnaireComponent} from "../questionnaire/questionnaire.component";
import {MatButtonModule} from "@angular/material/button";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CharacterIconPipe,
    JobImagePipe,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatIconModule,
    JobDisplayComponent,
    PostSummaryComponent,
    RouterLink,
    QuestionnaireComponent,
    MatButtonModule,
    AlertComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  public profile: WritableSignal<UserDto | undefined> = signal(undefined);
  public currentUser: Signal<UserDto | undefined> | null = null;
  public profileToUse = computed(() => this.currentUser ? this.currentUser() : this.profile());
  public posts: WritableSignal<PostDto[]> = signal<PostDto[]>([]);

  nonForgemagingJobs: Signal<(JobDto | null)[]> = computed(() => {
    const profile = this.profileToUse();
    if (!profile) return [];
    const jobs = profile.jobs.filter(job => !job.isForgemaging);
    return [...jobs, ...Array(3 - jobs.length).fill(null)].slice(0, 3);
  });

  forgemagingJobs: Signal<(JobDto | null)[]> = computed(() => {
    const profile = this.profileToUse();
    if (!profile) return [];
    const jobs = profile.jobs.filter(job => job.isForgemaging);
    return [...jobs, ...Array(3 - jobs.length).fill(null)].slice(0, 3);
  });

  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  private readonly profileFacade = inject(ProfileFacade);
  private readonly route = inject(ActivatedRoute);
  isCurrentUser: boolean = !this.route.snapshot.paramMap.get('username');
  private readonly router = inject(Router);
  private readonly genericModalService = inject(GenericModalService);
  private readonly location = inject(Location);


  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const username = params.get('username');
        if (username) {
          if (username.toLowerCase() !== this.authenticatedFacade.currentUser()!.username.toLowerCase()) {
            return this.profileFacade.getUserByUsername(username).pipe(
              tap({
                next: user => this.profile.set(user),
                error: error => this.navigateToCurrentUsersProfile()
              }),
              switchMap((user) =>
                !user.hideProfile ? this.profileFacade.getLastPosts(user.id) : EMPTY
              ),
              tap({
                next: posts => this.posts.set(posts),
              })
            );
          } else {
            this.navigateToCurrentUsersProfile();
            return EMPTY;
          }
        } else {
          this.currentUser = this.authenticatedFacade.currentUser;
          return forkJoin({
            posts: this.profileFacade.getLastPosts(this.authenticatedFacade.currentUser()!.id),
            linkedAccounts: this.profileFacade.getLinkedAccounts()
          }).pipe(
            tap({
              next: result => this.posts.set(result.posts)
            })
          );
        }
      })
    ).subscribe();

  }

  onRemoveJob(job: JobDto) {
    this.genericModalService.open(
      'Confirmation',
      {warn: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir retirer le métier ${job.name} ?`
    ).pipe(
      switchMap(result => result ? this.profileFacade.removeJobFromUser(job.id) : EMPTY)
    ).subscribe();
  }

  onAddJob(isForgemaging: boolean, user: UserDto) {
    this.genericModalService.open(
      `Ajouter un métier ${isForgemaging ? "(forgemagie)" : ""}`,
      {primary: 'Ajouter'},
      'md',
      {isForgemaging, user},
      AddJobComponent,
      undefined,
      true
    ).pipe(
      switchMap(job => job ? this.profileFacade.addJobToUser(job) : EMPTY)
    ).subscribe();
  }

  onEditJobLevel(job: JobDto) {
    this.genericModalService.open(
      `Modifier le niveau de ${job.name}`,
      {primary: 'Modifier'},
      'sm',
      {job},
      EditJobLevelComponent,
      undefined,
      true
    ).pipe(
      switchMap(updatedJob =>
        updatedJob ? this.profileFacade.updateJobLevel(updatedJob.id, updatedJob.level) : EMPTY
      )
    ).subscribe();
  }

  navigateToCurrentUsersProfile() {
    this.router.navigate(['profile']);
  }

  onHideProfile(hideProfile: boolean) {
    this.profileFacade.updateHideProfile(hideProfile).subscribe();
  }

  onAddLinkedAccount() {
    this.genericModalService.open(
      'Lier un compte à mon profil',
      {primary: 'Envoyer la demande'},
      'md',
      null,
      AddLinkedAccountComponent,
      undefined,
      true
    ).pipe(
      switchMap((user: UserDto) =>
        user ? this.profileFacade.requestLinkAccount(user.id) : EMPTY
      )
    ).subscribe()
  }

  goBack() {
    this.location.back();
  }
}
