import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {OneWordQuestionnaireDto} from "../questionnaire/questionnaire.model";

@Injectable({providedIn: 'root'})
export class UsersService {

  private http = inject(HttpClient);
  private readonly usersBaseUrl = `${environment.apiUrl}/users`;

  getUserByUsername(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.usersBaseUrl}/${username}`);
  }

  findUserForAccountLinking(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.usersBaseUrl}/find-for-link/${username}`);
  }

  updateShowInRegistry(showInRegistry: boolean): Observable<void> {
    return this.http.patch<void>(`${this.usersBaseUrl}/show-in-registry`, {showInRegistry});
  }

  reqquestLinkAccount(userId: number): Observable<void> {
    return this.http.post<void>(`${this.usersBaseUrl}/link-account/${userId}`, {});
  }

  acceptAccountlinkRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.usersBaseUrl}/link-requests/${requestId}/accept`, {});
  }

  rejectAccountlinkRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.usersBaseUrl}/link-requests/${requestId}/reject`, {});
  }

  getLinkedAccounts(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.usersBaseUrl}/linked-accounts`);
  }

  updateQuestionnaire(updateData: Partial<OneWordQuestionnaireDto>): Observable<OneWordQuestionnaireDto> {
    return this.http.patch<OneWordQuestionnaireDto>(`${this.usersBaseUrl}/questionnaire`, updateData);
  }


}
