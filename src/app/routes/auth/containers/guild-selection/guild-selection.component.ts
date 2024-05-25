import {Component, inject, Input, OnInit} from '@angular/core';
import {LightGuildDto} from "../../../guild/state/guilds/guild.model";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged, filter, startWith, Subject} from "rxjs";
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

  selectedGuild: LightGuildDto | null = null;
  conditionMet$ = new Subject<void>();
  searchControl = new FormControl<string>('', {nonNullable: true});
  private data: { guilds: LightGuildDto[] } = inject(MAT_DIALOG_DATA);
  @Input() guilds: LightGuildDto[] = this.data.guilds;
  filteredGuilds: LightGuildDto[] = this.guilds!;

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

  onGuildSelect(guild: LightGuildDto): void {
    this.conditionMet$.next();
    this.selectedGuild = guild;
  }

  getData(): LightGuildDto | null {
    return this.selectedGuild;
  }

}

