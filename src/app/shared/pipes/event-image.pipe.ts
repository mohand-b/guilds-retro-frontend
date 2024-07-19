import {Pipe, PipeTransform} from "@angular/core";
import {EventTypesEnum} from "../../routes/events/state/events/event.model";
import {DUNGEONS} from "../../routes/events/state/dungeons/dungeons.data";
import {EventFeedDto} from "../../routes/feed/state/feed/feed.model";

@Pipe({
  name: 'eventImage',
  standalone: true
})
export class EventImagePipe implements PipeTransform {
  transform(event: EventFeedDto): string {
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
