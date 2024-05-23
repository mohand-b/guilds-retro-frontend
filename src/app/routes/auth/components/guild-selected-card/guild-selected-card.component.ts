import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {LightGuildDto} from "../../../guild/state/guilds/guild.model";

@Component({
  selector: 'app-guild-selected-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf
  ],
  templateUrl: './guild-selected-card.component.html',
  styleUrl: './guild-selected-card.component.scss'
})
export class GuildSelectedCardComponent {

  @Input() guild!: LightGuildDto;

}
