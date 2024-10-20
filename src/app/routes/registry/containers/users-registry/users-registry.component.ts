import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CharacterClassEnum} from "../../../profile/state/users/user.model";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {RouterLink} from "@angular/router";
import {JobNameEnum, MagusJobNameEnum} from "../../../profile/state/jobs/job.model";
import {SortAlphabeticallyPipe} from "../../../../shared/pipes/sort-alphabetically.pipe";
import {RegistryFacade} from "../../registry.facade";
import {CustomPaginatorComponent} from "../../../../shared/components/custom-paginator/custom-paginator.component";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {SortByPipe} from "../../../../shared/pipes/sort-by.pipe";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {CharacterColorPipe, CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-users-registry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SortAlphabeticallyPipe,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    AutoCompleteModule,
    SortByPipe,
    PaginatorModule,
    CharacterIconPipe,
    NgOptimizedImage,
    CharacterColorPipe,
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
  paginationData = this.registryFacade.usersRegistryPaginationData;
  usersFilter = this.registryFacade.usersFilter;

  page = 0;

  ngOnInit(): void {
    if (this.usersFilter()) {
      this.searchForm.patchValue(this.usersFilter());
    }
  }

  filterCharacterClasses(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    if (query) {
      this.characterClasses = Object.values(CharacterClassEnum).filter((characterClass) =>
        characterClass.toLowerCase().includes(query));
    } else {
      this.characterClasses = Object.values(CharacterClassEnum);
    }
  }

  filterJobs(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    if (query) {
      this.jobs = this.allJobs.filter((job) => job.toLowerCase().includes(query));
    } else {
      this.jobs = [...this.allJobs];
    }
  }

  onSearchUsers(pageEvent?: number) {
    this.registryFacade.searchUsers(
      {...this.searchForm.value, page: pageEvent ?? 1}
    ).subscribe();
  }

  onPageChange(event: PaginatorState) {
    const nextPage = event.page! + 1;
    this.onSearchUsers(nextPage);
  }

  isValidJobName(jobName: string): boolean {
    return this.allJobs.includes(jobName);
  }

  resetSearchForm() {
    this.searchForm.reset();
    this.registryFacade.resetUsersFilter();
  }
}
