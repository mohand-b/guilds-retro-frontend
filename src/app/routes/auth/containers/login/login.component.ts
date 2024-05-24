import {Component, DestroyRef, inject} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthFacade} from "../../auth.facade";
import {Router, RouterLink} from "@angular/router";
import {LoginDto} from "../../state/auth/auth.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    ReactiveFormsModule,
    RouterLink,
    AlertComponent,
    NgIf
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

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authFacade
      .login(this.loginForm.value as LoginDto)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => {
          this.loginForm.setErrors({invalidCredentials: true});
        }
      });
  }
}
