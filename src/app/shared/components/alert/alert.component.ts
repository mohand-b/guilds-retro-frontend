import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
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
      'info': 'bg-green-100 text-green-700',
      'error': 'bg-red-100 text-red-700',
      'warning': 'bg-yellow-100 text-yellow-700'
    }[this.type] || '';
  }

  get icon(): string {
    return {
      'info': 'pi pi-info-circle',
      'error': 'pi pi-times-circle',
      'warning': 'pi pi-exclamation-triangle'
    }[this.type] || 'pi pi-info-circle';
  }
}
