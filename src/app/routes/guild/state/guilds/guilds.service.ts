import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {GuildDto, GuildSummaryDto} from "./guild.model";
import {Observable} from "rxjs";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {GuildSearchDto, PaginatedGuildSearchResponseDto} from "../../../registry/state/guild-search/guild-search.model";
import {UserDto} from "../../../profile/state/users/user.model";

@Injectable({providedIn: 'root'})
export class GuildsService {

  private http = inject(HttpClient);
  private readonly guildsBaseUrl = `${environment.apiUrl}/guilds`;

  getCurrentGuild(): Observable<GuildDto> {
    return this.http.get<GuildDto>(
      `${this.guildsBaseUrl}/current`,
    );
  }

  getGuildById(guildId: number): Observable<GuildDto> {
    return this.http.get<GuildDto>(
      `${this.guildsBaseUrl}/${guildId}`,
    );
  }

  getGuildsRecruiting(): Observable<GuildSummaryDto[]> {
    return this.http.get<GuildSummaryDto[]>(
      `${this.guildsBaseUrl}/recruiting`,
    );
  }

  getGuildsForAlliance(): Observable<GuildSummaryDto[]> {
    return this.http.get<GuildSummaryDto[]>(
      `${this.guildsBaseUrl}/to-alliance`
    );
  }

  validateGuildCode(code: string): Observable<{ guildName: string }> {
    return this.http.get<{ guildName: string }>(
      `${this.guildsBaseUrl}/validate-guild-code?code=${code}`,
    );
  }

  updateUserRole(userId: number, role: UserRoleEnum): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${environment.apiUrl}/users/${userId}/role`,
      {role},
    );
  }

  searchGuilds(guildSearchDto: GuildSearchDto): Observable<PaginatedGuildSearchResponseDto> {
    let params = new HttpParams();

    if (guildSearchDto.name) {
      params = params.set('name', guildSearchDto.name);
    }

    if (guildSearchDto.minAverageLevel) {
      params = params.set('minAverageLevel', guildSearchDto.minAverageLevel.toString());
    }

    if (guildSearchDto.page) {
      params = params.set('page', guildSearchDto.page.toString());
    }

    if (guildSearchDto.limit) {
      params = params.set('limit', guildSearchDto.limit.toString());
    }

    return this.http.get<PaginatedGuildSearchResponseDto>(
      `${this.guildsBaseUrl}/search`,
      {params},
    );
  }
}
