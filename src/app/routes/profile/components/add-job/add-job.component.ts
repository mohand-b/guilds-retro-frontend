import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AddJobDto, JobNameEnum, JobNameType, MagusJobNameEnum} from "../../state/jobs/job.model";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {valueInArrayValidator} from "../../../../shared/validators/value-in-array.validator";
import {SortAlphabeticallyPipe} from "../../../../shared/pipes/sort-alphabetically.pipe";
import {UserDto} from "../../state/users/user.model";
import {ModalData} from "../../../../shared/interfaces/modal-data.interface";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {PrimeTemplate} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {FloatLabelModule} from "primeng/floatlabel";

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
    MatOption,
    SortAlphabeticallyPipe,
    AutoCompleteModule,
    PrimeTemplate,
    InputNumberModule,
    FloatLabelModule
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss'
})
export class AddJobComponent implements OnInit, ModalData {
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);

  data!: { user: UserDto, isForgemaging: boolean };

  magusJobs: MagusJobNameEnum[] = [];
  jobs: JobNameEnum[] = [];
  filteredJobs: (JobNameEnum | MagusJobNameEnum)[] = [];
  isForgemaging: boolean = false;

  private fb = inject(NonNullableFormBuilder);
  public addJobForm = this.fb.group({
    name: this.fb.control('',
      [Validators.required, valueInArrayValidator([])]
    ),
    level: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
  });


  ngOnInit(): void {
    this.isForgemaging = this.data.isForgemaging;

    this.magusJobs = Object.values(MagusJobNameEnum).filter(job =>
      this.data.user.jobs.every(userJob => userJob.name !== job));
    this.jobs = Object.values(JobNameEnum).filter(job =>
      this.data.user.jobs.every(userJob => userJob.name !== job));

    this.addJobForm.get('name')?.setValidators([
      Validators.required,
      valueInArrayValidator(this.isForgemaging ? this.magusJobs : this.jobs)
    ]);

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

  filterJobs(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const availableJobs = this.isForgemaging ? this.magusJobs : this.jobs;

    this.filteredJobs = availableJobs.filter(job => job.toLowerCase().includes(query));
  }


}
