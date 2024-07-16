import {Component, inject, OnInit} from '@angular/core';
import {EventsFacade} from "../../events.facade";
import {CreateEventComponent} from "../create-event/create-event.component";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CreateEventComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  private readonly eventsFacade = inject(EventsFacade);

  events$ = this.eventsFacade.events$;

  ngOnInit() {
    this.eventsFacade.setEvents().subscribe();
  }
}
