import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {CreatePost} from "../../state/posts/post.model";
import {atLeastOneRequired} from "../../../../shared/validators/post.validator";

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.scss'
})
export class CreatePostModalComponent implements OnInit {

  public imagePreview: string | ArrayBuffer | null = null;
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);
  private fb = inject(FormBuilder);
  postForm = this.fb.group({
    text: this.fb.control<string>(''),
    image: this.fb.control<File | null>(null),
  }, {validators: atLeastOneRequired()});

  ngOnInit(): void {
    this.postForm.valueChanges.subscribe(() => {
      console.log(this.postForm.valid);
      this.conditionMet.set(this.postForm.valid);
    });
  }

  onImportLogo(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.postForm.patchValue({image: file});
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.postForm.patchValue({image: null});
    this.imagePreview = null;
  }

  getData(): Partial<CreatePost> {
    return this.postForm.value;
  }
}
