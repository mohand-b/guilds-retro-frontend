import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {io, Socket} from "socket.io-client";
import {HttpClient} from "@angular/common/http";
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {NotificationDto} from "./notification.model";

@Injectable({providedIn: 'root'})
export class NotificationsService {

  private http = inject(HttpClient);
  private authenticatedFacade = inject(AuthenticatedFacade);
  private socket: Socket;

  constructor() {
    this.socket = io(environment.baseUrl, {
      query: {
        userId: this.authenticatedFacade.userId,
      },
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  getNotifications(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(
      `${environment.apiUrl}/notifications`
    );
  }

}

