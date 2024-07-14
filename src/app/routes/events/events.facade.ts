import {createStore} from "@ngneat/elf";
import {inject, Injectable, Signal} from "@angular/core";
import {addEntities, selectAllEntities, setEntities, updateEntities, withEntities} from "@ngneat/elf-entities";
import {CreateEventDto, EventDto} from "./state/events/event.model";
import {EventsService} from "./state/events/events.service";
import {Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {feedStore} from "../feed/feed.facade";
import {EventFeedDto} from "../feed/state/feed/feed.model";

export const EVENTS_STORE_NAME = 'events';

export const eventsStore = createStore(
  {
    name: EVENTS_STORE_NAME,
  },
  withEntities<EventDto>(),
);

@Injectable({providedIn: 'root'})
export class EventsFacade {

  events$: Signal<EventDto[]> = toSignal(eventsStore.pipe(selectAllEntities()), {
    initialValue: []
  });
  private eventsService = inject(EventsService);

  setEvents(): Observable<EventDto[]> {
    return this.eventsService.getEvents().pipe(
      tap({
        next: (events: EventDto[]) => eventsStore.update(setEntities(events)),
        error: (error) => console.error(error),
      }),
    );
  }

  createEvent(event: CreateEventDto): Observable<EventDto> {
    return this.eventsService.createEvent(event).pipe(
      tap({
        next: (event: EventDto) => {
          eventsStore.update(addEntities(event))
          console.log('Event created:', event)
        },
        error: (error) => console.error(error),
      }),
    );
  }

  joinEvent(eventId: number): Observable<EventFeedDto> {
    return this.eventsService.joinEvent(eventId).pipe(
      tap({
        next: (event: EventFeedDto) => {
          eventsStore.update(updateEntities(event.id, event))
          feedStore.update(updateEntities(event.feedId, event))
        },
        error: (error) => console.error(error),
      }),
    );
  }

  withdrawFromEvent(eventId: number): Observable<EventFeedDto> {
    return this.eventsService.withdrawFromEvent(eventId).pipe(
      tap({
        next: (event: EventFeedDto) => {
          eventsStore.update(updateEntities(event.id, event))
          feedStore.update(updateEntities(event.feedId, event))
        },
        error: (error) => console.error(error),
      }),
    );
  }

}
