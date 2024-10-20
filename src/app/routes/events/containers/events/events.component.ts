import {Component, inject, OnInit} from '@angular/core';
import {EventsFacade} from "../../events.facade";
import {CreateEventComponent} from "../create-event/create-event.component";
import {EventItemComponent} from "../../components/event-item/event-item.component";
import {CommonModule} from "@angular/common";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {ButtonModule} from "primeng/button";
import {DialogService} from "primeng/dynamicdialog";
import {AccordionModule} from "primeng/accordion";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {EventDto} from "../../state/events/event.model";
import {SortByPipe} from "../../../../shared/pipes/sort-by.pipe";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    CreateEventComponent,
    EventItemComponent,
    PageBlockComponent,
    ButtonModule,
    AccordionModule,
    SortByPipe,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  providers: [DialogService]
})
export class EventsComponent implements OnInit {

  protected readonly length = length;
  private readonly eventsFacade = inject(EventsFacade);
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  futureEventsNotJoined$ = this.eventsFacade.futureEventsNotJoined$;
  futureEventsJoined$ = this.eventsFacade.futureEventsJoined$;
  pastEvents$ = this.eventsFacade.pastEvents$;
  private dialogService = inject(DialogService);
  currentUser$ = this.authenticatedFacade.currentUser;

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

  joinEvent(event: EventDto) {
    this.eventsFacade.joinEvent(event.id).subscribe();
  }

  leaveEvent(event: EventDto) {
    this.eventsFacade.withdrawFromEvent(event.id).subscribe();
  }


}
