import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {AllianceDto} from "./alliance.model";
import {GuildAllianceRequestsDto} from "../guilds/guild.model";

@Injectable({providedIn: "root"})
export class AlliancesService {

  private http = inject(HttpClient);
  private readonly alliancesBaseUrl = `${environment.apiUrl}/alliances`;


  getAllianceRequests(guildId: number): Observable<GuildAllianceRequestsDto> {
    return this.http.get<GuildAllianceRequestsDto>(
      `${this.alliancesBaseUrl}/requests/${guildId}`
    )
  }

  createAllianceRequest(requesterGuildId: number, targetGuildId: number): Observable<AllianceDto> {
    return this.http.post<AllianceDto>(
      `${this.alliancesBaseUrl}`,
      {requesterGuildId, targetGuildId},
    )
  }

  dissolveAlliance(guildId1: number, guildId2: number): Observable<AllianceDto> {
    return this.http.patch<AllianceDto>(
      `${this.alliancesBaseUrl}/dissolve`,
      {guildId1, guildId2},
    )
  }

  acceptAllianceRequest(allianceId: number): Observable<AllianceDto> {
    return this.http.patch<AllianceDto>(
      `${this.alliancesBaseUrl}/${allianceId}/accept`,
      {},
    );
  }

  rejectAllianceRequest(allianceId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.alliancesBaseUrl}/${allianceId}/reject`,
      {},
    );
  }


}
