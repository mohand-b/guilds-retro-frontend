import {Component, inject, OnInit} from '@angular/core';
import {EventsFacade} from "../../events.facade";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
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
