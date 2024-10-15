import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    SelectButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss'
})
export class RegistryComponent {

  navOptions = [
    {label: 'Utilisateurs', route: '/registry/users', icon: 'pi pi-user'},
    {label: 'Guildes', route: '/registry/guilds', icon: 'pi pi-shield'},
  ];

  private router = inject(Router);

  navigationControl = new FormControl(this.router.url);

  onChange(route: any) {
    this.router.navigate([route]);
  }

}
