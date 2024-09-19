import {Component, effect, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RegistryFacade} from "../../registry.facade";
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatFormField} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {CustomPaginatorComponent} from "../../../../shared/components/custom-paginator/custom-paginator.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {SortAlphabeticallyPipe} from "../../../../shared/pipes/sort-alphabetically.pipe";
import {GuildSearchDto} from "../../state/guild-search/guild-search.model";

@Component({
  selector: 'app-guilds-registry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    SortAlphabeticallyPipe,
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomPaginatorComponent},
  ], templateUrl: './guilds-registry.component.html',
  styleUrl: './guilds-registry.component.scss'
})
export class GuildsRegistryComponent {

  private fb = inject(FormBuilder);
  searchForm: FormGroup = this.fb.group({
    name: [undefined],
    minAverageLevel: [undefined],
  });
  private registryFacade = inject(RegistryFacade);
  guildsResults = this.registryFacade.guildsResults;
  paginationData = this.registryFacade.guildsRegistryPaginationData;
  guildsFilter = this.registryFacade.guildsFilter;
  guildsFilterUpdated = effect(() => {
    if (this.guildsFilter()) {
      this.searchForm.patchValue(this.guildsFilter());
    }
  })

  onSearchGuilds(pageEvent?: number) {
    this.registryFacade.searchGuilds(
      {...this.searchForm.value as GuildSearchDto, page: pageEvent ?? 1}
    ).subscribe();
  }

  onPageChange(event: PageEvent) {
    const nextPage = event.pageIndex + 1;
    this.onSearchGuilds(nextPage);
  }

}
