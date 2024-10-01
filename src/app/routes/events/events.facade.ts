import {createStore} from "@ngneat/elf";
import {inject, Injectable, Signal} from "@angular/core";
import {
  addEntities,
  getAllEntities,
  selectAllEntities,
  setEntities,
  updateEntities,
  withEntities
} from "@ngneat/elf-entities";
import {CreateEventDto, EventDto} from "./state/events/event.model";
import {EventsService} from "./state/events/events.service";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {AuthenticatedFacade} from "../authenticated/authenticated.facade";
import {feedStore} from "../feed/feed.facade";
import {DateTime} from "luxon";

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
      map(events =>
        events.filter(event =>
          !this.isUserParticipant(event) && DateTime.fromISO(event.date).toMillis() > DateTime.now().toMillis()
        )
      )
    ),
    {initialValue: []}
  );

  futureEventsJoined$: Signal<EventDto[]> = toSignal(
    eventsStore.pipe(
      selectAllEntities(),
      map(events =>
        events.filter(event =>
          this.isUserParticipant(event) && DateTime.fromISO(event.date).toMillis() > DateTime.now().toMillis()
        )
      )
    ),
    {initialValue: []}
  );

  pastEvents$: Signal<EventDto[]> = toSignal(
    eventsStore.pipe(
      selectAllEntities(),
      map(events =>
        events.filter(event =>
          DateTime.fromISO(event.date).toMillis() < DateTime.now().toMillis()
        )
      )
    ),
    {initialValue: []}
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
        },
        error: (error) => console.error(error),
      }),
    );
  }

  joinEvent(eventId: number): Observable<EventDto> {
    return this.eventsService.joinEvent(eventId).pipe(
      tap({
        next: (event: EventDto) => {
          eventsStore.update(updateEntities(event.id, event))
          const feedItem = feedStore.query(getAllEntities())
            .find(entity => entity.event && entity.event.id === event.id);
          if (feedItem) {
            feedStore.update(updateEntities(feedItem.id, (entity) => {
              return {
                ...entity,
                event: event,
              }
            }))
          }
        },
        error: (error) => console.error(error),
      }),
    );
  }

  withdrawFromEvent(eventId: number): Observable<EventDto> {
    return this.eventsService.withdrawFromEvent(eventId).pipe(
      tap({
        next: (event: EventDto) => {
          eventsStore.update(updateEntities(event.id, event))
          const feedItem = feedStore.query(getAllEntities())
            .find(entity => entity.event && entity.event.id === event.id);
          if (feedItem) {
            feedStore.update(updateEntities(feedItem.id, (entity) => {
              return {
                ...entity,
                event: event,
              }
            }))
          }
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
    return this.authenticatedFacade.currentUser()?.id!
  }

}
