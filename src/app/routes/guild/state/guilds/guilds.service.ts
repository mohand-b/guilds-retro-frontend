import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {GuildDto} from "./guild.model";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class GuildsService {

  private http = inject(HttpClient);

  private readonly guildsBaseUrl = `${environment.apiUrl}/guilds`;

  getCurrentGuild(): Observable<GuildDto> {
    return this.http.get<GuildDto>(
      `${this.guildsBaseUrl}/current`,
    );
  }
}
