import {createStore} from "@ngneat/elf";
import {inject, Injectable, Signal} from "@angular/core";
import {addEntities, selectAllEntities, setEntities, withEntities} from "@ngneat/elf-entities";
import {CreateEventDto, EventDto} from "./state/events/event.model";
import {EventsService} from "./state/events/events.service";
import {Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

export const EVENTS_STORE_NAME = 'events';

export const eventsStore = createStore(
  {
    name: EVENTS_STORE_NAME,
  },
  withEntities<EventDto>(),
);

@Injectable({providedIn: 'root'})
export class EventsFacade {

  private eventsService = inject(EventsService);

  events$: Signal<EventDto[]> = toSignal(eventsStore.pipe(selectAllEntities()), {
    initialValue: []
  });

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

}
