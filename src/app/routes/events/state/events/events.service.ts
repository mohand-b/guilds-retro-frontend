import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {CreateEventDto, EventDto} from "./event.model";
import {Observable} from "rxjs";
import {EventFeedDto} from "../../../feed/state/feed/feed.model";

@Injectable({providedIn: 'root'})
export class EventsService {

  private http = inject(HttpClient);

  private readonly eventsBaseUrl = `${environment.apiUrl}/events`;

  createEvent(event: CreateEventDto): Observable<EventDto> {
    return this.http.post<EventDto>(
      `${this.eventsBaseUrl}`,
      event,
    );
  }

  getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(
      `${this.eventsBaseUrl}/accessible`,
    );
  }

  joinEvent(eventId: number): Observable<EventFeedDto> {
    return this.http.post<EventFeedDto>(
      `${this.eventsBaseUrl}/join`,
      {eventId},
    );
  }

  withdrawFromEvent(eventId: number): Observable<EventFeedDto> {
    return this.http.post<EventFeedDto>(
      `${this.eventsBaseUrl}/withdraw`,
      {eventId},
    );
  }
}
