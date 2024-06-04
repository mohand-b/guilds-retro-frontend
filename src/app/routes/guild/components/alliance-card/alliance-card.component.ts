import {Component, inject, Input} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {GuildSummaryDto} from "../../state/guilds/guild.model";
import {GuildFacade} from "../../guild.facade";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-alliance-card',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatIcon
  ],
  templateUrl: './alliance-card.component.html',
  styleUrl: './alliance-card.component.scss'
})
export class AllianceCardComponent {

  @Input() guild!: GuildSummaryDto;
  private guildFacade = inject(GuildFacade);

  dissolveAlliance() {
    this.guildFacade.dissolveAlliance(this.guildFacade.currentGuild$().id!, this.guild.id).subscribe();
  }

}
