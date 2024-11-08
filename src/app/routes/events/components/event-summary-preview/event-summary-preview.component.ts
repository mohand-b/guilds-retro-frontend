import {Component, Input} from '@angular/core';
import {CreateEventDto} from "../../state/events/event.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {DatePipe, NgIf, TitleCasePipe} from "@angular/common";
import {TagModule} from "primeng/tag";
import {TagComponent} from "../../../../shared/components/tag/tag.component";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";

@Component({
  selector: 'app-event-summary-preview',
  standalone: true,
  imports: [
    DateFormatPipe,
    NgIf,
    TagModule,
    DatePipe,
    TagComponent,
    TitleCasePipe,
    EventImagePipe
  ],
  templateUrl: './event-summary-preview.component.html',
  styleUrl: './event-summary-preview.component.scss'
})
export class EventSummaryPreviewComponent {

  @Input() createEvent!: CreateEventDto;
  @Input() selectedImage: string | ArrayBuffer | null = null;

}
