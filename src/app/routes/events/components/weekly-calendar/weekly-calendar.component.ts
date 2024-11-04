import {Component, computed, input, Signal, signal} from '@angular/core';
import {DateTime} from "luxon";
import {EventDto} from "../../state/events/event.model";
import {DatePipe, NgClass} from "@angular/common";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {EventItemComponent} from "../event-item/event-item.component";
import {animate, style, transition, trigger} from "@angular/animations";
import {BadgeModule} from "primeng/badge";

@Component({
  standalone: true,
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss'],
  imports: [
    NgClass,
    DatePipe,
    OverlayPanelModule,
    EventItemComponent,
    BadgeModule
  ],
  animations: [
    trigger('weekSlide', [
      transition(':increment', [
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('500ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':decrement', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        animate('500ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ])
    ])
  ]
})
export class WeeklyCalendarComponent {

  referenceDate = input<DateTime>(DateTime.now());
  futureEventsNotJoined = input<EventDto[]>([]);
  futureEventsJoined = input<EventDto[]>([]);
  pastEvents = input<EventDto[]>([]);

  public expandedDays: Set<string> = new Set();

  public currentWeekIndex = signal(0);

  public weekDays: Signal<DateTime[]> = computed(() => {
    const startOfWeek = this.referenceDate().plus({weeks: this.currentWeekIndex()}).startOf('week');
    return Array.from({length: 7}, (_, i) => startOfWeek.plus({days: i}));
  });


  public getEventsForDay(day: DateTime): { type: string, event: EventDto }[] {
    const allEvents = [
      ...this.futureEventsNotJoined().map(event => ({type: 'notJoined', event})),
      ...this.futureEventsJoined().map(event => ({type: 'joined', event})),
      ...this.pastEvents().map(event => ({type: 'past', event})),
    ];

    return allEvents
      .filter(({event}) => {
        const eventDate = DateTime.fromISO(event.date);
        return eventDate.hasSame(day, 'day');
      })
      .sort((a, b) => DateTime.fromISO(a.event.date).toMillis() - DateTime.fromISO(b.event.date).toMillis());
  }


  public formatDateTime(date: DateTime): string {
    return date.toFormat('cccc d');
  }

  isToday(day: DateTime): boolean {
    return day.hasSame(DateTime.now(), 'day');
  }

  toggleDayExpansion(day: DateTime): void {
    const dayKey = day.toISODate();
    if (this.expandedDays.has(dayKey!)) {
      this.expandedDays.delete(dayKey!);
    } else {
      this.expandedDays.add(dayKey!);
    }
  }

  isDayExpanded(day: DateTime): boolean {
    return this.expandedDays.has(day.toISODate()!);
  }

  protected readonly DateTime = DateTime;
}
