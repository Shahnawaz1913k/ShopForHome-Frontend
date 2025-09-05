// In src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true, // <-- Note this property
  imports: [FormsModule], // <-- Import it here
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (token:any) => {
        console.log('Login successful');
        this.authService.saveToken(token);
        this.router.navigate(['/']);
      },
      error: (err:any) => {
        console.error('Login failed', err);
        alert('Login failed: Invalid credentials.');
      }
    });
  }
}