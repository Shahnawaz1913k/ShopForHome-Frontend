import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // A BehaviorSubject holds the current notification message. null means it's hidden.
  private notificationSubject = new BehaviorSubject<string | null>(null);
  public notification$: Observable<string | null> = this.notificationSubject.asObservable();

  constructor() { }

  /**
   * Shows a notification message for a specified duration.
   * @param message The message to display.
   * @param duration How long to display the message in milliseconds (default: 3 seconds).
   */
  show(message: string, duration: number = 3000): void {
    this.notificationSubject.next(message);

    setTimeout(() => {
      this.clear();
    }, duration);
  }

  /**
   * Clears the current notification message.
   */
  clear(): void {
    this.notificationSubject.next(null);
  }
}