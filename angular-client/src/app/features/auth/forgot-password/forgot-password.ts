import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Field, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [Field, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly forgotPasswordModel = signal({
    email: '',
  });

  protected readonly forgotPasswordForm = form(this.forgotPasswordModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
  });

  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onSubmit(): void {
    if (this.forgotPasswordForm().valid()) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);

      const { email } = this.forgotPasswordModel();

      this.auth
        .forgotPassword({ email })
        .pipe(
          finalize(() => {
            this.isSubmitting.set(false);
          })
        )
        .subscribe({
          next: () => {
            this.isSubmitted.set(true);
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'An error occurred. Please try again.');
          },
        });
    }
  }
}
