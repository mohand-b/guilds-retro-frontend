import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-page-block',
  standalone: true,
  imports: [],
  templateUrl: './page-block.component.html',
  styleUrl: './page-block.component.scss'
})
export class PageBlockComponent {

  @Input() title!: string;

}
