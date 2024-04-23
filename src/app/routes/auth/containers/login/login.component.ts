import {Component, DestroyRef, inject} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {AuthFacade} from "../../auth.facade";
import {Router} from "@angular/router";
import {LoginDto} from "../../state/auth/auth.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  destroyRef: DestroyRef = inject(DestroyRef);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  loginForm = this.fb.group({
    username: [''],
    password: ['']
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
      .subscribe(() => this.router.navigateByUrl('/'));
  }
}
