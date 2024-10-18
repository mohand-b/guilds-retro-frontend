import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-page-block',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './page-block.component.html',
  styleUrl: './page-block.component.scss'
})
export class PageBlockComponent {

  @Input() title!: string;
  @Input() contentPadding = true;

}
