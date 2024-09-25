import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto} from "../../state/guilds/guild.model";
import {CommonModule, Location} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute} from "@angular/router";
import {EMPTY, forkJoin, of, switchMap, tap} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {GuildHeaderComponent} from "../../components/guild-header/guild-header.component";
import {GuildMembersTableComponent} from "../../components/guild-members-table/guild-members-table.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../profile/state/users/user.model";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {ClassCountComponent} from "../../components/class-count/class-count.component";
import {GuildStatsComponent} from "../guild-stats/guild-stats.component";

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
    AllianceCardComponent,
    ClassCountComponent,
    GuildStatsComponent
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
  private genericModalService = inject(GenericModalService);

  ngOnInit(): void {
    this.loading = true;

    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const guildId = Number(params.get('guildId'));
        if (guildId) {
          return this.guildFacade.loadGuildById(guildId).pipe(
            switchMap((guild) => {
              this.guild.set({...guild, members: []});
              this.loading = false;

              const allianceRequests$ = this.guildFacade.getAllianceRequests(this.currentUser()?.guild.id!);

              const paginatedMembers$ = guild.isAlly
                ? this.guildFacade.getPaginatedMembers(guildId, 1, 200)
                : of(null);

              return forkJoin({
                allianceRequests: allianceRequests$,
                paginatedMembers: paginatedMembers$,
              }).pipe(
                tap(({
                       allianceRequests,
                       paginatedMembers,
                     }) => {
                  if (paginatedMembers && paginatedMembers.results) {
                    this.guild.set({...this.guild()!, members: paginatedMembers.results});
                  }
                })
              );
            })
          );
        }
        return EMPTY;
      })
    ).subscribe();
  }

  goBack() {
    this.location.back();
  }

  onAcceptAllianceRequest(requestId: number) {
    this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui, accepter'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir accepter la guilde ${this.guild()!.name} en tant qu'alliée ?`
    ).pipe(
      switchMap((result) => {
        if (result) {
          return this.guildFacade.acceptAllianceRequest(requestId).pipe(
            tap(() => {
              window.location.reload();
            })
          );
        } else {
          return EMPTY;
        }
      })
    ).subscribe();
  }


  onDeclineAllianceRequest(requestId: number) {
    this.genericModalService.open(
      'Confirmation',
      {warn: 'Oui, refuser'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir refuser la guilde ${this.guild()!.name} en tant qu'alliée ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return this.guildFacade.rejectAllianceRequest(requestId);
        else return EMPTY
      })
    ).subscribe()
  }

  onSendAllianceRequest(guildId: number) {
    this.guildFacade.createAllianceRequest(guildId).subscribe();
  }
}

