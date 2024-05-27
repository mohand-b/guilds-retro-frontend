import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {GuildDto, LightGuildDto} from "./guild.model";
import {Observable} from "rxjs";
import {UserDto, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";

@Injectable({providedIn: 'root'})
export class GuildsService {

  private http = inject(HttpClient);
  private readonly guildsBaseUrl = `${environment.apiUrl}/guilds`;

  getCurrentGuild(): Observable<GuildDto> {
    return this.http.get<GuildDto>(
      `${this.guildsBaseUrl}/current`,
    );
  }

  getGuildsRecruiting(): Observable<LightGuildDto[]> {
    return this.http.get<LightGuildDto[]>(
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
}
