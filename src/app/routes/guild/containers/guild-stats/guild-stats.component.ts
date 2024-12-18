import {Component, effect, EventEmitter, inject, input, Output, signal, WritableSignal} from '@angular/core';
import {GuildEventStatsDto} from "../../state/guilds/guild.model";
import {combineLatest, finalize, tap} from "rxjs";
import {GuildFacade} from "../../guild.facade";
import {ClassCountComponent} from "../../components/class-count/class-count.component";
import {EventTypesEnum} from "../../../events/state/events/event.model";
import {PanelModule} from "primeng/panel";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-guild-stats',
  standalone: true,
  imports: [
    ClassCountComponent,
    PanelModule,
    DividerModule,
    CardModule,
    TitleCasePipe
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

  @Output() loadingChange = new EventEmitter<boolean>();

  constructor() {
    effect(() => {
      if (this.guildId()) {
        this.averageMemberLevel.set(undefined);
        this.classCount.set(undefined);
        this.eventStats.set(undefined);

        combineLatest({
          averageMemberLevel: this.guildFacade.getAverageMemberLevel(this.guildId()!),
          classCount: this.guildFacade.getMemberClassesCount(this.guildId()!),
          eventStats: this.guildFacade.getEventStats(this.guildId()!)
        }).pipe(
          tap(({averageMemberLevel, classCount, eventStats}) => {
              this.averageMemberLevel.set(averageMemberLevel);
              this.classCount.set(classCount);
              this.eventStats.set(eventStats);
            }
          ),
          finalize(() => this.loadingChange.emit(false)),
        ).subscribe();
      }

    }, {allowSignalWrites: true});
  }

  getEventTypesKeys(): EventTypesEnum[] {
    return Object.keys(EventTypesEnum).filter(key => isNaN(Number(key))) as EventTypesEnum[];
  }

}
