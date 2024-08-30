import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto} from "../../state/guilds/guild.model";
import {CommonModule, Location} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute} from "@angular/router";
import {switchMap, tap} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {GuildHeaderComponent} from "../../components/guild-header/guild-header.component";
import {GuildMembersTableComponent} from "../../components/guild-members-table/guild-members-table.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../profile/state/users/user.model";

@Component({
  selector: 'app-guild-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GuildHeaderComponent,
    GuildMembersTableComponent,
    AllianceCardComponent
  ],
  templateUrl: './guild-details.component.html',
  styleUrls: ['./guild-details.component.scss']
})
export class GuildDetailsComponent implements OnInit {

  public guild: WritableSignal<GuildDto | undefined> = signal(undefined);
  public loading: boolean = false;
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  public readonly currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  private readonly guildFacade = inject(GuildFacade);
  private readonly location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loading = true;

    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const guildId = Number(params.get('guildId'));
        if (guildId) {
          return this.guildFacade.loadGuildById(guildId).pipe(
            tap((guild) => {
              this.guild.set(guild);
              this.loading = false;
            })
          );
        }
        return [];
      })
    ).subscribe();
  }

  goBack() {
    this.location.back();
  }
}

