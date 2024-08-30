import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {NgClass, NgForOf} from "@angular/common";
import {MatStepperModule} from "@angular/material/stepper";
import {MatButton} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {DUNGEONS} from "../../state/dungeons/dungeons.data";
import {dungeonNameValidator} from "../../../../shared/validators/dungeon-name.validator";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatDialogRef} from "@angular/material/dialog";
import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";

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
    NgClass,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatSlideToggle
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {

  eventForm: FormGroup;
  eventDetailsFormGroup: FormGroup;
  participationRequirementsFormGroup: FormGroup;
  characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  dungeonNames: WritableSignal<string[]> = signal(DUNGEONS.map(dungeon => dungeon.dungeonName));
  protected readonly EventTypes = EventTypesEnum;
  protected readonly GenderEnum = GenderEnum;
  private dialogRef: MatDialogRef<CreateEventComponent> = inject(MatDialogRef);
  private eventsFacade = inject(EventsFacade);

  constructor(private fb: FormBuilder) {

    this.eventDetailsFormGroup = this.fb.group({
      type: [EventTypesEnum.DUNGEON, Validators.required],
      title: [''],
      dungeonName: ['', dungeonNameValidator()],
      arenaTargets: [''],
      description: [''],
      isAccessibleToAllies: [false],
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
      eventDetailsStep: this.eventDetailsFormGroup,
      participationRequirementsStep: this.participationRequirementsFormGroup
    });

    this.eventDetailsFormGroup.get('type')!.valueChanges.subscribe(type => {
      this.updateDungeonNameValidator(type);
    });

    this.eventDetailsFormGroup.get('dungeonName')!.valueChanges.subscribe(input => {
      if (input) {
        this.dungeonNames.set(
          DUNGEONS.map(dungeon => dungeon.dungeonName)
            .filter(dungeonName => dungeonName.toLowerCase().includes(input.toLowerCase()))
        );
      }
    });
  }

  get minDate() {
    return new Date();
  }

  onSubmit() {
    if (this.eventDetailsFormGroup.valid && this.participationRequirementsFormGroup.valid) {
      let formValues = {
        ...this.eventDetailsFormGroup.value,
        ...this.participationRequirementsFormGroup.value,
      };

      const combinedDateTime = this.combineDateAndTime(formValues.date, formValues.time);
      delete formValues.time;

      formValues = this.filterFormValuesByType(formValues);

      const createEventDto: CreateEventDto = {
        ...formValues,
        date: combinedDateTime
      };

      this.eventsFacade.createEvent(createEventDto)
        .subscribe(event => this.dialogRef.close(event));
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

  private updateDungeonNameValidator(type: EventTypesEnum) {
    const dungeonNameControl = this.eventDetailsFormGroup.get('dungeonName');
    if (type === EventTypesEnum.DUNGEON) {
      dungeonNameControl!.setValidators([dungeonNameValidator()]);
    } else {
      dungeonNameControl!.clearValidators();
    }
    dungeonNameControl!.updateValueAndValidity();
  }

  private combineDateAndTime(date: string, time: string): string {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedTime = dayjs(time, 'HH:mm').format('HH:mm');

    const dateTime = dayjs(`${formattedDate}T${formattedTime}`);

    return dateTime.toISOString();
  }

  private filterFormValuesByType(formValues: any) {
    const type = formValues.type;

    switch (type) {
      case EventTypesEnum.OTHER:
        delete formValues.dungeonName;
        delete formValues.arenaTargets;
        break;
      case EventTypesEnum.DUNGEON:
        delete formValues.arenaTargets;
        delete formValues.title;
        break;
      case EventTypesEnum.ARENA:
        delete formValues.dungeonName;
        delete formValues.title;
        formValues.arenaTargets = `Capture de ${formValues.arenaTargets}`;
        break;
    }

    return formValues;
  }
}
