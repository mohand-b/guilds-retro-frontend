import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthedStateDto} from "./authed.model";
import {environment} from "../../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthedService {

  private http: HttpClient = inject(HttpClient);

  refreshUser(): Observable<AuthedStateDto> {
    return this.http.get<AuthedStateDto>(`${environment.apiUrl}/auth/refresh`);
  }
}
