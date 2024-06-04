import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {GuildSummaryDto} from "../../../guild/state/guilds/guild.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-guild-selection-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ],
  templateUrl: './guild-selection-card.component.html',
  styleUrl: './guild-selection-card.component.scss'
})
export class GuildSelectionCardComponent {

  @Input() guild!: GuildSummaryDto;
  @Input() selected: boolean = false;
  @Output() selectGuild = new EventEmitter<GuildSummaryDto>();

  onSelect(): void {
    this.selectGuild.emit(this.guild);
  }

}
