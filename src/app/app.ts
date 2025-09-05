import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthService } from './services/auth';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ShopForHome-Frontend');

  constructor(
    private authService: AuthService, 
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.cartService.loadCart();
    }
  }
}
