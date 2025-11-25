import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Field, email, form, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [Field, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly signupModel = signal({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    contact: null as number | null,
    gender: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.userName, { message: 'Username is required' });
    required(schemaPath.firstName, { message: 'First name is required' });
    required(schemaPath.lastName, { message: 'Last name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.contact, { message: 'Contact number is required' });
    required(schemaPath.gender, { message: 'Gender is required' });
    required(schemaPath.dob, { message: 'Date of birth is required' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters' });
    required(schemaPath.confirmPassword, { message: 'Please confirm your password' });
  });

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  protected onSubmit(): void {
    if (this.signupForm().valid()) {
      const formData = this.signupModel();
      
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        this.errorMessage.set('Passwords do not match');
        return;
      }

      // Ensure contact is a number
      if (formData.contact === null) {
        this.errorMessage.set('Contact number is required');
        return;
      }

      // Prepare signup data (exclude confirmPassword)
      const { confirmPassword, ...rest } = formData;
      const signupData = {
        ...rest,
        contact: Number(formData.contact),
      };

      this.isSubmitting.set(true);
      this.errorMessage.set(null);

      this.auth
        .signup(signupData)
        .pipe(
          finalize(() => {
            this.isSubmitting.set(false);
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'An error occurred. Please try again.');
          },
        });
    }
  }
}
