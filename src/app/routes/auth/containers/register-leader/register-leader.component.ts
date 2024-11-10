import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {StepperModule} from "primeng/stepper";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {ButtonModule} from "primeng/button";
import {PasswordModule} from "primeng/password";
import {SliderModule} from "primeng/slider";
import {DropdownModule} from "primeng/dropdown";
import {AuthFacade} from "../../auth.facade";
import {GuildFacade} from "../../../guild/guild.facade";
import {CharacterClassEnum, GenderEnum, UserDto} from "../../../profile/state/users/user.model";
import {toFormData} from "../../../../shared/extensions/object.extension";
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {CheckboxModule} from "primeng/checkbox";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {CguContentComponent} from "../../../terms/components/cgu-content/cgu-content.component";

function bothCheckboxesChecked(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const acceptCgu = form.get('acceptCgu')?.value;
    const confirmInfoAccuracy = form.get('confirmInfoAccuracy')?.value;

    return acceptCgu && confirmInfoAccuracy ? null : {bothRequired: true};
  };
}

@Component({
  selector: 'app-register-leader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    InputTextModule,
    ButtonModule,
    SliderModule,
    DropdownModule,
    PasswordModule,
    InputIconModule,
    IconFieldModule,
    StepperModule,
    CharacterIconPipe,
    CheckboxModule
  ],
  templateUrl: './register-leader.component.html',
  styleUrls: ['./register-leader.component.scss']
})
export class RegisterLeaderComponent implements OnInit {

  public characterInfoForm: FormGroup;
  public guildInfoForm: FormGroup;
  public confirmationForm: FormGroup;
  public validateGuildCodeControl: FormControl;
  public logoPreview: string | ArrayBuffer | null = null;
  isLoading = false;

  protected readonly characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  protected readonly GenderEnum = GenderEnum;

  private fb: FormBuilder = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private guildFacade = inject(GuildFacade);
  private genericModalService = inject(GenericModalService);
  private location: Location = inject(Location);
  private router = inject(Router);

  constructor() {
    this.characterInfoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      characterClass: [null, [Validators.required]],
      characterLevel: [1, [Validators.required]],
      gender: [GenderEnum.MALE, [Validators.required]]
    });

    this.guildInfoForm = this.fb.group({
      guildName: ['', [Validators.required]],
      level: [1, [Validators.required]],
      description: [''],
      logo: [null]
    });

    this.confirmationForm = this.fb.group(
      {
        acceptCgu: [{value: false, disabled: true}, Validators.requiredTrue],
        confirmInfoAccuracy: [false, Validators.requiredTrue]
      },
      {validators: bothCheckboxesChecked()}
    );

    this.validateGuildCodeControl = this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(4),
    ]);
  }

  ngOnInit() {
    this.validateGuildCodeControl.valueChanges
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        this.validateGuildCodeControl.patchValue(this.validateGuildCodeControl.value.toUpperCase(), {emitEvent: false});
      });
  }

  onSubmit(): void {
    if (this.characterInfoForm.invalid || this.guildInfoForm.invalid) return;
    this.isLoading = true;

    const formData = {
      ...this.characterInfoForm.value,
      ...this.guildInfoForm.value
    };

    this.authFacade.registerAsLeader(toFormData(formData))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          if (error.status === 409) {
            this.characterInfoForm.get('username')?.setErrors({usernameAlreadyTaken: true});
          }
        }
      });
  }

  public selectGender(gender: GenderEnum): void {
    this.characterInfoForm.patchValue({gender});
  }

  get previewCharacterClass(): Pick<UserDto, 'characterClass' | 'gender'> {
    return {
      characterClass: this.characterInfoForm.value.characterClass,
      gender: this.characterInfoForm.value.gender
    }
  }

  validateGuildCode() {
    this.guildFacade.validateGuildCode(this.validateGuildCodeControl.value).subscribe({
      next: (res) => this.guildInfoForm.patchValue({guildName: res.guildName}),
      error: (error) => {
        if (error.status === 404) {
          this.validateGuildCodeControl.setErrors({invalidGuildCode: true});
        }
      }
    });
  }

  validateAndPreventSubmit(event: any) {
    event.preventDefault();
    this.validateGuildCode();
  }

  onImportLogo(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.guildInfoForm.patchValue({logo: file});
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onOpenCgu() {
    const dialogRef = this.genericModalService.open(
      "Conditions générales d'utilisation",
      {'primary': "J'ai lu et j'accepte"},
      'md',
      null,
      CguContentComponent,
      undefined,
      false,
      false
    )

    dialogRef.onClose.subscribe((read) => {
      if (read) {
        this.confirmationForm.get('acceptCgu')?.setValue(true);
        this.confirmationForm.get('acceptCgu')?.enable();
      }
    })
  }

  goBack() {
    this.location.back();
  }

}
