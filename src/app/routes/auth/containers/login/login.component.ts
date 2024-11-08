import {Component, DestroyRef, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthFacade} from "../../auth.facade";
import {Router, RouterLink} from "@angular/router";
import {LoginDto} from "../../state/auth/auth.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {MessagesModule} from "primeng/messages";
import {ChipModule} from "primeng/chip";
import {Ripple} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {finalize} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AlertComponent,
    NgIf,
    ButtonModule,
    MessagesModule,
    ChipModule,
    Ripple,
    InputTextModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  destroyRef: DestroyRef = inject(DestroyRef);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  loginForm = this.fb.group({
    username: this.fb.control<string>('', Validators.required),
    password: this.fb.control<string>('', Validators.required)
  });
  private authFacade: AuthFacade = inject(AuthFacade);
  private router: Router = inject(Router);

  public isLoading = false;

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authFacade
      .login(this.loginForm.value as LoginDto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.loginForm.setErrors({invalidCredentials: true}),
      });
  }

}
