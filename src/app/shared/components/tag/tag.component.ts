import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {

  @Input() label!: string;

  get tagColor(): string {
    switch (this.label.toLowerCase()) {
      case 'event':
        return 'rgb(255, 99, 132)';
      case 'dungeon':
        return 'rgb(102,193,255)';
      case 'arena':
        return 'rgb(255, 205, 86)';
      case 'other':
        return 'rgb(187,145,145)';
      default:
        return 'rgb(201, 203, 207)';
    }
  }

}
