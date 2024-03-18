import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  faTimes = faTimes;


  constructor(public messagesService: MessageService) {

  }

}
