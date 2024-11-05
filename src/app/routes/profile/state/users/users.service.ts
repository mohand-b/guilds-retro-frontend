import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {OneWordQuestionnaireDto} from "../questionnaire/questionnaire.model";
import {PaginatedUserSearchResponseDto, UserSearchDto} from "../../../registry/state/user-search/user-search.model";
import {UserDto} from "./user.model";

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

  updateLevel(newLevel: number): Observable<void> {
    return this.http.patch<void>(`${this.usersBaseUrl}/level`, {newLevel});
  }

  updateHideProfile(hideProfile: boolean): Observable<void> {
    return this.http.patch<void>(`${this.usersBaseUrl}/hide-profile`, {hideProfile});
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

  searchUsers(userSearchDto: UserSearchDto): Observable<PaginatedUserSearchResponseDto> {
    let params = new HttpParams();

    if (userSearchDto.username) {
      params = params.set('username', userSearchDto.username);
    }
    if (userSearchDto.characterClass) {
      params = params.set('characterClass', userSearchDto.characterClass);
    }
    if (userSearchDto.characterLevel) {
      params = params.set('characterLevel', userSearchDto.characterLevel.toString());
    }
    if (userSearchDto.jobName) {
      params = params.set('jobName', userSearchDto.jobName);
    }
    if (userSearchDto.jobLevel) {
      params = params.set('jobLevel', userSearchDto.jobLevel.toString());
    }
    if (userSearchDto.page) {
      params = params.set('page', userSearchDto.page.toString());
    }
    if (userSearchDto.limit) {
      params = params.set('limit', userSearchDto.limit.toString());
    }

    return this.http.get<PaginatedUserSearchResponseDto>(`${this.usersBaseUrl}/search`, {params});
  }


}
