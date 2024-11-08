import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventDto} from "../../state/events/event.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";
import {Button} from "primeng/button";
import {TagComponent} from "../../../../shared/components/tag/tag.component";
import {RouterLink} from "@angular/router";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {EventsFacade} from "../../events.facade";
import {EMPTY, switchMap} from "rxjs";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";


@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, CharacterIconPipe, EventImagePipe, CardModule, TagModule, Button, TagComponent, RouterLink],
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})

export class EventItemComponent {
  @Input() event!: EventDto;

  private authenticatedFacade = inject(AuthenticatedFacade);
  private eventsFacade = inject(EventsFacade);
  private genericModalService = inject(GenericModalService);

  currentUser = this.authenticatedFacade.currentUser()!;

  get eventColor(): string {
    switch (this.event.type.toLowerCase()) {
      case 'dungeon':
        return '#66c1ff';
      case 'arena':
        return '#ffcd56';
      case 'other':
        return '#bb9191';
      default:
        return '#c9cbcf';
    }
  }

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

  get levelRequirementMet(): boolean {
    return !this.event.minLevel || this.currentUser.characterLevel >= this.event.minLevel;
  }

  onJoin() {
    this.eventsFacade.joinEvent(this.event.id).subscribe();
  }

  onLeave() {
    this.eventsFacade.withdrawFromEvent(this.event.id).subscribe();
  }

  onCancel() {
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
