import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Field, email, form, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Field, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly loginModel = signal({
    email: '',
    password: '',
    remember: false,
  });

  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  protected onSubmit(): void {
    if (this.loginForm().valid()) {
      const formData = this.loginModel();
      console.log('Login data:', formData);
      // TODO: Implement authentication logic
    }
  }
}
