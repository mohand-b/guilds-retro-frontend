import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    NgClass
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('visible', style({opacity: 1})),
      state('hidden', style({opacity: 0})),
      transition('visible => hidden', [
        animate('600ms ease-out')
      ]),
      transition('hidden => visible', [
        style({opacity: 0}),
        animate('600ms ease-in')
      ])
    ])
  ]
})
export class AlertComponent {
  @Input() type: 'info' | 'error' | 'warning' = 'info';
  @Input() message: string = '';

  get bgClass(): string {
    return {
      'info': 'bg-green-100',
      'error': 'bg-red-100',
      'warning': 'bg-yellow-100'
    }[this.type];
  }

  get textClass(): string {
    return {
      'info': 'text-green-700',
      'error': 'text-red-700',
      'warning': 'text-yellow-700'
    }[this.type];
  }

  get icon(): string {
    return {
      'info': 'info',
      'error': 'error',
      'warning': 'warning'
    }[this.type];
  }
}
