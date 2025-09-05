// In src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule

@Component({
  selector: 'app-register',
  standalone: true, // <-- Note this property
  imports: [FormsModule], // <-- Import it here
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerData = {
    username: '',
    password: '',
    role: 'User'
  };

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response:any) => {
        console.log('Registration successful', response);
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err:any) => {
        console.error('Registration failed', err);
        alert(`Registration failed: ${err.error}`);
      }
    });
  }
}