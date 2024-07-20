import {Component, inject, OnInit} from '@angular/core';
import {EventsFacade} from "../../events.facade";
import {CreateEventComponent} from "../create-event/create-event.component";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CreateEventComponent,
    MatButton
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  private readonly eventsFacade = inject(EventsFacade);
  events$ = this.eventsFacade.events$;
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
      console.log(`Dialog result: ${result}`);
    });
  }
}
