import {Component, EventEmitter, Input, Output} from '@angular/core';
import {JobDto} from "../../state/jobs/job.model";
import {JobImagePipe} from "../../../../shared/pipes/job-image.pipe";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {KnobModule} from "primeng/knob";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-job-display',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    JobImagePipe,
    NgClass,
    ProgressSpinnerModule,
    KnobModule,
    FormsModule
  ],
  templateUrl: './job-display.component.html',
  styleUrl: './job-display.component.scss'
})
export class JobDisplayComponent {
  @Input() job: JobDto | null = null;
  @Input() isCurrentUser: boolean = false;
  @Input() color: string = 'primary';
  @Output() removeJob = new EventEmitter<void>();
  @Output() editJobLevel = new EventEmitter<void>();
  @Output() addJob = new EventEmitter<void>();

  onRemoveJob() {
    this.removeJob.emit();
  }

  onEditJobLevel() {
    this.editJobLevel.emit();
  }

  onAddJob() {
    this.addJob.emit();
  }

}
