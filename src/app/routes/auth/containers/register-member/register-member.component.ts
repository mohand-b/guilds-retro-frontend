import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CharacterClassEnum, GenderEnum} from "../../../authenticated/state/authed/authed.model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GuildSelectionComponent} from "../guild-selection/guild-selection.component";
import {GuildSelectionCardComponent} from "../../components/guild-selection-card/guild-selection-card.component";
import {GuildFacade} from "../../../guild/guild.facade";
import {GuildSummaryDto} from "../../../guild/state/guilds/guild.model";
import {AuthFacade} from "../../auth.facade";
import {RegisterMemberDto} from "../../state/auth/auth.model";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {CommonModule, Location} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {GuildSelectedCardComponent} from "../../components/guild-selected-card/guild-selected-card.component";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";

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
    GuildSelectionCardComponent,
    GuildSelectedCardComponent,
    MatProgressSpinner,
    MatProgressSpinnerModule,
    AlertComponent
  ],
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.scss']
})
export class RegisterMemberComponent implements OnInit {
  public guilds: GuildSummaryDto[] = [];
  public guildSelected: GuildSummaryDto | null = null;
  public registerAsMemberForm: FormGroup;
  public loadingGuilds = true;

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

  public onOpenGuildSelection(): void {
    this.genericModalService.open(
      'Choisir une guilde',
      {primary: 'Confirmer'},
      'xl',
      {guilds: this.guilds},
      GuildSelectionComponent,
      undefined,
      true,
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
            this.registerAsMemberForm.get('username')?.setErrors({usernameAlreadyTaken: true});
          }
        },
      });
  }

  public selectGender(gender: GenderEnum): void {
    this.registerAsMemberForm.patchValue({gender});
  }

  goBack() {
    this.location.back();
  }
}
