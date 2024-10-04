import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GuildSelectedCardComponent} from "../../components/guild-selected-card/guild-selected-card.component";
import {CommonModule, Location} from "@angular/common";
import {AuthFacade} from "../../auth.facade";
import {GuildFacade} from "../../../guild/guild.facade";
import {toFormData} from "../../../../shared/extensions/object.extension";
import {Router} from "@angular/router";
import {distinctUntilChanged} from "rxjs";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {SliderModule} from "primeng/slider";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {InputIconModule} from "primeng/inputicon";
import {IconFieldModule} from "primeng/iconfield";

@Component({
  selector: 'app-register-leader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GuildSelectedCardComponent,
    ReactiveFormsModule,
    AlertComponent,
    InputTextModule,
    ButtonModule,
    SliderModule,
    DropdownModule,
    PasswordModule,
    InputIconModule,
    IconFieldModule
  ],
  templateUrl: './register-leader.component.html',
  styleUrl: './register-leader.component.scss'
})
export class RegisterLeaderComponent implements OnInit {

  public registerAsLeaderForm: FormGroup;
  public validateGuildCodeControl: FormControl;
  public logoPreview: string | ArrayBuffer | null = null;
  isLoading = false;
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
    this.isLoading = true;
    this.authFacade.registerAsLeader(toFormData(this.registerAsLeaderForm.value))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          if (error.status === 409) {
            this.registerAsLeaderForm.get('username')?.setErrors({usernameAlreadyTaken: true});
          }
        },
        complete: () => this.isLoading = false
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
