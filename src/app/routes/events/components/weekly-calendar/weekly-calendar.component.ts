import {Component, computed, effect, input, Signal} from '@angular/core';
import {DateTime} from "luxon";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {EventDto} from "../../state/events/event.model";
import {RouterLink} from "@angular/router";
import {ChipsModule} from "primeng/chips";
import {Button} from "primeng/button";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {EventItemComponent} from "../event-item/event-item.component";

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    NgClass,
    RouterLink,
    ChipsModule,
    Button,
    InputGroupAddonModule,
    InputGroupModule,
    OverlayPanelModule,
    EventItemComponent
  ],
  templateUrl: './weekly-calendar.component.html',
  styleUrl: './weekly-calendar.component.scss'
})
export class WeeklyCalendarComponent {

  referenceDate = input<DateTime>(DateTime.now());
  futureEventsNotJoined = input<EventDto[]>([]);
  futureEventsJoined = input<EventDto[]>([]);
  pastEvents = input<EventDto[]>([]);

  constructor() {
    effect(() => {
      console.log('referenceDate', this.referenceDate());
      console.log('futureEventsNotJoined', this.futureEventsNotJoined());
    });
  }

  public weekDays: Signal<DateTime[]> = computed((): DateTime[] => {
    const startOfWeek = this.referenceDate().startOf('week');
    return Array.from({length: 7}, (_, i) => startOfWeek.plus({days: i}));
  });

  public getEventsForDay(day: DateTime): { type: string, event: EventDto }[] {
    const allEvents = [
      ...this.futureEventsNotJoined().map(event => ({type: 'notJoined', event})),
      ...this.futureEventsJoined().map(event => ({type: 'joined', event})),
      ...this.pastEvents().map(event => ({type: 'past', event})),
    ];

    return allEvents.filter(({event}) => {
      const eventDate = DateTime.fromISO(event.date);
      return eventDate.hasSame(day, 'day');
    });
  }

  public formatDateTime(date: DateTime): string {
    return date.toFormat('cccc d');
  }

  isToday(day: DateTime): boolean {
    return day.hasSame(DateTime.now(), 'day');
  }

  showMoreEvents(eventsForDay: { type: string; event: EventDto }[], day: DateTime) {

  }
}
