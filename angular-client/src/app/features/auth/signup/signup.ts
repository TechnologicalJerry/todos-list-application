import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Field, email, form, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [Field, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  protected readonly signupModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Full name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters' });
    required(schemaPath.confirmPassword, { message: 'Please confirm your password' });
  });

  protected onSubmit(): void {
    if (this.signupForm().valid()) {
      const formData = this.signupModel();
      console.log('Signup data:', formData);
      // TODO: Implement registration logic
    }
  }
}
