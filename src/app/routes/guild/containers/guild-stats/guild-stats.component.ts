import {Component, effect, inject, input, signal, WritableSignal} from '@angular/core';
import {GuildEventStatsDto} from "../../state/guilds/guild.model";
import {forkJoin, tap} from "rxjs";
import {GuildFacade} from "../../guild.facade";
import {MatCardModule} from "@angular/material/card";
import {ClassCountComponent} from "../../components/class-count/class-count.component";
import {EventTypesEnum} from "../../../events/state/events/event.model";

@Component({
  selector: 'app-guild-stats',
  standalone: true,
  imports: [
    MatCardModule,
    ClassCountComponent
  ],
  templateUrl: './guild-stats.component.html',
  styleUrl: './guild-stats.component.scss'
})
export class GuildStatsComponent {

  public averageMemberLevel: WritableSignal<number | undefined> = signal(undefined);
  public classCount: WritableSignal<Record<string, number> | undefined> = signal(undefined);
  public eventStats: WritableSignal<GuildEventStatsDto | undefined> = signal(undefined);
  public readonly guildId = input<number>();
  private guildFacade = inject(GuildFacade);

  constructor() {
    effect(() => {

      if (this.guildId()) {
        this.averageMemberLevel.set(undefined);
        this.classCount.set(undefined);
        this.eventStats.set(undefined);

        forkJoin({
          averageMemberLevel: this.guildFacade.getAverageMemberLevel(this.guildId()!),
          classCount: this.guildFacade.getMemberClassesCount(this.guildId()!),
          eventStats: this.guildFacade.getEventStats(this.guildId()!)
        }).pipe(
          tap(({averageMemberLevel, classCount, eventStats}) => {
              this.averageMemberLevel.set(averageMemberLevel);
              this.classCount.set(classCount);
              this.eventStats.set(eventStats);
            }
          )
        ).subscribe();
      }

    }, {allowSignalWrites: true});
  }

  getEventTypesKeys(): EventTypesEnum[] {
    return Object.keys(EventTypesEnum).filter(key => isNaN(Number(key))) as EventTypesEnum[];
  }

}
