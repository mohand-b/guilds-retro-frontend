import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ProfileFacade} from "../../profile.facade";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap, tap} from "rxjs";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {NgForOf, NgIf} from "@angular/common";
import {JobImagePipe} from "../../../../shared/pipes/job-image.pipe";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {JobDto} from "../../state/jobs/job.model";
import {MatIcon} from "@angular/material/icon";
import {JobDisplayComponent} from "../../components/job-display/job-display.component";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {AddJobComponent} from "../../components/add-job/add-job.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CharacterIconPipe,
    NgIf,
    NgForOf,
    JobImagePipe,
    MatProgressBar,
    MatProgressSpinner,
    MatIcon,
    JobDisplayComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  public profile: WritableSignal<UserDto | undefined> = signal(undefined);
  public currentUser: Signal<UserDto | undefined> | null = null;
  public profileToUse = computed(() => this.currentUser ? this.currentUser() : this.profile());
  nonForgemagingJobs: Signal<(JobDto | null)[]> = computed(() => {
    if (!this.profileToUse()) return [];
    const jobs = this.profileToUse()!.jobs.filter((job: JobDto) => !job.isForgemaging);
    return [...jobs, ...Array(3 - jobs.length).fill(null)].slice(0, 3);
  })
  forgemagingJobs: Signal<(JobDto | null)[]> = computed(() => {
    if (!this.profileToUse()) return [];
    const jobs = this.profileToUse()!.jobs.filter((job: JobDto) => job.isForgemaging);
    return [...jobs, ...Array(3 - jobs.length).fill(null)].slice(0, 3);
  })

  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  private readonly profileFacade = inject(ProfileFacade);
  private route = inject(ActivatedRoute)
  isCurrentUser: boolean = !this.route.snapshot.paramMap.get('username');
  private router = inject(Router)
  private genericModalService = inject(GenericModalService);

  ngOnInit(): void {

    this.route.paramMap.pipe(
      switchMap((params) => {
        const username = params.get('username');
        if (username) {
          if (username.toLowerCase() !== this.authenticatedFacade.currentUser()!.username.toLowerCase()) {
            return this.profileFacade.getUserByUsername(username).pipe(
              tap({
                  next: (user) => {
                    this.profile.set(user);
                  },
                  error: () => {
                    this.navigateToCurrentUsersProfile();
                  }
                }
              ));
          } else {
            this.navigateToCurrentUsersProfile();
          }
        } else {
          this.currentUser = this.authenticatedFacade.currentUser;
        }
        return [];
      })
    ).subscribe();
  }

  onRemoveJob(jobId: number) {
    this.profileFacade.removeJobFromUser(jobId).subscribe();
  }

  navigateToCurrentUsersProfile() {
    this.router.navigate(['profile']);
  }

  onAddJob(isForgemaging: boolean) {
    this.genericModalService.open(
      'Ajouter un métier',
      {primary: 'Ajouter'},
      'sm',
      {isForgemaging},
      AddJobComponent,
      undefined,
      true
    ).subscribe((job) => {
      if (job) {
        this.profileFacade.addJobToUser(job).subscribe();
      }
    });
  }

  onEditJobLevel(id: number, level: number) {

  }
}
