import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    MatIcon,
    NgClass
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: 'info' | 'error' | 'warning' = 'info';
  @Input() message: string = '';

  get classes(): string {
    return {
      'info': 'bg-green-100 text-green-700',
      'error': 'bg-red-100 text-red-700',
      'warning': 'bg-yellow-100 text-yellow-700'
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
