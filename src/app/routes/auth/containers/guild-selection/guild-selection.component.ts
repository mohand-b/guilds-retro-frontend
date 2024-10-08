import {Component, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {GuildSummaryDto} from "../../../guild/state/guilds/guild.model";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged, filter, startWith} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";

@Component({
  selector: 'app-guild-selection',
  standalone: true,
  imports: [
    GuildSelectionCardComponent,
    NgForOf,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    NgIf,
    AlertComponent
  ],
  templateUrl: './guild-selection.component.html',
  styleUrls: ['./guild-selection.component.scss']
})
export class GuildSelectionComponent implements OnInit {

  selectedGuild: GuildSummaryDto | null = null;
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);
  searchControl = new FormControl<string>('', {nonNullable: true});
  filteredGuilds: GuildSummaryDto[] = [];
  private data: { guilds: GuildSummaryDto[] } = inject(MAT_DIALOG_DATA);
  @Input() guilds: GuildSummaryDto[] = this.data.guilds;

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
      this.filteredGuilds = this.guilds;
    } else {
      this.filteredGuilds = this.guilds.filter(guild => guild.name.toLowerCase().includes(searchTerm.toLowerCase()));
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

