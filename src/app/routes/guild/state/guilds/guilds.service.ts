import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {
  GuildDto,
  GuildEventStatsDto,
  GuildSummaryDto,
  GuildWithPaginatedMembersDto,
  PaginatedMemberResponseDto,
  UpdateGuildDto
} from "./guild.model";
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

  getGuildById(guildId: number): Observable<GuildWithPaginatedMembersDto> {
    return this.http.get<GuildWithPaginatedMembersDto>(
      `${this.guildsBaseUrl}/${guildId}`,
    );
  }

  getPaginatedMembers(guildId: number, page?: number, limit?: number): Observable<PaginatedMemberResponseDto> {
    let params = new HttpParams();

    if (page) {
      params = params.set('page', page.toString());
    }

    if (limit) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<PaginatedMemberResponseDto>(
      `${this.guildsBaseUrl}/${guildId}/members`,
      {params},
    );
  }

  getGuildsRecruiting(): Observable<GuildSummaryDto[]> {
    return this.http.get<GuildSummaryDto[]>(
      `${this.guildsBaseUrl}/recruiting`,
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

  getMemberClassesCount(guildId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.guildsBaseUrl}/${guildId}/member-classes-count`,
    );
  }

  getEventStats(guildId: number): Observable<GuildEventStatsDto> {
    return this.http.get<GuildEventStatsDto>(
      `${this.guildsBaseUrl}/${guildId}/event-stats`,
    );
  }

  getAverageMemberLevel(guildId: number): Observable<number> {
    return this.http.get<number>(
      `${this.guildsBaseUrl}/${guildId}/average-member-level`,
    );
  }

  updateGuild(guildId: number, updateGuildDto: UpdateGuildDto): Observable<GuildDto> {
    return this.http.patch<GuildDto>(
      `${this.guildsBaseUrl}/${guildId}`,
      updateGuildDto,
    );
  }

  updateGuildHideStats(guildId: number, hideStats: boolean): Observable<GuildDto> {
    return this.http.patch<GuildDto>(
      `${this.guildsBaseUrl}/${guildId}/hide-stats`,
      {hideStats},
    );
  }
}
