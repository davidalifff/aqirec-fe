// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  look: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['user', [Validators.required]] // Default role is 'user'
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;
      this.authService.register({ name, email, password, role }).subscribe(
        (res: any) => {
          // Redirect to login page or other page after successful registration
          this.router.navigate(['/login']);
        },
        (error) => {
          // Handle registration error, e.g., display error message
          console.error('Registration failed:', error);
        }
      );
    }
  }
}
