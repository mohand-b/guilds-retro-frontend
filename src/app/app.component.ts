import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Guilds Boune';
  showFooter = true;

  private primengConfig = inject(PrimeNGConfig);
  private router = inject(Router);

  ngOnInit() {
    this.primengConfig.ripple = false;
    this.router.events.subscribe(() => {
      this.showFooter = !this.router.url.includes('/console');
    });
  }
}
