import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {CharacterClassEnum, GenderEnum} from "../../../authenticated/state/authed/authed.model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {distinctUntilChanged} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GuildSelectionComponent} from "../guild-selection/guild-selection.component";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {GuildFacade} from "../../../guild/guild.facade";
import {LightGuildDto} from "../../../guild/state/guilds/guild.model";
import {AuthFacade} from "../../auth.facade";
import {RegisterMemberDto} from "../../state/auth/auth.model";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-register-member',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    GuildSelectionCardComponent
  ],
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.scss']
})
export class RegisterMemberComponent implements OnInit {
  public characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  public guilds: LightGuildDto[] = [];
  public guildSelected: LightGuildDto | null = null;
  public registerAsMemberForm: FormGroup;
  public usernameAlreadyTaken = false;
  public GenderEnum = GenderEnum;

  private guildsFacade = inject(GuildFacade);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authFacade = inject(AuthFacade);
  private genericModalService = inject(GenericModalService);

  constructor() {
    this.registerAsMemberForm = this.fb.group({
      username: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(4),
        this.usernameAlreadyTakenValidator.bind(this)
      ]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
      characterClass: this.fb.control<CharacterClassEnum | null>(null, [Validators.required]),
      characterLevel: this.fb.control<number>(1, [Validators.required]),
      gender: this.fb.control<GenderEnum>(GenderEnum.MALE, [Validators.required]),
      guildId: this.fb.control<number | null>(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.guildsFacade.getGuildsRecruiting().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(guilds => this.guilds = guilds);

    this.registerAsMemberForm.get('username')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.usernameAlreadyTaken) {
        this.usernameAlreadyTaken = false;
        this.registerAsMemberForm.get('username')?.updateValueAndValidity();
      }
    });
  }

  public onOpenGuildSelection(): void {
    this.genericModalService.open(
      'Choisir une guilde',
      GuildSelectionComponent,
      {primary: 'Confirmer'},
      'xl',
      {guilds: this.guilds},
      true
    ).subscribe(selectedGuild => {
      if (selectedGuild) {
        this.registerAsMemberForm.patchValue({guildId: selectedGuild.id});
        this.guildSelected = selectedGuild;
      }
    });
  }

  public onSubmit(): void {
    if (this.registerAsMemberForm.invalid) return;
    this.authFacade.registerAsMember(this.registerAsMemberForm.value as RegisterMemberDto)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          if (error.status === 409) {
            this.usernameAlreadyTaken = true;
            this.registerAsMemberForm.get('username')?.setErrors({usernameAlreadyTaken: true});
            this.registerAsMemberForm.get('username')?.updateValueAndValidity();
          }
        },
      });
  }

  public selectGender(gender: GenderEnum): void {
    this.registerAsMemberForm.patchValue({gender});
  }

  private usernameAlreadyTakenValidator(control: AbstractControl): ValidationErrors | null {
    return this.usernameAlreadyTaken ? {usernameAlreadyTaken: true} : null;
  }
}
