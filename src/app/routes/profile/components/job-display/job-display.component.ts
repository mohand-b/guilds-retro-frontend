import {Component, EventEmitter, Input, Output} from '@angular/core';
import {JobDto} from "../../state/jobs/job.model";
import {JobImagePipe} from "../../../../shared/pipes/job-image.pipe";
import {KnobModule} from "primeng/knob";
import {FormsModule} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-job-display',
  standalone: true,
  imports: [
    JobImagePipe,
    NgClass,
    KnobModule,
    FormsModule,
    NgStyle
  ],
  templateUrl: './job-display.component.html',
  styleUrl: './job-display.component.scss'
})
export class JobDisplayComponent {
  @Input() job: JobDto | null = null;
  @Input() isCurrentUser: boolean = false;
  @Input() color: string = 'primary';

  @Output() removeJob = new EventEmitter<void>();
  @Output() editJobLevel = new EventEmitter<number>();
  @Output() addJob = new EventEmitter<void>();

  isEditing: boolean = false;
  editedLevel: number | null = null;

  get progressDasharray(): string {
    const percentage = this.job ? (this.job.level / 100) * 94.2 : 0;
    return `${percentage} 94.2`;
  }

  onRemoveJob() {
    this.removeJob.emit();
  }

  onEditJobLevel() {
    this.isEditing = true;
    this.editedLevel = this.job?.level || 0;
  }

  onConfirmEdit() {
    if (this.editedLevel !== null && this.job) {
      this.editJobLevel.emit(this.editedLevel);
      this.job.level = this.editedLevel;
    }
    this.isEditing = false;
  }

  onCancelEdit() {
    this.isEditing = false;
    this.editedLevel = null;
  }

  onAddJob() {
    this.addJob.emit();
  }
}
