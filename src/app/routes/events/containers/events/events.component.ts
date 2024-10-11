import {Component, inject, OnInit} from '@angular/core';
import {EventsFacade} from "../../events.facade";
import {CreateEventComponent} from "../create-event/create-event.component";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {EventItemComponent} from "../../components/event-item/event-item.component";
import {CommonModule} from "@angular/common";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {Button} from "primeng/button";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    CreateEventComponent,
    MatButton,
    MatProgressSpinner,
    EventItemComponent,
    PageBlockComponent,
    Button,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  providers: [DialogService]
})
export class EventsComponent implements OnInit {

  protected readonly length = length;
  private readonly eventsFacade = inject(EventsFacade);
  futureEventsNotJoined$ = this.eventsFacade.futureEventsNotJoined$;
  futureEventsJoined$ = this.eventsFacade.futureEventsJoined$;
  pastEvents$ = this.eventsFacade.pastEvents$;
  private dialogService = inject(DialogService);

  ngOnInit() {
    this.eventsFacade.setEvents().subscribe();
  }

  openCreateEventModal() {
    const dialogRef = this.dialogService.open(CreateEventComponent, {
      header: 'Créer un événement',
      width: '800px',
      contentStyle: {'overflow-y': 'visible'},
    });

  }
}
