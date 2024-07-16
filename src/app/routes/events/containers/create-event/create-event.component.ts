import {Component, inject} from '@angular/core';
import {FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {EventsFacade} from "../../events.facade";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTimepickerModule} from "mat-timepicker";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {CreateEventDto, EventTypesEnum} from "../../state/events/event.model";
import dayjs from "dayjs";
import {CharacterClassEnum, GenderEnum} from "../../../authenticated/state/authed/authed.model";
import {NgClass, NgForOf} from "@angular/common";
import {MatStepperModule} from "@angular/material/stepper";
import {MatButton} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatCheckbox,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatStepperModule,
    MatRadioModule,
    MatIcon,
    MatInput,
    NgForOf,
    MatButton,
    NgClass
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {

  eventForm: FormGroup;
  generalInfoFormGroup: FormGroup;
  eventDetailsFormGroup: FormGroup;
  participationRequirementsFormGroup: FormGroup;

  characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  protected readonly EventTypes = EventTypesEnum;
  protected readonly GenderEnum = GenderEnum;
  private eventsFacade = inject(EventsFacade);

  constructor(private fb: NonNullableFormBuilder) {
    this.generalInfoFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isAccessibleToAllies: [false]
    });

    this.eventDetailsFormGroup = this.fb.group({
      type: [EventTypesEnum.DUNGEON, Validators.required],
      dungeonName: [''],
      arenaTargets: [''],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });

    this.participationRequirementsFormGroup = this.fb.group({
      maxParticipants: [0, [Validators.required, Validators.min(1)]],
      minLevel: [0, Validators.min(0)],
      requiredClasses: this.fb.array([]),
      requiresOptimization: [false]
    });

    this.eventForm = this.fb.group({
      generalInfoStep: this.generalInfoFormGroup,
      eventDetailsStep: this.eventDetailsFormGroup,
      participationRequirementsStep: this.participationRequirementsFormGroup
    });
  }

  get minDate() {
    return new Date();
  }

  get requiredClassesFormArray(): FormArray {
    return this.eventForm.get('requiredClasses') as FormArray;
  }

  onSubmit() {
    if (this.generalInfoFormGroup.valid && this.eventDetailsFormGroup.valid && this.participationRequirementsFormGroup.valid) {
      const formValues = {
        ...this.generalInfoFormGroup.value,
        ...this.eventDetailsFormGroup.value,
        ...this.participationRequirementsFormGroup.value,
      };

      const combinedDateTime = this.combineDateAndTime(formValues.date, formValues.time);
      delete formValues.time;

      const createEventDto: CreateEventDto = {
        ...formValues,
        date: combinedDateTime
      };

      this.eventsFacade.createEvent(createEventDto).subscribe();
    }
  }

  onCheckboxChange(event: MatCheckboxChange) {
    const checkArray: FormArray = this.participationRequirementsFormGroup.get('requiredClasses') as FormArray;

    if (event.checked) {
      checkArray.push(this.fb.control(event.source.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item) => {
        if (item.value === event.source.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }


  }

  selectType(type: EventTypesEnum) {
    this.eventDetailsFormGroup.patchValue({type});
  }

  private combineDateAndTime(date: string, time: string): string {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedTime = dayjs(time, 'HH:mm').format('HH:mm');

    const dateTime = dayjs(`${formattedDate}T${formattedTime}`);

    return dateTime.toISOString();
  }
}
