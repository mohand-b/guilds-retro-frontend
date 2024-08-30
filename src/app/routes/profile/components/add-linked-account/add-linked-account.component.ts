import {Component, effect, inject, signal, WritableSignal} from '@angular/core';
import {ProfileFacade} from "../../profile.facade";
import {tap} from "rxjs";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {UserDto} from "../../state/users/user.model";

@Component({
  selector: 'app-add-linked-account',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    AlertComponent,
  ],
  templateUrl: './add-linked-account.component.html',
  styleUrl: './add-linked-account.component.scss'
})
export class AddLinkedAccountComponent {

  accountFound: WritableSignal<UserDto | undefined> = signal(undefined)
  error: WritableSignal<string | undefined> = signal(undefined)
  conditionMet: WritableSignal<boolean> = signal<boolean>(false);

  effect = effect(() => {
    this.conditionMet.set(this.accountFound() !== undefined);
  }, {allowSignalWrites: true})

  isLoading = false;
  searchAccountControl = new FormControl<string>(
    '',
    [
      Validators.required,
      Validators.minLength(3)
    ]
  );
  private profileFacade = inject(ProfileFacade);

  onSearchAccount(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.error.set(undefined);
    this.profileFacade.findUserForAccountLinking(this.searchAccountControl.value!).pipe(
      tap({
        next: (user) => {
          this.accountFound.set(user);
        },
        error: (error) => {
          this.error.set(error.error.message);
        },
        complete: () => {
          this.isLoading = false
        }
      })).subscribe()
  }

  getData(): UserDto | undefined {
    return this.accountFound();
  }
}
