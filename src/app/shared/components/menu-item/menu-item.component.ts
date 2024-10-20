import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  animations: [
    trigger('flyAndBounceIn', [
      transition(':enter', [
        animate(
          '500ms ease-out',
          keyframes([
            style({opacity: 0, transform: 'translate(-20px, -20px) rotate(-30deg)', offset: 0}),
            style({opacity: 0.5, transform: 'translate(10px, 10px) rotate(15deg)', offset: 0.6}),
            style({opacity: 0.8, transform: 'translate(0, -5px) rotate(0)', offset: 0.8}),
            style({opacity: 1, transform: 'translate(0, 0)', offset: 1})
          ])
        )
      ])
    ])
  ]
})
export class MenuItemComponent {

  @Input() text!: string;
  @Input() selected!: boolean;

}
