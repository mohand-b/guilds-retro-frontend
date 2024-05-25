import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {MembershipRequestDto} from "./membership-request.model";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class MembershipRequestsService {

  private http = inject(HttpClient);

  private readonly membershipRequestsBaseUrl = `${environment.apiUrl}/membership-requests`;

  getPendingMembershipRequests(guildId: number): Observable<MembershipRequestDto[]> {
    return this.http.get<MembershipRequestDto[]>(
      `${this.membershipRequestsBaseUrl}?guildId=${guildId}`,
    );
  }

  acceptMembershipRequest(requestId: number): Observable<MembershipRequestDto> {
    return this.http.post<MembershipRequestDto>(
      `${this.membershipRequestsBaseUrl}/${requestId}/accept`,
      {},
    );
  }

  rejectMembershipRequest(requestId: number): Observable<void> {
    return this.http.post<void>(
      `${this.membershipRequestsBaseUrl}/${requestId}/reject`,
      {},
    );
  }

  createMembershipRequest(userId: number, guildId: number): Observable<MembershipRequestDto> {
    return this.http.post<MembershipRequestDto>(
      this.membershipRequestsBaseUrl,
      {userId, guildId},
    );
  }

  getMembershipRequestsForCurrentUser(): Observable<MembershipRequestDto[]> {
    return this.http.get<MembershipRequestDto[]>(
      `${this.membershipRequestsBaseUrl}/me`,
    );
  }

}
