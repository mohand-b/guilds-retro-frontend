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
    MatIcon
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  public user: WritableSignal<UserDto | undefined> = signal(undefined);
  nonForgemagingJobs: Signal<(JobDto | null)[]> = computed(() => {
    const jobs = this.user()!.jobs.filter((job: JobDto) => !job.isForgemaging);
    return [...jobs, ...Array(3 - jobs.length).fill(null)].slice(0, 3);
  })
  forgemagingJobs: Signal<(JobDto | null)[]> = computed(() => {
    const jobs = this.user()!.jobs.filter((job: JobDto) => job.isForgemaging);
    return [...jobs, ...Array(3 - jobs.length).fill(null)].slice(0, 3);
  })
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  private readonly profileFacade = inject(ProfileFacade);
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  get isCurrentUser(): boolean {
    return this.authenticatedFacade.currentUser()?.id === this.user()?.id;
  }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      switchMap((params) => {
        const username = params.get('username');
        if (username) {
          return this.profileFacade.getUserByUsername(username).pipe(
            tap({
                next: (user) => {
                  console.log(user);
                  this.user.set(user);
                },
                error: (error) => {
                  this.router.navigate(['profile']);
                }
              }
            ));
        } else {
          console.log('No username');
          console.log(this.authenticatedFacade.currentUser());
          this.user.set(this.authenticatedFacade.currentUser());
        }
        return [];
      })
    ).subscribe();
  }

}
