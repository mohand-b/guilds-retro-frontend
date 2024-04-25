import {Component} from '@angular/core';
import {MainMenuComponent} from "../../../../shared/components/main-menu/main-menu.component";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [
    MainMenuComponent,
    HeaderComponent,
    RouterOutlet,

  ],
  templateUrl: './authenticated.component.html',
  styleUrl: './authenticated.component.scss'
})
export class AuthenticatedComponent {

}
