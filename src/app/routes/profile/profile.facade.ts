import {inject, Injectable} from "@angular/core";
import {UsersService} from "./state/users/users.service";
import {Observable, tap} from "rxjs";
import {UserDto} from "../authenticated/state/authed/authed.model";
import {AddJobDto, JobDto} from "./state/jobs/job.model";
import {JobsService} from "./state/jobs/jobs.service";
import {
  AUTHENTICATED_STORE_NAME,
  authenticatedStore,
  trackAuthedRequestsStatus
} from "../authenticated/authenticated.facade";
import {updateRequestStatus} from "@ngneat/elf-requests";
import {PostsService} from "../feed/state/posts/posts.service";
import {PostDto} from "../feed/state/posts/post.model";

@Injectable({providedIn: 'root'})
export class ProfileFacade {

  private usersService = inject(UsersService);
  private jobsService = inject(JobsService);
  private postsService = inject(PostsService);

  getUserByUsername(username: string): Observable<UserDto> {
    return this.usersService.getUserByUsername(username);
  }

  addJobToUser(addJobDto: AddJobDto): Observable<JobDto> {
    return this.jobsService.addJob(addJobDto).pipe(
      tap({
        next: (job) => {
          authenticatedStore.update(
            (state) => (
              {...state, user: {...state.user, jobs: [...state.user!.jobs, job]} as UserDto}
            ),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
        },
        error: (error) => console.log(error),
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    )
  }

  removeJobFromUser(jobId: number): Observable<void> {
    return this.jobsService.removeJob(jobId).pipe(
      tap({
        next: () => {
          authenticatedStore.update(
            (state) => {
              const updatedJobs = state.user?.jobs.filter(job => job.id !== jobId) || [];

              return {
                ...state,
                user: {
                  ...state.user,
                  jobs: updatedJobs,
                } as UserDto,
                token: state.token,
                requests: state.requests,
                requestsStatus: state.requestsStatus,
              };
            },
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
        },
        error: (error) => console.log(error),
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    )
  }

  updateJobLevel(jobId: number, level: number): Observable<JobDto> {
    return this.jobsService.updateJobLevel(jobId, level).pipe(
      tap({
        next: (job) => {
          authenticatedStore.update(
            (state) => (
              {...state, user: {...state.user, jobs: state.user!.jobs.map(j => j.id === jobId ? job : j)} as UserDto}
            ),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
        },
        error: (error) => console.log(error),
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    )
  }

  updateShowInRegistry(showInRegistry: boolean): Observable<void> {
    return this.usersService.updateShowInRegistry(showInRegistry).pipe(
      tap({
        next: (user) => {
          authenticatedStore.update(
            (state) => (
              {...state, user: {...state.user, showInRegistry} as UserDto}
            ),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
        },
        error: (error) => console.log(error),
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    )
  }

  getLastPosts(userId: number): Observable<PostDto[]> {
    return this.postsService.getLastPosts(userId);
  }


}
