import {Pipe, PipeTransform} from "@angular/core";
import {CreateEventDto, EventDto, EventTypesEnum} from "../../routes/events/state/events/event.model";
import {DUNGEONS} from "../../routes/events/state/dungeons/dungeons.data";

@Pipe({
  name: 'eventImage',
  standalone: true
})
export class EventImagePipe implements PipeTransform {
  transform(event: EventDto | CreateEventDto): string {
    switch (event.type) {
      case EventTypesEnum.DUNGEON:
        const dungeon = DUNGEONS.find(d => d.dungeonName === event.dungeonName);
        return dungeon ? `assets/dungeons/${dungeon.imageUrl}` : 'default-dungeon-image-url';
      case EventTypesEnum.ARENA:
        return 'assets/bonta.png';
      case EventTypesEnum.OTHER:
        return 'assets/default-other-image-url.jpg';
      default:
        return 'assets/default-other-image-url.jpg';
    }
  }
}
