import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GuildSelectedCardComponent} from "../../components/guild-selected-card/guild-selected-card.component";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSelect} from "@angular/material/select";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {CommonModule, Location, NgForOf, NgIf} from "@angular/common";
import {AuthFacade} from "../../auth.facade";
import {GuildFacade} from "../../../guild/guild.facade";
import {toFormData} from "../../../../shared/extensions/object.extension";
import {Router} from "@angular/router";
import {distinctUntilChanged} from "rxjs";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";

@Component({
  selector: 'app-register-leader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GuildSelectedCardComponent,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatProgressSpinner,
    MatSelect,
    MatSlider,
    MatSliderThumb,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    AlertComponent
  ],
  templateUrl: './register-leader.component.html',
  styleUrl: './register-leader.component.scss'
})
export class RegisterLeaderComponent implements OnInit {

  public registerAsLeaderForm: FormGroup;
  public validateGuildCodeControl: FormControl;
  public logoPreview: string | ArrayBuffer | null = null;

  protected readonly characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  protected readonly GenderEnum = GenderEnum;

  private fb: FormBuilder = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private guildFacade = inject(GuildFacade);
  private location: Location = inject(Location);
  private router = inject(Router);


  constructor() {
    this.registerAsLeaderForm = this.fb.group({
      username: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
      characterClass: this.fb.control<CharacterClassEnum | null>(null, [Validators.required]),
      characterLevel: this.fb.control<number>(1, [Validators.required]),
      gender: this.fb.control<GenderEnum>(GenderEnum.MALE, [Validators.required]),
      guildName: this.fb.control<string>('', [Validators.required]),
      level: this.fb.control<number>(1, [Validators.required]),
      description: this.fb.control<string>(''),
      logo: this.fb.control<File | null>(null),
    });

    this.validateGuildCodeControl = this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(4),
    ]);
  }

  ngOnInit() {
    this.validateGuildCodeControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      this.validateGuildCodeControl.patchValue(this.validateGuildCodeControl.value.toUpperCase());
    });
  }

  onSubmit(): void {
    if (this.registerAsLeaderForm.invalid) return;
    this.authFacade.registerAsLeader(toFormData(this.registerAsLeaderForm.value))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          if (error.status === 409) {
            this.registerAsLeaderForm.get('username')?.setErrors({usernameAlreadyTaken: true});
          }
        },
      });
  }

  public selectGender(gender: GenderEnum): void {
    this.registerAsLeaderForm.patchValue({gender});
  }


  validateGuildCode() {
    this.guildFacade.validateGuildCode(this.validateGuildCodeControl.value).subscribe({
      next: (res) => {
        this.registerAsLeaderForm.patchValue({guildName: res.guildName});
      },
      error: (error) => {
        if (error.status === 404) {
          this.validateGuildCodeControl.setErrors({invalidGuildCode: true});
          return;
        }
      }
    });
  }

  onImportLogo(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.registerAsLeaderForm.patchValue({logo: file});
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  goBack() {
    this.location.back();
  }
}
