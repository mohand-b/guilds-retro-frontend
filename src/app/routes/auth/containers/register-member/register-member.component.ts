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
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {NgClass, NgFor, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {GuildSelectionComponent} from "../guild-selection/guild-selection.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GuildFacade} from "../../../guild/guild.facade";
import {LightGuildDto} from "../../../guild/state/guilds/guild.model";
import {AuthFacade} from "../../auth.facade";
import {RegisterMemberDto} from "../../state/auth/auth.model";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {MatSliderModule} from "@angular/material/slider";
import {distinctUntilChanged} from "rxjs";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-register-member',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormField,
    MatLabel,
    MatError,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgFor,
    MatButton,
    GuildSelectionCardComponent,
    NgIf,
    MatSliderModule,
    NgClass,
    MatIcon
  ],
  templateUrl: './register-member.component.html',
  styleUrl: './register-member.component.scss'
})
export class RegisterMemberComponent implements OnInit {
  characterClasses = Object.values(CharacterClassEnum);
  public dialog = inject(MatDialog);
  guilds: LightGuildDto[] = [];
  guildSelected: LightGuildDto | null = null;
  registerAsMemberFb: FormGroup;
  usernameAlreadyTaken = false;
  public GenderEnum = GenderEnum;
  private guildsFacade = inject(GuildFacade);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private authFacade = inject(AuthFacade);

  constructor() {
    this.registerAsMemberFb = this.fb.group({
      username: this.fb.control<string>('', [Validators.required, Validators.minLength(4), this.usernameAlreadyTakenValidator.bind(this)]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
      characterClass: this.fb.control<CharacterClassEnum | null>(null, [Validators.required]),
      characterLevel: this.fb.control<number>(1, [Validators.required]),
      gender: this.fb.control<GenderEnum>(GenderEnum.MALE, [Validators.required]),
      guildId: this.fb.control<number | null>(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.guildsFacade.getGuildsRecruiting().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((guilds) => {
      this.guilds = guilds;
    });

    this.registerAsMemberFb.get('username')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((res) => {
      if (!res) return;
      this.usernameAlreadyTaken = false;
      this.registerAsMemberFb.get('username')?.updateValueAndValidity();
    });
  }

  usernameAlreadyTakenValidator(control: AbstractControl): ValidationErrors | null {
    return this.usernameAlreadyTaken ? {usernameAlreadyTaken: true} : null;
  }

  onOpenGuildSelection(): void {
    const dialogRef = this.dialog.open(GuildSelectionComponent, {
      width: '80%',
      data: this.guilds,
    });

    dialogRef.afterClosed().subscribe((guild: LightGuildDto) => {
      if (!guild) return;
      this.registerAsMemberFb.patchValue({guildId: guild.id});
      this.guildSelected = guild;
    });
  }

  onSubmit(): void {
    if (this.registerAsMemberFb.invalid) return;
    this.authFacade.registerAsMember(this.registerAsMemberFb.value as RegisterMemberDto)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          if (error.status === 409) {
            this.usernameAlreadyTaken = true;
            this.registerAsMemberFb.get('username')?.setErrors({usernameAlreadyTaken: true});
            this.registerAsMemberFb.get('username')?.updateValueAndValidity();
          }
        },
      });
  }

  selectGender(gender: GenderEnum): void {
    this.registerAsMemberFb.patchValue({gender});
  }
}
