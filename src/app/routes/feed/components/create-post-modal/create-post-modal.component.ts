import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {FeedFacade} from "../../feed.facade";

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.scss'
})
export class CreatePostModalComponent {

  postFormControl = new FormControl("")
  private feedFacade = inject(FeedFacade);
  private dialogRef: MatDialogRef<any> = inject(MatDialogRef<CreatePostModalComponent>);


  onSubmit() {
    this.feedFacade.createPost({text: this.postFormControl.value!}).pipe(
    ).subscribe(() => {
      this.dialogRef.close()
    });

  }
}
