import {Component, computed, DestroyRef, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {
  MembershipRequestDto,
  RequestStatusEnum
} from "../../../guild/state/membership-requests/membership-request.model";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {CommonModule, DatePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {GuildSummaryDto} from "../../../guild/state/guilds/guild.model";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {GuildFacade} from "../../../guild/guild.facade";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {interval, Observable, switchMap, takeUntil, timer} from "rxjs";
import {
  UserMembershipRequestComponent
} from "../../components/user-membership-request/user-membership-request.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {UserDto} from "../../../profile/state/users/user.model";
import {GuildSelectionComponent} from "../../../auth/containers/guild-selection/guild-selection.component";
import {ButtonModule} from "primeng/button";
import {ProgressBarModule} from "primeng/progressbar";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";

@Component({
  selector: 'app-user-membership-requests',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    DatePipe,
    MatButton,
    MatIcon,
    UserMembershipRequestComponent,
    MatProgressBar,
    ButtonModule,
    ProgressBarModule,
    PageBlockComponent,
  ],
  templateUrl: './user-membership-requests.component.html',
  styleUrl: './user-membership-requests.component.scss'
})
export class UserMembershipRequestsComponent implements OnInit {
  public guilds: GuildSummaryDto[] = [];
  public selectedGuild: WritableSignal<GuildSummaryDto | undefined> = signal(undefined);
  public progressValue = 0;
  public bufferValue = 0;
  protected readonly pendingRequestsCount: Signal<number> = computed(() => {
    return this.requests().filter(request => request.status === RequestStatusEnum.PENDING).length;
  });
  protected readonly rejectedRequestsCount: Signal<number> = computed(() => {
    return this.requests().filter(request => request.status === RequestStatusEnum.REJECTED).length;
  });
  protected readonly approvedRequest: Signal<MembershipRequestDto | undefined> = computed(() => {
    return this.requests().find(request => request.status === RequestStatusEnum.APPROVED);
  });
  protected readonly disableNewRequestButton: Signal<boolean> = computed(() => {
    return this.pendingRequestsCount() >= 1 || this.rejectedRequestsCount() > 4 || !!this.approvedRequest();
  });
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  public readonly currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  public readonly requests: Signal<MembershipRequestDto[]> = this.authenticatedFacade.requests$;
  protected readonly guildAccepted = effect(() => {
    if (this.approvedRequest()) {
      const progressInterval: Observable<number> = interval(95).pipe(
        takeUntil(timer(9500))
      );

      progressInterval.subscribe(() => {
        this.progressValue += 1.11;
        this.bufferValue = this.progressValue;
      });

      timer(10000).pipe(
        switchMap(() => this.authenticatedFacade.refreshUser())
      ).subscribe();
    }
  });

  private readonly guildFacade = inject(GuildFacade);
  protected readonly guildSelected = effect(() => {
    if (!this.selectedGuild()) return;
    this.guildFacade.createMembershipRequest(this.currentUser()!.id, this.selectedGuild()!.id)
      .subscribe(() => this.selectedGuild.set(undefined));
  });
  private readonly genericModalService = inject(GenericModalService);
  private readonly destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    this.guildFacade.getMembershipRequestsForCurrentUser().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.guildFacade.getGuildsRecruiting().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(guilds => {
      this.guilds = guilds;
    });
  }

  public onOpenGuildSelection(): void {
    const ref = this.genericModalService.open(
      'Choisir une guilde',
      {primary: 'Confirmer'},
      'xl',
      {guilds: this.guilds},
      GuildSelectionComponent,
      undefined,
      true
    );

    ref.onClose.subscribe((selectedGuild) => {
      if (selectedGuild) {
        this.selectedGuild.set(selectedGuild);
      }
    });
  }


}
