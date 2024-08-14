import {Component, inject, OnInit} from '@angular/core';
import {EventsFacade} from "../../events.facade";
import {CreateEventComponent} from "../create-event/create-event.component";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {EventItemComponent} from "../../components/event-item/event-item.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    CreateEventComponent,
    MatButton,
    MatProgressSpinner,
    EventItemComponent,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  protected readonly length = length;
  private readonly eventsFacade = inject(EventsFacade);
  futureEventsNotJoined$ = this.eventsFacade.futureEventsNotJoined$;
  futureEventsJoined$ = this.eventsFacade.futureEventsJoined$;
  pastEvents$ = this.eventsFacade.pastEvents$;
  private dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
    this.eventsFacade.setEvents().subscribe();
  }

  openCreateEventModal() {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
    });
  }
}
