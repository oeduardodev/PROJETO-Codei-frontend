import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MessagesComponent } from './components/messages/messages.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessagesComponent]
})
export class AppComponent {
  title = 'Codei';
}
