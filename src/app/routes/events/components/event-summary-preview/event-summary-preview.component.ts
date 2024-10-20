import {Component, Input} from '@angular/core';
import {CreateEventDto} from "../../state/events/event.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {DatePipe, NgIf} from "@angular/common";
import {TagModule} from "primeng/tag";

@Component({
  selector: 'app-event-summary-preview',
  standalone: true,
  imports: [
    DateFormatPipe,
    NgIf,
    TagModule,
    DatePipe
  ],
  templateUrl: './event-summary-preview.component.html',
  styleUrl: './event-summary-preview.component.scss'
})
export class EventSummaryPreviewComponent {

  @Input() createEvent!: CreateEventDto;

}
