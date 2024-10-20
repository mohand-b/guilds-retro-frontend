import {Component, computed, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {EventsFacade} from "../../events.facade";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EMPTY, switchMap, tap} from "rxjs";
import {EventDto} from "../../state/events/event.model";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";
import {DatePipe, Location, NgClass, NgOptimizedImage} from "@angular/common";
import {Button} from "primeng/button";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {TagComponent} from "../../../../shared/components/tag/tag.component";
import {CharacterClassEnum} from "../../../profile/state/users/user.model";
import {FieldsetModule} from "primeng/fieldset";
import {DateTime} from "luxon";

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    EventImagePipe,
    NgOptimizedImage,
    Button,
    CharacterIconPipe,
    DateFormatPipe,
    DatePipe,
    TagComponent,
    NgClass,
    FieldsetModule,
    RouterLink
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {

  private eventsFacade = inject(EventsFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);

  public event$: WritableSignal<EventDto | undefined> = signal(undefined);
  public currentUser$ = this.authenticatedFacade.currentUser;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);


  currentTime = signal(DateTime.now());

  timeRemaining = computed(() => {
    const eventDate = DateTime.fromISO(this.event$()!.date);
    const now = this.currentTime();

    const diff = eventDate.diff(now, ['days', 'hours', 'minutes', 'seconds']);
    if (diff.toMillis() <= 0) {
      return 'Tu arrives trop tard...';
    }

    const days = diff.days > 0 ? `${Math.floor(diff.days)}j ` : '';
    const hours = diff.hours > 0 ? `${Math.floor(diff.hours)}h ` : '';
    const minutes = diff.minutes > 0 ? `${Math.floor(diff.minutes)}min ` : '';
    const seconds = `${Math.floor(diff.seconds)}s`;

    return `Commence dans ${days}${hours}${minutes}${seconds}`;
  });

  ngOnInit() {

    setInterval(() => {
      this.currentTime.set(DateTime.now());
    }, 1000);

    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const eventId = Number(params.get('eventId'));
        if (eventId) {
          return this.eventsFacade.getEventById(eventId);
        } else {
          this.router.navigate(['/events']);
          return EMPTY;
        }
      }),
      tap({
        next: event => this.event$.set(event),
        error: () => this.router.navigate(['/events'])
      })
    ).subscribe();
  }

  get eventColor(): string {
    switch (this.event$()!.type.toLowerCase()) {
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
    return this.event$()!.participants.some(participant =>
      participant.id === this.currentUser$()!.id);
  }

  get isCreator(): boolean {
    return this.event$()!.creator.id === this.currentUser$()!.id;
  }

  get isFull(): boolean {
    return this.event$()!.participants.length >= this.event$()!.maxParticipants
  }

  get averageLevelOfParticipants(): number {
    const averageLevel = this.event$()!.participants.reduce((acc, participant) =>
      acc + participant.characterLevel, 0) / this.event$()!.participants.length;

    return Math.round(averageLevel);
  }

  get levelRequirementMet(): boolean {
    return !this.event$()!.minLevel ||
      this.currentUser$()!.characterLevel >= this.event$()!.minLevel!;
  }

  get filteredRequiredClasses(): CharacterClassEnum[] {
    return this.event$()!.requiredClasses?.filter(
      requiredClass => !this.event$()!.participants.some(
        participant => participant.characterClass === requiredClass
      )
    ) || [];
  }

  get meetsClassRequirements(): boolean {
    if (!this.event$()!.requiredClasses || this.event$()!.requiredClasses!.length === 0) {
      return true;
    }

    const remainingRequiredClasses = this.event$()!.requiredClasses!.filter(
      requiredClass => !this.event$()!.participants.some(participant =>
        participant.characterClass === requiredClass)
    );

    if (remainingRequiredClasses.length === 0) {
      return true;
    }

    const remainingSpots = this.event$()!.maxParticipants - this.event$()!.participants.length;
    if (remainingSpots <= remainingRequiredClasses.length) {
      return remainingRequiredClasses.includes(this.currentUser$()!.characterClass);
    }

    return true;
  }

  onJoin() {
    this.eventsFacade.joinEvent(this.event$()!.id).subscribe(event =>
      this.event$.set(event));
  }

  onLeave() {
    this.eventsFacade.withdrawFromEvent(this.event$()!.id).subscribe(event =>
      this.event$.set(event));
  }

  goBack() {
    this.location.back();
  }
}
