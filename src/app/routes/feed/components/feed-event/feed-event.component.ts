import {Component, inject, Input} from '@angular/core';
import {EventFeedDto} from "../../state/feed/feed.model";
import {CharacterClassEnum, UserDto} from "../../../authenticated/state/authed/authed.model";
import {RouterLink} from "@angular/router";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatChip} from "@angular/material/chips";
import {EventsFacade} from "../../../events/events.facade";

@Component({
  selector: 'app-feed-event',
  standalone: true,
  imports: [
    RouterLink,
    GuildMembershipPipe,
    CharacterIconPipe,
    DatePipe,
    NgIf,
    MatButton,
    NgClass,
    NgForOf,
    MatChip
  ],
  templateUrl: './feed-event.component.html',
  styleUrl: './feed-event.component.scss'
})
export class FeedEventComponent {
  @Input() event!: EventFeedDto;
  @Input() currentUser!: UserDto;
  private eventFacade = inject(EventsFacade);

  get isParticipant(): boolean {
    return this.event.participants.some(participant => participant.id === this.currentUser.id);

  }

  get isCreator(): boolean {
    return this.event.creator.id === this.currentUser.id;
  }

  get isFull(): boolean {
    return this.event.participants.length >= this.event.maxParticipants
  }

  get filteredRequiredClasses(): CharacterClassEnum[] {
    return this.event.requiredClasses?.filter(
      requiredClass => !this.event.participants.some(
        participant => participant.characterClass === requiredClass
      )
    ) || [];
  }

  get canParticipate(): boolean {
    if (this.isFull || this.isParticipant) {
      return false;
    }
    if (this.filteredRequiredClasses.length > 0) {
      return this.filteredRequiredClasses.includes(this.currentUser.characterClass);
    }
    return true;
  }

  participate(): void {
    this.eventFacade.joinEvent(this.event.id).subscribe();
  }

  withdraw(): void {
    this.eventFacade.withdrawFromEvent(this.event.id).subscribe();
  }
}
