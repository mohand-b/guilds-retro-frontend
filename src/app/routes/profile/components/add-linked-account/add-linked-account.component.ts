import {Component, effect, inject, signal, WritableSignal} from '@angular/core';
import {ProfileFacade} from "../../profile.facade";
import {tap} from "rxjs";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {UserDto} from "../../state/users/user.model";
import {ModalData} from "../../../../shared/interfaces/modal-data.interface";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-add-linked-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './add-linked-account.component.html',
  styleUrl: './add-linked-account.component.scss'
})
export class AddLinkedAccountComponent implements ModalData {

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
