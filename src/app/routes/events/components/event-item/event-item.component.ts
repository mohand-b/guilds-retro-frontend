import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventDto} from "../../state/events/event.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, CharacterIconPipe, EventImagePipe],
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent {
  @Input() event!: EventDto;
}
