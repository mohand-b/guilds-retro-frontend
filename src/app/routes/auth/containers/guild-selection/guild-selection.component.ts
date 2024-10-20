import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, startWith} from 'rxjs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AlertComponent} from '../../../../shared/components/alert/alert.component';
import {NgForOf, NgIf} from '@angular/common';
import {GuildSummaryDto} from "../../../guild/state/guilds/guild.model";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {ModalData} from "../../../../shared/interfaces/modal-data.interface";

@Component({
  selector: 'app-guild-selection',
  standalone: true,
  imports: [
    GuildSelectionCardComponent,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    AlertComponent
  ],
  templateUrl: './guild-selection.component.html',
  styleUrls: ['./guild-selection.component.scss']
})
export class GuildSelectionComponent implements OnInit, ModalData {

  selectedGuild: GuildSummaryDto | null = null;
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);
  searchControl = new FormControl<string>('', {nonNullable: true});
  filteredGuilds: GuildSummaryDto[] = [];
  private data: { guilds: GuildSummaryDto[] } = {guilds: []};

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => value.length >= 3 || value.length === 0)
    ).subscribe(value => {
      this.filterGuilds(value);
    });
  }

  filterGuilds(searchTerm: string): void {
    if (searchTerm.length === 0) {
      this.filteredGuilds = this.data.guilds;
    } else {
      this.filteredGuilds = this.data.guilds.filter(guild => guild.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }

  onGuildSelect(guild: GuildSummaryDto): void {
    this.conditionMet.set(true);
    this.selectedGuild = guild;
  }

  getData(): GuildSummaryDto | null {
    return this.selectedGuild;
  }
}
