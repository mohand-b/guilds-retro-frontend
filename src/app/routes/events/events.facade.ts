import {createStore} from "@ngneat/elf";
import {inject, Injectable, Signal} from "@angular/core";
import {addEntities, selectAllEntities, setEntities, updateEntities, withEntities} from "@ngneat/elf-entities";
import {CreateEventDto, EventDto} from "./state/events/event.model";
import {EventsService} from "./state/events/events.service";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {feedStore} from "../feed/feed.facade";
import {EventFeedDto} from "../feed/state/feed/feed.model";
import {AuthenticatedFacade} from "../authenticated/authenticated.facade";
import dayjs from "dayjs";

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
  futureEventsNotJoined$: Signal<EventDto[]> = toSignal(
    eventsStore.pipe(
      selectAllEntities(),
      map(events => events.filter(event => !this.isUserParticipant(event) && dayjs(event.date).isAfter(dayjs())))
    ), {initialValue: []}
  );
  futureEventsJoined$: Signal<EventDto[]> = toSignal(
    eventsStore.pipe(
      selectAllEntities(),
      map(events => events.filter(event => this.isUserParticipant(event) && dayjs(event.date).isAfter(dayjs())))
    ), {initialValue: []}
  );
  pastEvents$: Signal<EventDto[]> = toSignal(
    eventsStore.pipe(
      selectAllEntities(),
      map(events => events.filter(event => dayjs(event.date).isBefore(dayjs())))
    ), {initialValue: []}
  );


  private eventsService = inject(EventsService);
  private authenticatedFacade = inject(AuthenticatedFacade);

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

  private isUserParticipant(event: EventDto): boolean {
    const userId = this.getCurrentUserId();
    return event.participants.some(participant => participant.id === userId);
  }

  private getCurrentUserId(): number {
    return this.authenticatedFacade.currentUser$()?.id!
  }

}
