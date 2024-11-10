import {Component, inject} from '@angular/core';
import {Location} from "@angular/common";
import {CguContentComponent} from "../cgu-content/cgu-content.component";

@Component({
  selector: 'app-cgu',
  standalone: true,
  imports: [
    CguContentComponent
  ],
  templateUrl: './cgu-page.component.html',
  styleUrl: './cgu-page.component.scss'
})
export class CguPageComponent {

  private location: Location = inject(Location);

  goBack() {
    this.location.back();
  }

}
