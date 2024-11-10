import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateEventDto, EventTypesEnum} from '../../state/events/event.model';
import {NgClass, NgForOf} from '@angular/common';
import {EventsFacade} from '../../events.facade';
import {CharacterClassEnum} from '../../../profile/state/users/user.model';
import {DateTime} from 'luxon';
import {DUNGEONS} from '../../state/dungeons/dungeons.data';

import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {StepsModule} from 'primeng/steps';
import {TabViewModule} from "primeng/tabview";
import {StepperModule} from "primeng/stepper";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {EventImagePipe} from "../../../../shared/pipes/event-image.pipe";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {SliderModule} from "primeng/slider";
import {InputSwitchModule} from "primeng/inputswitch";

import {eventTypeFieldsValidator} from "../../../../shared/validators/event-type-fields.validator";

import {EventSummaryPreviewComponent} from "../../components/event-summary-preview/event-summary-preview.component";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {FileUploadModule} from "primeng/fileupload";
import {toFormData} from "../../../../shared/extensions/object.extension";
import {finalize} from "rxjs";
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    InputNumberModule,
    ButtonModule,
    ToggleButtonModule,
    NgForOf,
    NgClass,
    StepsModule,
    TabViewModule,
    StepperModule,
    AutoCompleteModule,
    EventImagePipe,
    InputGroupModule,
    InputGroupAddonModule,
    SliderModule,
    InputSwitchModule,
    EventSummaryPreviewComponent,
    IconFieldModule,
    InputIconModule,
    FileUploadModule,
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent {
  eventForm: FormGroup;
  eventDetailsFormGroup: FormGroup;
  participationRequirementsFormGroup: FormGroup;

  characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  dungeonNames: WritableSignal<string[]> = signal(DUNGEONS.map((dungeon) => dungeon.dungeonName));
  protected readonly EventTypes = EventTypesEnum;
  public readonly minDate = new Date();

  public isLoading = false;

  selectedImage: string | ArrayBuffer | null = null;

  private dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private eventsFacade = inject(EventsFacade);
  private primengConfig = inject(PrimeNGConfig);

  constructor(private fb: FormBuilder) {
    this.eventDetailsFormGroup = this.fb.group({
      type: [EventTypesEnum.DUNGEON, Validators.required],
      title: [''],
      dungeonName: [''],
      arenaTargets: [''],
      image: [null],
      description: [''],
      isAccessibleToAllies: [false],
      date: ['', Validators.required],
      time: [new Date(new Date().setHours(18, 0, 0)), Validators.required],
    }, {
      validators: eventTypeFieldsValidator(),
    });

    this.participationRequirementsFormGroup = this.fb.group({
      maxParticipants: [8, [Validators.required, Validators.min(1)]],
      minLevel: [0, Validators.min(0)],
      requiredClasses: this.fb.array([]),
      requiresOptimization: [false],
    });

    this.eventForm = this.fb.group({
      eventDetailsStep: this.eventDetailsFormGroup,
      participationRequirementsStep: this.participationRequirementsFormGroup,
    });

    this.eventDetailsFormGroup.get('dungeonName')?.valueChanges.subscribe((dungeonName) => {
      const dungeonLevel = this.getDungeonLevel(dungeonName);
      this.participationRequirementsFormGroup.patchValue({minLevel: dungeonLevel});
    });

    this.primengConfig.setTranslation({
      dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
      monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
      today: "Aujourd'hui",
      clear: "Effacer",
      dateFormat: "dd/mm/yy",
      weekHeader: "Sem",
      firstDayOfWeek: 1,
    });
  }

  onSubmit() {
    if (this.eventDetailsFormGroup.valid && this.participationRequirementsFormGroup.valid) {
      this.isLoading = true;
      const createEventDto = this.createEventDto();
      this.eventsFacade.createEvent(toFormData(createEventDto)).pipe(
        finalize(() => this.isLoading = false),
      ).subscribe({
        next: () => this.dialogRef.close(),
      });
    }
  }

  createEventDto(): CreateEventDto {
    let formValues = {
      ...this.eventDetailsFormGroup.value,
      ...this.participationRequirementsFormGroup.value,
    };

    const combinedDateTime = this.combineDateAndTime(formValues.date, formValues.time);
    delete formValues.time;

    formValues = this.filterFormValuesByType(formValues);

    return {
      ...formValues,
      date: combinedDateTime,
    };
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        this.eventDetailsFormGroup.patchValue({image: file});
      };
      reader.readAsDataURL(file);
    }
  }

  onChangeIsAccessibleToAllies(isAccessibleToAllies: boolean) {
    this.eventDetailsFormGroup.patchValue({isAccessibleToAllies});
  }

  isClassRequired(className: string) {
    const formArray: FormArray = this.participationRequirementsFormGroup.get('requiredClasses') as FormArray;
    return this.fb.control(formArray.value.includes(className));
  }

  onCheckboxChange(className: string, isChecked: boolean) {
    const checkArray: FormArray = this.participationRequirementsFormGroup.get('requiredClasses') as FormArray;

    if (isChecked) {
      checkArray.push(this.fb.control(className));
    } else {
      const index = checkArray.controls.findIndex((item) => item.value === className);
      if (index >= 0) {
        checkArray.removeAt(index);
      }
    }
  }

  filterDungeons(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    if (query) {
      this.dungeonNames.set(DUNGEONS.filter((dungeon) =>
        dungeon.dungeonName.toLowerCase().includes(query) ||
        dungeon.boss.toLowerCase().includes(query)
      ).map((dungeon) => dungeon.dungeonName));
    } else {
      this.dungeonNames.set(DUNGEONS.map((dungeon) => dungeon.dungeonName));
    }
  }

  getDungeonLevel(dungeonName: string): number {
    const dungeon = DUNGEONS.find(d => d.dungeonName === dungeonName);
    if (dungeon && dungeon.levelRange) {
      const [firstLevel] = dungeon.levelRange.split('-').map(Number);
      return firstLevel;
    }
    return 0;
  }

  selectType(type: EventTypesEnum) {
    this.eventDetailsFormGroup.patchValue({type});
  }

  dungeonImageUrl(dungeonName: string): string {
    const dungeon = DUNGEONS.find(d => d.dungeonName === dungeonName);
    return dungeon ? `assets/dungeons/${dungeon.imageUrl}` : 'default-dungeon-image-url';
  }

  private combineDateAndTime(date: string, time: string): string {
    const dateObj = DateTime.fromJSDate(new Date(date));
    const timeObj = DateTime.fromJSDate(new Date(time));

    const combinedDateTime = dateObj.set({
      hour: timeObj.hour,
      minute: timeObj.minute,
    });

    return combinedDateTime.toISO()!;
  }

  private filterFormValuesByType(formValues: any) {
    const type = formValues.type;

    switch (type) {
      case EventTypesEnum.OTHER:
        delete formValues.dungeonName;
        delete formValues.arenaTargets;
        break;
      case EventTypesEnum.DUNGEON:
        delete formValues.image;
        delete formValues.arenaTargets;
        delete formValues.title;
        break;
      case EventTypesEnum.ARENA:
        delete formValues.image;
        delete formValues.dungeonName;
        delete formValues.title;
        formValues.arenaTargets = `Capture de ${formValues.arenaTargets}`;
        break;
    }

    return formValues;
  }

  resetImage() {
    this.selectedImage = null;
  }
}
