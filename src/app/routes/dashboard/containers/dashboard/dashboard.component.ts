import {Component, inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {CreatePostModalComponent} from "../../../feed/components/create-post-modal/create-post-modal.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {UserDto} from "../../../authenticated/state/authed/authed.model";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormField,
    MatLabel,
    CharacterIconPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public dialog = inject(MatDialog);
  private authenticatedFacade = inject(AuthenticatedFacade)

  currentUser = this.authenticatedFacade.getCurrentUser() as UserDto

  openCreatePostModal() {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Post data received:', result);
      }
    });
  }
  }
}
