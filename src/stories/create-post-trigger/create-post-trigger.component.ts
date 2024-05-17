import {Component, Input} from '@angular/core';
import {UserDto} from "../../app/routes/authenticated/state/authed/authed.model";
import {CharacterIconPipe} from "../../app/shared/pipes/character-icon.pipe";

@Component({
  selector: 'app-create-post-trigger',
  standalone: true,
  imports: [
    CharacterIconPipe
  ],
  templateUrl: './create-post-trigger.component.html',
  styles: ``
})
export class CreatePostTriggerComponent {
  @Input() currentUser!: UserDto

  openCreatePostModal() {
    console.log(this.currentUser)
    console.log('Opening create post modal');
  }
}
