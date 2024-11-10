import {Component} from '@angular/core';
import {ModalData} from "../../../../shared/interfaces/modal-data.interface";

@Component({
  selector: 'app-cgu-content',
  standalone: true,
  imports: [],
  templateUrl: './cgu-content.component.html',
  styleUrl: './cgu-content.component.scss'
})
export class CguContentComponent implements ModalData {

  getData(): boolean {
    return true;
  }

}
