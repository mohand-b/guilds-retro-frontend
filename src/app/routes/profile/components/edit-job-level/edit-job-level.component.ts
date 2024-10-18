import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {JobDto} from "../../state/jobs/job.model";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {ModalData} from "../../../../shared/interfaces/modal-data.interface";
import {InputNumberModule} from "primeng/inputnumber";

@Component({
  selector: 'app-edit-job-level',
  standalone: true,
  imports: [
    MatSliderModule,
    ReactiveFormsModule,
    InputNumberModule
  ],
  templateUrl: './edit-job-level.component.html',
  styleUrl: './edit-job-level.component.scss'
})
export class EditJobLevelComponent implements OnInit, ModalData {

  public data!: { job: JobDto; };
  public job!: JobDto;
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);

  jobLevelControl = new FormControl<number>(this.job?.level || 0,
    [
      Validators.required,
      Validators.min(1),
      Validators.max(100)
    ]
  );

  ngOnInit(): void {
    this.job = this.data?.job;

    this.jobLevelControl.setValue(this.job?.level!);

    this.jobLevelControl.valueChanges.subscribe(() => {
      this.conditionMet.set(this.jobLevelControl.valid);
    });
  }

  getData(): JobDto {
    return {
      ...this.job,
      level: this.jobLevelControl.value!,
    };
  }


}
