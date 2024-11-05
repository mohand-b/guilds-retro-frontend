import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EMPTY, forkJoin, switchMap, tap} from 'rxjs';

import {ProfileFacade} from "../../profile.facade";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {CharacterColorPipe, CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {JobImagePipe} from "../../../../shared/pipes/job-image.pipe";
import {JobDto} from "../../state/jobs/job.model";
import {JobDisplayComponent} from "../../components/job-display/job-display.component";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {Location} from "@angular/common";
import {PostDto} from "../../../feed/state/posts/post.model";
import {PostSummaryComponent} from "../../components/post-summary/post-summary.component";
import {QuestionnaireComponent} from "../questionnaire/questionnaire.component";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {UserDto} from "../../state/users/user.model";
import {AddJobComponent} from "../../components/add-job/add-job.component";
import {AddLinkedAccountComponent} from "../../components/add-linked-account/add-linked-account.component";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {ButtonModule} from "primeng/button";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CharacterIconPipe,
    JobImagePipe,
    JobDisplayComponent,
    PostSummaryComponent,
    RouterLink,
    QuestionnaireComponent,
    AlertComponent,
    PageBlockComponent,
    ButtonModule,
    CharacterColorPipe,
    InputNumberModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  public profile: WritableSignal<UserDto | undefined> = signal(undefined);
  public currentUser: Signal<UserDto | undefined> | null = null;
  public profileToUse = computed(() => this.currentUser ? this.currentUser() : this.profile());
  public posts: WritableSignal<PostDto[]> = signal<PostDto[]>([]);

  public editMode: WritableSignal<boolean> = signal(false);

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

  characterLevelControl = new FormControl(0);

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
          this.characterLevelControl.setValue(this.currentUser()!.characterLevel);
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
    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir retirer le métier ${job.name} ?`
    );

    ref.onClose.pipe(
      switchMap(result => result ? this.profileFacade.removeJobFromUser(job.id) : EMPTY)
    ).subscribe();
  }

  onAddJob(isForgemaging: boolean, user: UserDto) {
    const ref = this.genericModalService.open(
      `Ajouter un métier ${isForgemaging ? "(forgemagie)" : ""}`,
      {primary: 'Ajouter'},
      'md',
      {isForgemaging, user},
      AddJobComponent,
      undefined,
      true,
      true
    );

    ref.onClose.pipe(
      switchMap(job => job ? this.profileFacade.addJobToUser(job) : EMPTY)
    ).subscribe();
  }

  onEditJobLevel(job: JobDto, newJobLevel: number) {
    this.profileFacade.updateJobLevel(job.id, newJobLevel).subscribe();
  }


  navigateToCurrentUsersProfile() {
    this.router.navigate(['profile']);
  }

  onHideProfile(hideProfile: boolean) {
    const hideProfileMessage: string = 'Les informations de ton profil ne seront plus visibles par les autres utilisateurs.';
    const showProfileMessage: string = 'Les informations de ton profil seront visibles par les autres utilisateurs.';

    const ref = this.genericModalService.open(
      hideProfile ? 'Cacher mon profil' : 'Afficher mon profil',
      {primary: 'Confirmer', icon: hideProfile ? 'pi pi-eye-slash' : 'pi pi-eye'},
      'sm',
      null,
      null,
      hideProfile ? hideProfileMessage : showProfileMessage,
    );

    ref.onClose.pipe(
      switchMap(result => result ? this.profileFacade.updateHideProfile(hideProfile) : EMPTY)
    ).subscribe();
  }

  onAddLinkedAccount() {
    const ref = this.genericModalService.open(
      'Lier un compte à mon profil',
      {primary: 'Envoyer la demande'},
      'md',
      null,
      AddLinkedAccountComponent,
      undefined,
      true
    );

    ref.onClose.pipe(
      switchMap((user: UserDto) =>
        user ? this.profileFacade.requestLinkAccount(user.id) : EMPTY
      )
    ).subscribe();
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
  }

  goBack() {
    this.location.back();
  }

  updateProfile() {
    this.profileFacade.updateLevel(this.characterLevelControl.value as number).subscribe(
      () => this.editMode.set(false)
    );
  }
}
