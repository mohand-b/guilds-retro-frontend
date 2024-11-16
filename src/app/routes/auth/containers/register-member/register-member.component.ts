import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {GuildFacade} from "../../../guild/guild.facade";
import {GuildSummaryDto} from "../../../guild/state/guilds/guild.model";
import {AuthFacade} from "../../auth.facade";
import {RegisterMemberDto} from "../../state/auth/auth.model";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {CommonModule, Location} from "@angular/common";
import {GuildSelectedCardComponent} from "../../components/guild-selected-card/guild-selected-card.component";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {CharacterClassEnum, GenderEnum, UserDto} from "../../../profile/state/users/user.model";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {DropdownModule} from "primeng/dropdown";
import {SliderModule} from "primeng/slider";
import {ButtonDirective, ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {GuildSelectionComponent} from "../guild-selection/guild-selection.component";
import {combineLatest, finalize} from "rxjs";
import {StepperModule} from "primeng/stepper";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {CheckboxModule} from "primeng/checkbox";
import {CguContentComponent} from "../../../terms/components/cgu-content/cgu-content.component";

function bothCheckboxesChecked(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const acceptCgu = form.get('acceptCgu')?.value;
    const confirmInfoAccuracy = form.get('confirmInfoAccuracy')?.value;

    return acceptCgu && confirmInfoAccuracy ? null : {bothRequired: true};
  };
}

@Component({
  selector: 'app-register-member',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    GuildSelectionCardComponent,
    GuildSelectedCardComponent,
    AlertComponent,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    SliderModule,
    ButtonModule,
    ProgressSpinnerModule,
    ButtonDirective,
    StepperModule,
    CharacterIconPipe,
    CheckboxModule
  ],
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.scss']
})
export class RegisterMemberComponent implements OnInit {
  public characterInfoForm: FormGroup;
  public guildIdControl: FormControl;
  public confirmationForm: FormGroup;

  public guilds: GuildSummaryDto[] = [];
  public guildSelected: GuildSummaryDto | null = null;
  public isGuildFromQueryParams = false;
  public loadingGuilds = true;
  public isLoading = false;

  protected readonly characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  protected readonly GenderEnum = GenderEnum;
  private guildFacade = inject(GuildFacade);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private location: Location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authFacade = inject(AuthFacade);
  private genericModalService = inject(GenericModalService);


  constructor() {
    this.characterInfoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      characterClass: [null, Validators.required],
      characterLevel: [1, Validators.required],
      gender: [GenderEnum.MALE, Validators.required]
    });

    this.guildIdControl = this.fb.control(null, Validators.required);

    this.confirmationForm = this.fb.group(
      {
        acceptCgu: [{value: false, disabled: true}, Validators.requiredTrue],
        confirmInfoAccuracy: [false, Validators.requiredTrue]
      },
      {validators: bothCheckboxesChecked()}
    );
  }

  ngOnInit(): void {
    combineLatest([
      this.route.queryParams,
      this.guildFacade.getGuildsRecruiting()
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([params, guilds]) => {
        this.loadingGuilds = false;
        const guildId = Number(params['guildId']);

        if (guildId) {
          const guild = guilds.find((g) => g.id === guildId);
          if (guild) {
            this.isGuildFromQueryParams = true;
            this.guildIdControl.patchValue(guildId);
            this.guildSelected = guild
          }
        } else {
          this.guilds = guilds;
        }
      });
  }

  onOpenGuildSelection(): void {
    const ref = this.genericModalService.open(
      'Choisir une guilde',
      {primary: 'Confirmer'},
      'xl',
      {guilds: this.guilds},
      GuildSelectionComponent,
      undefined,
      true
    );

    ref.onClose.subscribe((selectedGuild: any) => {
      if (selectedGuild) {
        this.guildIdControl.patchValue(selectedGuild.id);
        this.guildSelected = selectedGuild;
      }
    });
  }

  public onSubmit(): void {
    if (this.characterInfoForm.invalid || this.guildIdControl.invalid || this.confirmationForm.invalid) return;
    this.isLoading = true;

    const data: RegisterMemberDto = {
      ...this.characterInfoForm.value,
      guildId: this.guildIdControl.value
    };

    this.authFacade.registerAsMember(data)
      .pipe(
        finalize(() => this.isLoading = false)
      )
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
