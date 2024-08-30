import {Component, effect, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CharacterClassEnum} from "../../../profile/state/users/user.model";
import {MatFormField} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {RouterLink} from "@angular/router";
import {JobNameEnum, MagusJobNameEnum} from "../../../profile/state/jobs/job.model";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {SortAlphabeticallyPipe} from "../../../../shared/pipes/sort-alphabetically.pipe";
import {MatButtonModule} from "@angular/material/button";
import {RegistryFacade} from "../../registry.facade";
import {CustomPaginatorComponent} from "../../../../shared/components/custom-paginator/custom-paginator.component";

@Component({
  selector: 'app-users-registry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    MatAutocompleteModule,
    SortAlphabeticallyPipe,
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomPaginatorComponent},
  ],
  templateUrl: './users-registry.component.html',
  styleUrl: './users-registry.component.scss'
})
export class UsersRegistryComponent implements OnInit {

  jobNames: string[] = Object.values(JobNameEnum);
  magusJobNames: string[] = Object.values(MagusJobNameEnum);
  allJobs = this.jobNames.concat(this.magusJobNames);
  jobs = [...this.allJobs];
  characterClasses = Object.values(CharacterClassEnum);
  private fb = inject(FormBuilder);
  searchForm: FormGroup = this.fb.group({
    username: [undefined],
    characterClass: [undefined],
    characterLevel: [undefined],
    jobName: [undefined],
    jobLevel: [undefined]
  });
  private registryFacade = inject(RegistryFacade);
  usersResults = this.registryFacade.usersResults;
  paginationData = this.registryFacade.paginationData;
  usersFilter = this.registryFacade.usersFilter;
  usersFilterUpdated = effect(() => {
    if (this.usersFilter()) {
      this.searchForm.patchValue(this.usersFilter());
    }
  })

  ngOnInit(): void {
    this.searchForm.get('jobName')?.valueChanges.subscribe((jobName: string) => {
      if (jobName && jobName.length >= 3) {
        this.jobs = this.allJobs.filter(job =>
          job.toLowerCase().includes(jobName.toLowerCase())
        );
      } else {
        this.jobs = [...this.allJobs];
      }
    });
  }


  onSearchUsers(pageEvent?: number) {
    this.registryFacade.searchUsers(
      {...this.searchForm.value, page: pageEvent ? pageEvent : 1}
    ).subscribe();
  }

  onPageChange(event: PageEvent) {
    const nextPage = event.pageIndex + 1;
    this.onSearchUsers(nextPage);
  }

  isValidJobName(jobName: string): boolean {
    return this.allJobs.includes(jobName);
  }
}
