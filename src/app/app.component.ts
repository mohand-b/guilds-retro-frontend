import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
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

  private primengConfig = inject(PrimeNGConfig);

  ngOnInit() {
    this.primengConfig.ripple = false;
  }
}
