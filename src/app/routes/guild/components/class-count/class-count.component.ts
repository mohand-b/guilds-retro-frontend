import {Component, input} from '@angular/core';
import {KeyValuePipe, NgClass, NgForOf, NgOptimizedImage, NgStyle} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {CharacterClassEnum} from "../../../profile/state/users/user.model";
import {CharacterColorPipe} from "../../../../shared/pipes/character-icon.pipe";

@Component({
  selector: 'app-class-count',
  standalone: true,
  imports: [
    NgForOf,
    KeyValuePipe,
    NgOptimizedImage,
    MatTooltip,
    CharacterColorPipe,
    NgStyle,
    NgClass
  ],
  templateUrl: './class-count.component.html',
  styleUrl: './class-count.component.scss'
})
export class ClassCountComponent {
  classCount = input<Record<string, number> | undefined>(undefined);
  CharacterClassEnum = CharacterClassEnum;

  getCharacterClassKeys(): CharacterClassEnum[] {
    return Object.values(this.CharacterClassEnum);
  }
}
