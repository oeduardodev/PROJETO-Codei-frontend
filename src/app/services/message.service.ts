import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  readonly message = signal('');

  addMessage(message: string) {
    this.message.set(message);

    setTimeout(() => {
      this.clear();
    }, 4000);
  }
  
  clear() {
    this.message.set('');
  }
}
