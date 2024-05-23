import {Component, Inject, inject} from '@angular/core';
import {LightGuildDto} from "../../../guild/state/guilds/guild.model";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-guild-selection',
  standalone: true,
  imports: [
    GuildSelectionCardComponent,
    NgForOf,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './guild-selection.component.html',
  styleUrl: './guild-selection.component.scss'
})
export class GuildSelectionComponent {

  selectedGuild: LightGuildDto | null = null;
  private dialogRef: MatDialogRef<any> = inject(MatDialogRef<GuildSelectionComponent>)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: LightGuildDto[]
  ) {
  }

  onGuildSelect(guild: LightGuildDto): void {
    this.selectedGuild = guild;
  }

  onNoClick() {
    console.log('no click')
  }

  onSelectGuild(guild: LightGuildDto) {

  }
}
