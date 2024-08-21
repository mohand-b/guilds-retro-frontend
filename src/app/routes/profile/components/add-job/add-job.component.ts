import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AddJobDto, JobNameEnum, JobNameType, MagusJobNameEnum} from "../../state/jobs/job.model";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlider,
    MatSliderThumb,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatOption
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss'
})
export class AddJobComponent implements OnInit {

  jobs = Object.values(JobNameEnum);
  magusJobs = Object.values(MagusJobNameEnum);
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);
  public data: { isForgemaging: boolean } = inject(MAT_DIALOG_DATA);
  isForgemaging = this.data.isForgemaging;
  private fb = inject(NonNullableFormBuilder);
  public addJobForm = this.fb.group({
    name: this.fb.control(undefined, Validators.required),
    level: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  ngOnInit(): void {
    this.addJobForm.valueChanges.subscribe(() => {
      this.conditionMet.set(this.addJobForm.valid);
    });
  }

  getData(): AddJobDto | null {
    const jobName = this.addJobForm.value.name! as JobNameType;
    return {
      name: jobName,
      level: this.addJobForm.value.level as number,
      isForgemaging: this.isForgemaging
    };
  }


}
