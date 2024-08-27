import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {UsersService} from "../../../profile/state/users/users.service";
import {UserSearchDto, UserSearchResponse} from "../../../profile/state/users/user.model";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {JobNameEnum, MagusJobNameEnum} from "../../../profile/state/jobs/job.model";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {SortAlphabeticallyPipe} from "../../../../shared/pipes/sort-alphabetically.pipe";
import {CharacterClassEnum} from "../../../authenticated/state/authed/authed.model";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-users-registry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatPaginatorModule,
    NgIf,
    NgForOf,
    RouterLink,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    SortAlphabeticallyPipe,
    MatButton,
  ],
  templateUrl: './users-registry.component.html',
  styleUrl: './users-registry.component.scss'
})
export class UsersRegistryComponent implements OnInit {
  searchForm!: FormGroup;
  users: any[] = [];
  totalResults: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  jobNames: string[] = Object.values(JobNameEnum);
  magusJobNames: string[] = Object.values(MagusJobNameEnum);

  allJobs = this.jobNames.concat(this.magusJobNames);
  jobs = [...this.allJobs];

  characterClasses = Object.values(CharacterClassEnum);

  constructor(private fb: FormBuilder, private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: [''],
      characterClass: [''],
      characterLevel: [null],
      jobName: [''],
      jobLevel: [null],
      page: [1],
      limit: [10],
    });

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


  onSearchUsers() {
    console.log(this.searchForm.value)
    const searchCriteria: UserSearchDto = this.searchForm.value;
    searchCriteria.page = this.currentPage;
    searchCriteria.limit = this.pageSize;

    this.usersService.searchUsers(searchCriteria).subscribe((response: UserSearchResponse) => {
      console.log(response)
      this.users = response.data;
      this.totalResults = response.total;
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.onSearchUsers();
  }
}
