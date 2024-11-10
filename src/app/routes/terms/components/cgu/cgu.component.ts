import {Component, inject} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-cgu',
  standalone: true,
  imports: [],
  templateUrl: './cgu.component.html',
  styleUrl: './cgu.component.scss'
})
export class CguComponent {

  private location: Location = inject(Location);

  goBack() {
    this.location.back();
  }

}
