// In src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { finalize, delay, lastValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // <-- Note this property
  imports: [FormsModule, CommonModule], // <-- Import it here
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  // 2. The method signature is now marked with 'async'
  async onLogin(): Promise<void> {
    if (!this.loginData.username || !this.loginData.password) {
      alert('Username and password are required.');
      return;
    }

    this.isLoading = true;

    try {
      // 3. 'await' pauses the function until the Promise is resolved
      //    'lastValueFrom' converts the Observable to a Promise
      const token = await lastValueFrom(this.authService.login(this.loginData).pipe(
        delay(1500)
      ));
      
      console.log('Login successful');
      this.router.navigate(['/']);

    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed: Invalid credentials.');
    } finally {
      // 4. The 'finally' block ensures the spinner is always hidden at the end
      this.isLoading = false;
    }
  }
}