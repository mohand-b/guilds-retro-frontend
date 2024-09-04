import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss'
})
export class RegistryComponent {

  private router = inject(Router);

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

}
