import {Component, Input} from '@angular/core';
import {CharacterClassEnum} from "../../../authenticated/state/authed/authed.model";
import {KeyValuePipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-class-count',
  standalone: true,
  imports: [
    NgForOf,
    KeyValuePipe,
    NgOptimizedImage,
    MatTooltip
  ],
  templateUrl: './class-count.component.html',
  styleUrl: './class-count.component.scss'
})
export class ClassCountComponent {
  @Input() memberClassesCount!: Record<CharacterClassEnum, number>;
  CharacterClassEnum = CharacterClassEnum;

  getCharacterClassKeys(): CharacterClassEnum[] {
    return Object.values(this.CharacterClassEnum);
  }
}
