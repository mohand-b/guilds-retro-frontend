import {Component, input} from '@angular/core';
import {KeyValuePipe, NgOptimizedImage, NgStyle} from "@angular/common";
import {CharacterClassEnum} from "../../../profile/state/users/user.model";
import {CharacterColorPipe} from "../../../../shared/pipes/character-icon.pipe";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-class-count',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgOptimizedImage,
    CharacterColorPipe,
    NgStyle,
    TooltipModule
  ],
  templateUrl: './class-count.component.html',
  styleUrl: './class-count.component.scss'
})
export class ClassCountComponent {
  classCount = input<Record<string, number> | undefined>(undefined);
  CharacterClassEnum = CharacterClassEnum;

  getCharacterClassKeys(): CharacterClassEnum[] {
    const counts = this.classCount();

    if (!counts) {
      return [];
    }

    return Object.keys(counts)
      .sort((a, b) => {
        const countA = counts[a] || 0;
        const countB = counts[b] || 0;

        if (countB !== countA) {
          return countB - countA;
        } else {
          return a.localeCompare(b);
        }
      }) as CharacterClassEnum[];
  }

}
