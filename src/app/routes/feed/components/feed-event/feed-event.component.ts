import {Component, inject, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {EventsFacade} from "../../../events/events.facade";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";
import {EventDto} from "../../../events/state/events/event.model";
import {CharacterClassEnum, UserDto} from "../../../profile/state/users/user.model";
import {TagModule} from "primeng/tag";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {EMPTY, switchMap} from "rxjs";

@Component({
  selector: 'app-feed-event',
  standalone: true,
  imports: [
    RouterLink,
    GuildMembershipPipe,
    CharacterIconPipe,
    DatePipe,
    NgIf,
    NgClass,
    NgForOf,
    DateFormatPipe,
    EventImagePipe,
    TagModule,
    ButtonModule,
    DividerModule
  ],
  templateUrl: './feed-event.component.html',
  styleUrl: './feed-event.component.scss'
})
export class FeedEventComponent {
  @Input() event!: EventDto;
  @Input() currentUser!: UserDto;

  private eventsFacade = inject(EventsFacade);
  private genericModalService = inject(GenericModalService);

  get isParticipant(): boolean {
    return this.event.participants.some(participant => participant.id === this.currentUser.id);
  }

  get isCreator(): boolean {
    return this.event.creator.id === this.currentUser.id;
  }

  get isFull(): boolean {
    return this.event.participants.length >= this.event.maxParticipants
  }

  get isFinished(): boolean {
    return new Date(this.event.date) < new Date();
  }

  get filteredRequiredClasses(): CharacterClassEnum[] {
    return this.event.requiredClasses?.filter(
      requiredClass => !this.event.participants.some(
        participant => participant.characterClass === requiredClass
      )
    ) || [];
  }

  get meetsClassRequirements(): boolean {
    if (!this.event.requiredClasses || this.event.requiredClasses.length === 0) {
      return true;
    }

    const remainingRequiredClasses = this.event.requiredClasses.filter(
      requiredClass => !this.event.participants.some(participant => participant.characterClass === requiredClass)
    );

    if (remainingRequiredClasses.length === 0) {
      return true;
    }

    const remainingSpots = this.event.maxParticipants - this.event.participants.length;
    if (remainingSpots <= remainingRequiredClasses.length) {
      return remainingRequiredClasses.includes(this.currentUser.characterClass);
    }

    return true;
  }

  get levelRequirementMet(): boolean {
    return !this.event.minLevel || this.currentUser.characterLevel >= this.event.minLevel;
  }


  participate(): void {
    this.eventsFacade.joinEvent(this.event.id).subscribe();
  }

  withdraw(): void {
    this.eventsFacade.withdrawFromEvent(this.event.id).subscribe();
  }

  cancel() {
    const eventTitle = this.event.title || this.event.dungeonName || this.event.arenaTargets;

    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir annuler l'événement ${eventTitle} ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.eventsFacade.cancelEvent(this.event.id) : EMPTY)
    ).subscribe();
  }
}
