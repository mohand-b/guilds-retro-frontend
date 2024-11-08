import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {DropdownModule} from "primeng/dropdown";
import {SliderModule} from "primeng/slider";
import {ButtonDirective, ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {GuildSelectionComponent} from "../guild-selection/guild-selection.component";
import {finalize} from "rxjs";

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
    ButtonDirective
  ],
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.scss']
})
export class RegisterMemberComponent implements OnInit {
  public guilds: GuildSummaryDto[] = [];
  public guildSelected: GuildSummaryDto | null = null;
  public registerAsMemberForm: FormGroup;
  public loadingGuilds = true;
  public isLoading = false;
  protected readonly characterClasses: CharacterClassEnum[] = Object.values(CharacterClassEnum);
  protected readonly GenderEnum = GenderEnum;
  private guildFacade = inject(GuildFacade);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private location: Location = inject(Location);
  private router = inject(Router);
  private authFacade = inject(AuthFacade);
  private genericModalService = inject(GenericModalService);

  constructor() {
    this.registerAsMemberForm = this.fb.group({
      username: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
      characterClass: this.fb.control<CharacterClassEnum | null>(null, [Validators.required]),
      characterLevel: this.fb.control<number>(1, [Validators.required]),
      gender: this.fb.control<GenderEnum>(GenderEnum.MALE, [Validators.required]),
      guildId: this.fb.control<number | null>(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.guildFacade.getGuildsRecruiting().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(guilds => {
      this.loadingGuilds = false;
      this.guilds = guilds
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
        this.registerAsMemberForm.patchValue({guildId: selectedGuild.id});
        this.guildSelected = selectedGuild;
      }
    });
  }

  public onSubmit(): void {
    if (this.registerAsMemberForm.invalid) return;
    this.isLoading = true;
    this.authFacade.registerAsMember(this.registerAsMemberForm.value as RegisterMemberDto)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          if (error.status === 409) {
            this.registerAsMemberForm.get('username')?.setErrors({usernameAlreadyTaken: true});
          }
        }
      });

  }

  public selectGender(gender: GenderEnum): void {
    this.registerAsMemberForm.patchValue({gender});
  }

  goBack() {
    this.location.back();
  }
}
