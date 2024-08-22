import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {JobDto} from "../../state/jobs/job.model";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";

@Component({
  selector: 'app-edit-job-level',
  standalone: true,
  imports: [
    MatSliderModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-job-level.component.html',
  styleUrl: './edit-job-level.component.scss'
})
export class EditJobLevelComponent implements OnInit {

  public data: { job: JobDto } = inject(MAT_DIALOG_DATA);
  public job = this.data.job;
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);

  jobLevelControl = new FormControl<number>(this.job.level,
    [
      Validators.required,
      Validators.min(1),
      Validators.max(100)
    ]
  );

  ngOnInit(): void {
    this.jobLevelControl.valueChanges.subscribe(() => {
      this.conditionMet.set(this.jobLevelControl.valid);
    });
  }

  getData(): JobDto {
    return {
      ...this.job,
      level: this.jobLevelControl.value!
    };
  }


}
