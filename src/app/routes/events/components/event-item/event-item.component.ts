import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventDto} from "../../state/events/event.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";
import {Button} from "primeng/button";
import {TagComponent} from "../../../../shared/components/tag/tag.component";
import {UserDto} from "../../../profile/state/users/user.model";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, CharacterIconPipe, EventImagePipe, CardModule, TagModule, Button, TagComponent, RouterLink],
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
  animations: [
    trigger('innerShadowPulse', [
      state('initial', style({
        boxShadow: 'inset 0 0 0 rgba(0, 0, 0, 0)'
      })),
      state('animated', style({
        boxShadow: '{{ eventShadowColor }}'
      }), {params: {eventShadowColor: 'inset 0 0 20px rgba(0, 0, 0, 0.8)'}}),
      transition('initial <=> animated', [
        animate('1s ease-in-out', keyframes([
          style({boxShadow: '{{ eventShadowColorSmall }}', offset: 0.3}),
          style({boxShadow: '{{ eventShadowColorMedium }}', offset: 0.7}),
          style({boxShadow: '{{ eventShadowColorLarge }}', offset: 1})
        ]))
      ], {
        params: {
          eventShadowColorSmall: 'inset 0 0 5px rgba(0, 0, 0, 0.4)',
          eventShadowColorMedium: 'inset 0 0 15px rgba(0, 0, 0, 0.6)',
          eventShadowColorLarge: 'inset 0 0 20px rgba(0, 0, 0, 0.8)'
        }
      })
    ])
  ]
})

export class EventItemComponent implements OnInit {
  @Input() event!: EventDto;
  @Input() currentUser!: UserDto;

  @Output() joinEvent = new EventEmitter<EventDto>();
  @Output() leaveEvent = new EventEmitter<EventDto>();

  animationState: string = 'initial';

  ngOnInit() {
    if (this.isToday) {
      this.startShadowAnimation();
    }
  }

  startShadowAnimation() {
    setInterval(() => {
      this.animationState = this.animationState === 'initial' ? 'animated' : 'initial';
    }, 1000);
  }

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

  get isToday(): boolean {
    const now = new Date();
    const eventDate = new Date(this.event.date);

    return eventDate.toDateString() === now.toDateString() && eventDate.getTime() >= now.getTime();
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
    this.joinEvent.emit(this.event);
  }

  onLeave() {
    this.leaveEvent.emit(this.event);
  }

  get eventShadowColor(): string {
    return `inset 0 0 20px ${this.hexToRgba(this.eventColor, 0.8)}`;
  }

  get eventShadowColorSmall(): string {
    return `inset 0 0 5px ${this.hexToRgba(this.eventColor, 0.4)}`;
  }

  get eventShadowColorMedium(): string {
    return `inset 0 0 15px ${this.hexToRgba(this.eventColor, 0.6)}`;
  }

  get eventShadowColorLarge(): string {
    return `inset 0 0 20px ${this.hexToRgba(this.eventColor, 0.8)}`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }


}
