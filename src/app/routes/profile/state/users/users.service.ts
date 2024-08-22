import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {UserDto} from "../../../authenticated/state/authed/authed.model";

@Injectable({providedIn: 'root'})
export class UsersService {

  private httpClient = inject(HttpClient);
  private readonly usersBaseUrl = `${environment.apiUrl}/users`;

  getUserByUsername(username: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${this.usersBaseUrl}/${username}`);
  }

  updateShowInRegistry(showInRegistry: boolean): Observable<void> {
    return this.httpClient.patch<void>(`${this.usersBaseUrl}/show-in-registry`, {showInRegistry});
  }

}
