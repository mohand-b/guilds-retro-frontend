import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {CreatePost} from "../../state/posts/post.model";
import {atLeastOneRequired} from "../../../../shared/validators/post.validator";
import {ModalData} from "../../../../shared/interfaces/modal-data.interface";
import {EditorModule} from "primeng/editor";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditorModule,
    InputTextareaModule,
    ButtonModule
  ],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.scss'
})
export class CreatePostModalComponent implements OnInit, ModalData {

  public imagePreview: string | ArrayBuffer | null = null;
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);
  private fb = inject(FormBuilder);
  postForm = this.fb.group({
    text: this.fb.control<string>(''),
    image: this.fb.control<File | null>(null),
  }, {validators: atLeastOneRequired()});

  ngOnInit(): void {
    this.postForm.valueChanges.subscribe(() => {
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
