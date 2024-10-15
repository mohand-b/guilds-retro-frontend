import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RegistryFacade} from "../../registry.facade";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {RouterLink} from "@angular/router";
import {CustomPaginatorComponent} from "../../../../shared/components/custom-paginator/custom-paginator.component";
import {SortAlphabeticallyPipe} from "../../../../shared/pipes/sort-alphabetically.pipe";
import {GuildSearchDto} from "../../state/guild-search/guild-search.model";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-guilds-registry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SortAlphabeticallyPipe,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    PaginatorModule,
    NgOptimizedImage,
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomPaginatorComponent},
  ], templateUrl: './guilds-registry.component.html',
  styleUrl: './guilds-registry.component.scss'
})
export class GuildsRegistryComponent implements OnInit {

  private fb = inject(FormBuilder);
  searchForm: FormGroup = this.fb.group({
    name: [undefined],
    minAverageLevel: [undefined],
  });
  private registryFacade = inject(RegistryFacade);
  guildsResults = this.registryFacade.guildsResults;
  paginationData = this.registryFacade.guildsRegistryPaginationData;
  guildsFilter = this.registryFacade.guildsFilter;

  page = 0;

  ngOnInit() {
    if (this.guildsFilter()) {
      this.searchForm.patchValue(this.guildsFilter());
    }
  }

  onSearchGuilds(pageEvent?: number) {
    this.registryFacade.searchGuilds(
      {...this.searchForm.value as GuildSearchDto, page: pageEvent ?? 1}
    ).subscribe();
  }

  onPageChange(event: PaginatorState) {
    const nextPage = event.page! + 1;
    this.onSearchGuilds(nextPage);
  }

  resetSearchForm() {
    this.searchForm.reset();
    this.registryFacade.resetGuildsFilter();
  }
}
